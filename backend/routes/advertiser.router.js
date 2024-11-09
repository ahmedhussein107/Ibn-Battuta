import express from "express";
import {
    createAdvertiser,
    getAdvertisers,
    getAdvertiserById,
    updateAdvertiser,
    deleteAdvertiser,
    getAdvertisersDocuments,
} from "../controllers/advertiser.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const advertiserRouter = express.Router();

advertiserRouter.post("/createAdvertiser", createAdvertiser);

advertiserRouter.get("/getAdvertisers", getAdvertisers);

advertiserRouter.get("/advertiser", isAuthenticated, getAdvertiserById);

advertiserRouter.put("/updateAdvertiser", isAuthenticated, updateAdvertiser);

advertiserRouter.delete("/deleteAdvertiser", isAuthenticated, deleteAdvertiser);

advertiserRouter.get("/documents", getAdvertisersDocuments);

export default advertiserRouter;
