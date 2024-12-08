import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";

import { isAuthenticated } from "../routers.middleware/authentication.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/getAnalytics", isAuthenticated, getAnalytics);

export default analyticsRouter;
