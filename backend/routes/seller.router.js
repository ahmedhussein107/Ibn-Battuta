import express from "express";
import {
    createSeller,
    getSellers,
    getSellerById,
    updateSeller,
    deleteSeller,
    getSellersDocuments,
} from "../controllers/seller.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const sellerRouter = express.Router();

sellerRouter.post("/createSeller", createSeller);

sellerRouter.get("/getSellers", getSellers);

sellerRouter.get("/getSellerById", isAuthenticated, getSellerById);

sellerRouter.patch("/updateSeller/:id", updateSeller);

sellerRouter.delete("/deleteSeller/:id", deleteSeller);

sellerRouter.get("/documents", getSellersDocuments);

export default sellerRouter;
