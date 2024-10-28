import express from "express";
const generalRouter = express.Router();
import { updatePassword, login } from "../controllers/general.controller.js";

generalRouter.put("/updatePassword", updatePassword);
generalRouter.post("/login", login);
export default generalRouter;
