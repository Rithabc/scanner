const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const bcrypt = require("bcrypt")

const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();



const tessdataPath = path.join(__dirname, "tessdata");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let i=1;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tiff");
  },
  filename: function (req, file, cb) {
    
    let code = req.params.branchCode || "default"; // Ensure code is provided
    let name = i.toString().padStart(5, "0"); // Format number to 5 digits
    let finalFilename = `${code}_${name}.tif`;
    console.log(req.body);
    
    console.log("Saved as:", finalFilename);
    
    i++; // Increment counter for next upload
    cb(null, finalFilename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    
    const filetype = file.originalname.split(".").pop();
    if (filetype !== "jpg") {
    }
    cb(null, true);
  },
});

app.post("/upload/:branchCode", upload.array("files"), (req, res) => {
  const files = req.files.map((file) => file.filename);
  res.json({ file: files });
});

app.post("/ocrData", async (req, res) => {
  const images = req.body.filenames;
  var result = [];
  

  for(let index=0;index<images.length;index++) {
   
      

      const imagePath = path.join(__dirname, "tiff", images[index].filename);
     
      try{

      
      const { data: { text } } =await Tesseract.recognize(
        imagePath, // Path to the image
        "e13b", // Custom language traineddata file
        {
          // logger: (info) => console.log(info), // Log progress
          langPath: tessdataPath, // Path to the tessdata folder
        }
      );
      const value = text.split("\n").filter((line) => line.trim().length > 0);
      const ocrData = value.pop();
      // console.log(ocrData.length);
      if(ocrData!=null && ocrData.length>5){

        result.push(ocrData);
      }
    }catch(error){
      console.error("Error:", error);
    }

    
  };
  res.json({ result: result.filter((data) => data!=null) });
});

app.post("/toJpg", (req, res) => {
  const images = req.body.filenames;

  images.forEach((image) => {
    try {
      const input = path.join(__dirname, "tiff", image.filename);
      const output = path.join(
        __dirname,
        "images",
        image.filename.replace(".tif", ".jpg")
      );
      const output2 = path.join(
        __dirname,
        "B&Wimages",
        image.filename.replace(".tif", ".jpg")
      );
      sharp(input)
        .jpeg({ quality: 100 })
        .toFile(output, (err, info) => {
          // console.log(err, info);
        });
      sharp(input)
        .greyscale()
        .jpeg({ quality: 100 })
        .toFile(output2, (err, info) => {
          // console.log(err, info);
        });
    } catch (error) {
      console.error(error);
    }
  });
  res.json({ message: "Success" });
});

app.post("/login",async (req,res) => {
  const {email,password} = req.body;
  // const hashedPassword = bcrypt.hashSync(password,10);
 
  const user = await prisma.users.findFirst({
    where: {
      email: email,
      
    }
  });

  if(!user){
    res.json({message:"No user found"})
  }
  const ifPasswordMatch = await bcrypt.compareSync(password,user?.password);

  if(ifPasswordMatch){
    res.json({message:"Done"})
  }else{
    res.json({message:"Incorrect Password"})
  }
  
 
})

app.post("/register",async (req,res) => {
  const {email,password} = req.body;
  const hashedPassword = bcrypt.hashSync(password,10);
  
  const user = await prisma.users.create({
    data: {
      email: email,
      password: hashedPassword
    }
  });
  res.json({message: "Success"});
});


// app.get("/images/:file", (req, res) => {
//   const image = path.join(__dirname, "images", req.params.file);
//   res.sendFile(image);
// })

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/B&Wimages", express.static(path.join(__dirname, "B&Wimages")));

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
