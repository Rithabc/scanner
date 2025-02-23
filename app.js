const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
// const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const JSZip = require("jszip");
// const imagemagick = require("imagemagick-native");
const { exec  } = require("child_process");
const gm = require("gm").subClass({imageMagick: false});
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
    cb(null, "./imageFromScanner");
  },
  filename: function (req, file, cb) {
    
    let code = req.params.branchCode || "default"; // Ensure code is provided
    let finalFilename = `${code}_${file.originalname.split(".")[0]}_${parseInt((file.originalname.split(".")[0].substring(15))) %2!=0 ? "Front" : "Back"}.jpg`;
    console.log(file.originalname.split(".")[0]);
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

 

async function convertImageToTIFFWithCCITT4(inputImagePath, outputImagePath,fileName) {
  await sharp(inputImagePath)
  .grayscale()
  .threshold(128)
  .toColorspace("b-w")
  .tiff({
    compression:"ccittfax4",
    bitdepth:1
  })
  .toFile(fileName)
  .then(async (info) => {
    // const tempImagePath = path.join("./", 'tiff',fileName); // Temporary file for ImageMagick output
      const command = `convert ${fileName} -units PixelsPerInch -density 200 -compress Group4 ${outputImagePath}
      `; 
      await exec(command,async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        await fs.unlinkSync(`${fileName}`); // Delete temporary file
      });
      
    })
    .catch((err) => {
      console.error(err);
    });
    


}

async function jpgToJpeg(inputImagePath, outputImagePath) {
  const metadata = await sharp(inputImagePath).metadata();
  await sharp(inputImagePath)
  .grayscale()
  .resize(Math.floor(metadata.width / 2), Math.floor(metadata.height / 2))
  .jpeg({quality:80})
  .toFile(outputImagePath)
  .then((info) => {
    const command = `convert ${outputImagePath} -units PixelsPerInch -density 100 -type TrueColor ${outputImagePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

  })
  .catch((err) => {
    console.error(err);
  });
}

async function run(input,output,filename) {
  if(input.includes("Front")){
  await convertImageToTIFFWithCCITT4(input,output,`./tiff/${filename}`);
  await jpgToJpeg(input,`./jpeg/${filename}`);
  }
  else{
  await convertImageToTIFFWithCCITT4(input,output,`./tiff/${filename}`);
  }
}
run("./imageFromScanner/005_210220251742491770001_Front.jpg","./tifImages/005_210220251742491770001_Front.tiff","005_210220251742491770001_Front.jpg");
run("./imageFromScanner/005_210220251742494360002_Back.jpg","./tifImages/005_210220251742494360002_Back.tiff","005_210220251742494360002_Back.jpg");

app.post("/api/upload/:branchCode", upload.single("file"),async (req, res) => {
  if(req.file.path.includes("Front")){

  await convertImageToTIFFWithCCITT4(req.file.path,`./tifImages/${req.file.filename.replace(".jpg",".tiff")}`,`./tiff/${req.file.filename.replace(".jpg",".tiff")}`);
  
  await jpgToJpeg(req.file.path,`./jpeg/${req.file.filename.replace(".jpg",".jpeg")}`);
  }
  else{
  await convertImageToTIFFWithCCITT4(req.file.path,`./tifImages/${req.file.filename.replace(".jpg",".tiff")}`,`./tiff/${req.file.filename.replace(".jpg",".tiff")}`);

  }

  console.log(req.file);



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

// app.post("/api/download", async (req, res) => {
//   try{
//     const zip = new JSzip();
//     const {filename,branchCode} = req.body;

//     // filename?.map(async (file) => {
//     //   console.log(file);
//     //   const image =await  fs.readFileSync(path.join(__dirname, "tifImages", `${branchCode}_${file.filename.split(".")[0]}_${parseInt((file.filename.split(".")[0].substring(15))) %2!=0 ? "Front" : "Back"}.tiff`));
//     //   await zip.file(file, image);
//     // })

//     for(const file of filename){
//       const image =  fs.readFileSync(path.join(__dirname, "tifImages", `${branchCode}_${file.filename.split(".")[0]}_${parseInt((file.filename.split(".")[0].substring(15))) %2!=0 ? "Front" : "Back"}.tiff`));
//        zip.file(file.filename, image);
//     }
//     const zipData = await zip.generateAsync({type:"nodebuffer"});
//     res.setHeader("Content-Disposition", 'attachment; filename="download.zip"');
//     res.setHeader("Content-Type", "application/zip");

//   res.send(zipData);
//   }catch(error){
//     console.error(error);
//   }
// });



app.post("/api/download", async (req, res) => {
  try {
    const zip = new JSZip();
    const { filename, branchCode } = req.body;

    if (!filename || !branchCode) {
      return res.status(400).send("Missing filename or branchCode");
    }
    const folder = zip.folder('files');

    // Read and add files to ZIP
    for (const file of filename) {
      try {
        const fileNameWithoutExt = file.filename.split(".")[0];
        const frontOrBack = parseInt(fileNameWithoutExt.substring(15)) % 2 !== 0 ? "Front" : "Back";
        const filePath = path.join(__dirname, "tifImages", `${branchCode}_${fileNameWithoutExt}_${frontOrBack}.tiff`);

        if (fs.existsSync(filePath)) {
          const image = fs.readFileSync(filePath);
          folder.file(`${fileNameWithoutExt}_${frontOrBack}.tiff`, image); // Save with correct filename in ZIP
          // fs.writeFileSync(path.join(__dirname, "jpeg", `${fileNameWithoutExt}_${frontOrBack}.jpeg`), image);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      } catch (fileError) {
        console.error(`Error reading file: ${file.filename}`, fileError);
      }
    }

    // Generate ZIP in memory
    const zipData = await zip.generateAsync({ type: "nodebuffer" });
    fs.writeFileSync(path.join(__dirname,"tiff", "download.zip"), zipData);
    // Set headers for download
    res.setHeader("Content-Disposition", 'attachment; filename="files.zip"');
    res.setHeader("Content-Type", "application/zip");

    res.send(zipData); // Send ZIP file to the client
  } catch (error) {
    console.error("ZIP Creation Error:", error);
    res.status(500).send("Error creating ZIP file.");
  }
});

app.use("/api/images", express.static(path.join(__dirname, "images")));
app.use("/api/tiff", express.static(path.join(__dirname, "tiff")));
app.use("/api/imageFromScanner", express.static(path.join(__dirname, "imageFromScanner")));
app.use("/api/tifImages", express.static(path.join(__dirname, "tifImages")));
app.use("/api/jpeg", express.static(path.join(__dirname, "jpeg")));





const sFilePath = ".\\images\\"; // Set file path

async function convertImageCTS(imageBuffer, fileType, textOverlay = "") {
    try {
        let image = sharp(imageBuffer);

        // Get metadata for width/height
        let metadata = await image.metadata();

        if (fileType === "TIFF") {
            let tiffImage = image.withMetadata({ density: 200 });

            if (textOverlay) {
                tiffImage = tiffImage.composite([{
                    input: Buffer.from(
                        `<svg width="${metadata.width}" height="${metadata.height}">
                            <text x="50%" y="50%" font-size="22" fill="black" text-anchor="middle">${textOverlay}</text>
                         </svg>`
                    ),
                    top: metadata.height / 4,
                    left: metadata.width / 4
                }]);
            }

            return await tiffImage
                .resize(metadata.width, metadata.height)
                .tiff({ compression: "lzw" })
                .toBuffer();
        }

        if (fileType === "JPEG") {
            return await image
                .resize({ width: Math.floor(metadata.width / 2), height: Math.floor(metadata.height / 2) })
                .jpeg({ quality: 80 })
                .toBuffer();
        }

        throw new Error("Unsupported file type");
    } catch (error) {
        console.error("Error processing image:", error);
        return null;
    }
}

async function processImages() {
    try {
      
        const bImgeBF = fs.readFileSync(path.join(sFilePath, "000_170220251545298800003_Front.jpg"));
        const bImgeBR = fs.readFileSync(path.join(sFilePath, "000_170220251545298800003_Front.jpg"));

     
        const vCTSImageGF = await convertImageCTS(bImgeBF, "JPEG");

// 
        // Write output images
        if (vCTSImageGF) fs.writeFileSync(path.join(sFilePath, "CTS_FrontImage.JPEG"), vCTSImageGF);
        // if (vCTSImageBF) fs.writeFileSync(path.join(sFilePath, "CTS_FrontImage.TIFF"), vCTSImageBF);
        // if (vCTSImageBR) fs.writeFileSync(path.join(sFilePath, "CTS_BackImage.TIFF"), vCTSImageBR);

        console.log("Image processing completed.");
    } catch (error) {
        console.error("Error processing files:", error);
    }
}

// Run the function
// processImages();


// const inputImagePath = path.join('./images', '000_170220251545298800003_Front.jpg');
// const outputImagePath = path.join('./images', 'withSharp_000_170220251545298800003_Front.tiff');
// convertImageToTIFFWithCCITT4(inputImagePath,outputImagePath);


app.listen(5000,"0.0.0.0", () => {
  console.log("Server started on port 5000");
});
