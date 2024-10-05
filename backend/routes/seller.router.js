import express from "express";
import {
    createSeller,
    getAllSellers,
    getSellerById,
    updateSeller,
    deleteSeller,
} from "../controllers/seller.controller.js";

const sellerRouter = express.Router();

sellerRouter.post("/createSeller", createSeller);

sellerRouter.get("/allSellers", getAllSellers);

sellerRouter.get("/seller/:id", getSellerById);

sellerRouter.patch("/updateSeller/:id", updateSeller);

sellerRouter.delete("/deleteSeller/:id", deleteSeller);

export default sellerRouter;
