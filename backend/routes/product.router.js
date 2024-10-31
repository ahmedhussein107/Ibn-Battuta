import express from "express";
import { upload } from "../routers.middleware/mutler.config.js";
import {
	uploadImage,
	uploadImages,
	uploadDocument,
	uploadDocuments,
} from "../routers.middleware/cloudinary.config.js";
import {
	createProduct,
	updateProduct,
	getAllProducts,
	deleteProduct,
	getProduct,
	searchProducts,
	archeiveProduct,
	unarcheiveProduct,
} from "../controllers/product.controller.js";
const productRouter = express.Router();

const _print = function (req, res, next) {
	console.log("i am here in product router");
	console.log("body is ", req.body);
	next();
};

productRouter.post("/createProduct", _print, uploadDocuments, createProduct);

productRouter.get("/getAllProducts", getAllProducts);

productRouter.get("/getProduct/:id", getProduct);

productRouter.patch("/updateProduct/:id", updateProduct);

productRouter.delete("/deleteProduct/:id", deleteProduct);

productRouter.get("/search", searchProducts);

productRouter.patch("/archiveProduct/:id", archeiveProduct);

productRouter.patch("/unarchiveProduct/:id", unarcheiveProduct);

export default productRouter;
