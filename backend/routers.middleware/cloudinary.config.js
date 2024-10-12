import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

console.log("the .env test", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  // secure: true, // Uncomment if you're using HTTPS
});

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = path.dirname(__filename); // Get the directory name

const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}
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


