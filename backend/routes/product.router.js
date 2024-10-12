import express from "express"
import { upload } from "../routers.middleware/mutler.config.js";
import { uploadImage } from "../routers.middleware/cloudinary.config.js";
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

productRouter.post(
  "/createProduct",
  _print,
  // upload.array("pictures"),
  uploadImage,
  createProduct
);

productRouter.get("/allProducts", allProducts);

productRouter.get("/getProduct/:id", getProduct);

productRouter.put("/updateProduct/:id", updateProduct);

productRouter.delete("/deleteProduct/:id", deleteProduct);

productRouter.get("/search", searchProducts);

export default productRouter;
