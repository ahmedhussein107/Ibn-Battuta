import express from "express";
import { 
    createProduct, 
    getAllProducts,
    updateProduct, 
    deleteProduct
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post("/createProduct", createProduct);

productRouter.get("/allProducts", getAllProducts);

productRouter.put("/updateProduct", updateProduct);

productRouter.delete("/deleteProduct", deleteProduct);

export default productRouter;
