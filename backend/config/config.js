import dotenv from "dotenv";

dotenv.config();

// server
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
// amadeus
export const API_KEY = process.env.AMADEUS_API_KEY;
export const API_SECRET = process.env.AMADEUS_API_SECRET;
// email
export const WEBSITE_EMAIL = process.env.WEBSITE_EMAIL;
export const WEBSITE_EMAIL_PASSWORD = process.env.WEBSITE_EMAIL_PASSWORD;
