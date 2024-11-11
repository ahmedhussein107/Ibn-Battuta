import express from "express";
import {
    createSeller,
    getSellers,
    getSellerById,
    updateSeller,
    deleteSeller,
    getSellersDocuments,
    changeSellerPassword,
} from "../controllers/seller.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const sellerRouter = express.Router();

sellerRouter.post("/createSeller", createSeller);

sellerRouter.get("/getSellers", getSellers);

sellerRouter.get("/getSellerById", isAuthenticated, getSellerById);

sellerRouter.put("/updateSeller", isAuthenticated, updateSeller);

sellerRouter.delete("/deleteSeller", isAuthenticated, deleteSeller);

sellerRouter.put("/changeSellerPassword", isAuthenticated, changeSellerPassword);

sellerRouter.get("/documents", getSellersDocuments);

export default sellerRouter;
