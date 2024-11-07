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
    getProductsById,
} from "../controllers/product.controller.js";

import {isAuthenticated} from "../routers.middleware/authentication.js";
const productRouter = express.Router();

productRouter.post("/createProduct", isAuthenticated, createProduct);

productRouter.get("/getAllProducts", getAllProducts);

productRouter.get("/getProduct/:id", getProduct);

productRouter.patch("/updateProduct/:id", updateProduct);

productRouter.delete("/deleteProduct/:id", deleteProduct);

productRouter.get("/search", searchProducts);

productRouter.patch("/archiveProduct/:id", archeiveProduct);

productRouter.patch("/unarchiveProduct/:id", unarcheiveProduct);

productRouter.get("/getProductsById/:id", getProductsById);

export default productRouter;
