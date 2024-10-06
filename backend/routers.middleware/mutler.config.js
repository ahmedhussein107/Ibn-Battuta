import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";
    console.log("i am here in multer - before type check");

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".gif") {
      uploadPath += "images/";
      console.log("Uploading to images folder");
    } else if (
      ext === ".pdf" ||
      ext === ".doc" ||
      ext === ".docx" ||
      ext === ".txt"
    ) {
      uploadPath += "documents/";
      console.log("Uploading to documents folder");
    } else {
      return cb(new Error("Invalid file type"), false);
    }

    fs.mkdirSync(uploadPath, { recursive: true }); // create the directory if not exist
    console.log("Directory created or already exists:", uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Set the file name as the original name with a timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
  ];

  if (!allowedExtensions.includes(ext)) {
    return cb(
      new Error("Only images and documents (PDF, DOC, DOCX, TXT) are allowed"),
      false
    );
  }

  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
