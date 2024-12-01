import express from "express";
import {
	validatePromoCode,
	applyPromoCode,
	createGeneralPromoCode,
} from "../controllers/promocode.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const promoCodeRouter = express.Router();

promoCodeRouter.post("/validatePromoCode", isAuthenticated, validatePromoCode);
promoCodeRouter.post("/applyPromoCode", isAuthenticated, applyPromoCode);
promoCodeRouter.post("/createPromoCode", createGeneralPromoCode);

export default promoCodeRouter;
