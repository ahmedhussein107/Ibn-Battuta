import express from "express";
import {
    createProduct,
    updateProduct,
    getAllProducts,
    deleteProduct,
    getProduct,
    searchProducts,
    archeiveProduct,
    unarcheiveProduct,
    getProductBySellerID,
} from "../controllers/product.controller.js";
const productRouter = express.Router();

const _print = function (req, res, next) {
    console.log("body is ", req.body);
    next();
};

productRouter.post("/createProduct", _print, createProduct);

productRouter.get("/getAllProducts", getAllProducts);

productRouter.get("/getProduct/:id", getProduct);

productRouter.patch("/updateProduct/:id", updateProduct);

productRouter.delete("/deleteProduct/:id", deleteProduct);

productRouter.get("/search", searchProducts);

productRouter.patch("/archiveProduct/:id", archeiveProduct);

productRouter.patch("/unarchiveProduct/:id", unarcheiveProduct);

productRouter.get("/getProductBySellerID/:id", getProductBySellerID);

export default productRouter;
