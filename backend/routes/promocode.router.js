import express from "express";
import {
	validatePromoCode,
	applyPromoCode,
	createGeneralPromoCode,
} from "../controllers/promocode.controller.js";
const promoCodeRouter = express.Router();

promoCodeRouter.post("/validatePromoCode", validatePromoCode);
promoCodeRouter.post("/applyPromoCode", applyPromoCode);
promoCodeRouter.post("/createPromoCode", createGeneralPromoCode);

export default promoCodeRouter;
