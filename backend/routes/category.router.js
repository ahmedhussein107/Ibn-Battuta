import express from "express";
import {
	createCategory,
	getCategories,
	updateCategory,
	deleteCategory,
	getCategoryByID,
	searchCategories,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/createCategory", createCategory);
categoryRouter.get("/allCategories", getCategories);
categoryRouter.put("/updateCategory/:id", updateCategory);
categoryRouter.delete("/deleteCategory/:id", deleteCategory);
categoryRouter.get("/getCategoryByID/:id", getCategoryByID);
categoryRouter.get("/searchCategories", searchCategories);

export default categoryRouter;
