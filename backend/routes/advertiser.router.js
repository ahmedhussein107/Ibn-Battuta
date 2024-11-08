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

const advertiserRouter = express.Router();

advertiserRouter.post("/createAdvertiser", createAdvertiser);

advertiserRouter.get("/getAdvertisers", getAdvertisers);

advertiserRouter.get("/getAdvertiserById", isAuthenticated, getAdvertiserById);

advertiserRouter.patch("/updateAdvertiser/:id", updateAdvertiser);

advertiserRouter.delete("/deleteAdvertiser/:id", deleteAdvertiser);

advertiserRouter.get("/documents", getAdvertisersDocuments);

export default advertiserRouter;
