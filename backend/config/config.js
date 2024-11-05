import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const API_KEY = process.env.AMADEUS_API_KEY;
export const API_SECRET = process.env.AMADEUS_API_SECRET;
