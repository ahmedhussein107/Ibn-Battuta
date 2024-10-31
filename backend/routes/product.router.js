import express from "express";
import {
    createProduct,
    updateProduct,
    allProducts,
    deleteProduct,
    getProduct,
    searchProducts,
} from "../controllers/product.controller.js";
const productRouter = express.Router();

const _print = function (req, res, next) {
    console.log("i am here in product router");
    console.log("body is ", req.body);
    next();
};

productRouter.post("/createProduct", _print, createProduct);

productRouter.get("/allProducts", allProducts);

productRouter.get("/getProduct/:id", getProduct);

productRouter.put("/updateProduct/:id", updateProduct);

productRouter.delete("/deleteProduct/:id", deleteProduct);

productRouter.get("/search", searchProducts);

export default productRouter;
