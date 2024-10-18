import express from "express";
const generalRouter = express.Router();
import {
  setAcceptedTerms,
  updatePassword,
  login,
} from "../controllers/general.controller.js";

generalRouter.post("/setAcceptedTerms", setAcceptedTerms);
generalRouter.put("/updatePassword", updatePassword);
generalRouter.post("/login", login);
export default generalRouter;
