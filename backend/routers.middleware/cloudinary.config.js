import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    // secure: true, // Uncomment if you're using HTTPS
});

import fs from "fs";
import path from "path"; 
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const ALLOWED_FILE_TYPES = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
const validateFileType = (file) => {
  const isValid = ALLOWED_FILE_TYPES.test(
    file.name.split(".").pop().toLowerCase()
  );
  return isValid;
};

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.files || !req.files.pictures) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.files.pictures;
        const tempFilePath = path.join(__dirname, "temp", file.name);

        await file.mv(tempFilePath);

        const result = await cloudinary.uploader.upload(tempFilePath, {
            folder: "images",
            resource_type: "auto",
        });

        const imageUrl = result.secure_url;
        console.log("Uploaded image URL:", imageUrl);

        fs.unlinkSync(tempFilePath);
        req.image = imageUrl;
        next();
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ error: "Failed to upload image" });
    }
};

export const uploadImages = async (req, res, next) => {
    try {
        if (!req.files || !req.files.pictures) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const files = req.files.pictures;
        let images = [];
        for (const file of files) {
            const tempFilePath = path.join(__dirname, "temp", file.name);

            await file.mv(tempFilePath);

            const result = await cloudinary.uploader.upload(tempFilePath, {
                folder: "images",
                resource_type: "auto",
            });

            const imageUrl = result.secure_url;
            images.push(imageUrl);
            console.log("Uploaded image URL:", imageUrl);
            fs.unlinkSync(tempFilePath);
        }
        req.images = images;
        next();
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ error: "Failed to upload image" });
    }
};

export const uploadDocument = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.files.pictures);
    if (!req.files || !req.files.pictures) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.pictures;

    if (!validateFileType(file)) {
      return res.status(400).json({
        error:
          "Invalid file type. Only image, PDF, and text files are allowed.",
      });
    }

    const tempFilePath = path.join(__dirname, "temp", file.name);

    await file.mv(tempFilePath);

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "documents",
      resource_type: "auto",
    });
    console.log("result", result);

    req.document = result.secure_url;
    console.log("Uploaded file URL:", req.fileUrl);

    fs.unlinkSync(tempFilePath);
    next();
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
};

export const uploadDocuments = async (req, res, next) => {
  try {
    req.setTimeout(60000);
    if (!req.files || !req.files.documents) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const files = Array.isArray(req.files.documents)
      ? req.files.documents
      : [req.files.documents];
    const fileUploadPromises = files.map(async (file) => {
      if (!validateFileType(file)) {
        throw new Error(
          `Invalid file type for ${file.name}. Only image, PDF, and text files are allowed.`
        );
      }

      const tempFilePath = path.join(__dirname, "temp", file.name);
      await file.mv(tempFilePath);

      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "documents",
        resource_type: "auto",
      });
      console.log("the url", result.url);

      fs.unlinkSync(tempFilePath);
      return result.secure_url;
    });

    req.documents = await Promise.all(fileUploadPromises);
    next();
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ error: "Failed to upload files" });
  }
};
