const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
// const Tesseract = require("tesseract.js");
// const sharp = require("sharp");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const JSON_SECRET = process.env.JSON_SECRET || "asjbdh";

const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();



// const tessdataPath = path.join(__dirname, "tessdata")

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tiff");
  },
  filename: function (req, file, cb) {
    
    let code = req.params.branchCode || "default"; // Ensure code is provided
    let finalFilename = `${code}_${file.originalname}`;
    console.log(req.body);
    
    console.log("Saved as:", finalFilename);
    
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

app.post("/api/upload/:branchCode", upload.single("file"), (req, res) => {
  //console.log(req.files);
  //const files = req.files.map((file) => file.filename);
  res.json({ file: req.file });
});

// app.post("/ocrData", async (req, res) => {
//   const images = req.body.filenames;
//   var result = [];
  

//   for(let index=0;index<images.length;index++) {
   
      

//       const imagePath = path.join(__dirname, "tiff", images[index].filename);
     
//       try{

      
//       const { data: { text } } =await Tesseract.recognize(
//         imagePath, // Path to the image
//         "e13b", // Custom language traineddata file
//         {
//           // logger: (info) => console.log(info), // Log progress
//           langPath: tessdataPath, // Path to the tessdata folder
//         }
//       );
//       const value = text.split("\n").filter((line) => line.trim().length > 0);
//       const ocrData = value.pop();
//       // console.log(ocrData.length);
//       if(ocrData!=null && ocrData.length>5){

//         result.push(ocrData);
//       }
//     }catch(error){
//       console.error("Error:", error);
//     }

    
//   };
//   res.json({ result: result.filter((data) => data!=null) });
// });

// app.post("/toJpg", (req, res) => {
//   const images = req.body.filenames;

//   images.forEach((image) => {
//     try {
//       const input = path.join(__dirname, "tiff", image.filename);
//       const output = path.join(
//         __dirname,
//         "images",
//         image.filename.replace(".tif", ".jpg")
//       );
//       const output2 = path.join(
//         __dirname,
//         "B&Wimages",
//         image.filename.replace(".tif", ".jpg")
//       );
//       sharp(input)
//         .jpeg({ quality: 100 })
//         .toFile(output, (err, info) => {
//           // console.log(err, info);
//         });
//       sharp(input)
//         .greyscale()
//         .jpeg({ quality: 100 })
//         .toFile(output2, (err, info) => {
//           // console.log(err, info);
//         });
//     } catch (error) {
//       console.error(error);
//     }
//   });
//   res.json({ message: "Success" });
// });

app.post("/api/login",async (req,res) => {
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
  if(!user?.password){
    res.json({message:"No password found"})
  }
  const ifPasswordMatch = await bcrypt.compareSync(password,user?.password,10);

  
  
  if(ifPasswordMatch){
    const token = jwt.sign({email:email},JSON_SECRET);
    res.json({token})
  }else{
    res.json({message:"Incorrect Password"})
  }
  
 
})

app.get("/api/tokenCheck",async (req,res) => {
  const token = req.headers.authorization.split(" ")[1];

  if(!token) return res.json({message:"No token found"});
  try{
    const decodedToken = jwt.verify(token,JSON_SECRET); 
   
    res.json({message:"Valid token",email :decodedToken})
  }catch(err){
    res.json({message:"Invalid token"});
  }
})

app.post("/api/register",async (req,res) => {
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


app.get("/api/images/:file", (req, res) => {
  const image = path.join(__dirname, "images", req.params.file);
  res.sendFile(image);
})

app.use("/api/images", express.static(path.join(__dirname, "images")));
app.use("/api/tiff", express.static(path.join(__dirname, "tiff")));

app.listen(5000,"0.0.0.0", () => {
  console.log("Server started on port 5000");
});
