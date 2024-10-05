import express from "express";
import {
  createUsername,
  getUsernames,
  updateUsername,
  deleteUsername,
} from "../controllers/username.controller.js";

const usernameRouter = express.Router();

usernameRouter.post("/createUsername", createUsername);


usernameRouter.get("/allUsernames", getUsernames);

usernameRouter.put("/updateUsername", updateUsername);

usernameRouter.delete("/deleteUsername", deleteUsername);

export default usernameRouter;
