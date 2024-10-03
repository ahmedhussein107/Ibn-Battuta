import express from "express"
import Product from "../models/product.model.js";

const productRouter = express.Router();

productRouter.post("/createProduct", async (req, res) => {
    try {
      console.log(req.body);
      const product = await Product.create(req.body);
      res.json(product);
    } catch (e) {
        res.status(400).json({e: e.message});
    }
});


productRouter.get("/allProducts", async (req, res) => {
try {
    const products = await Product.find().populate("ownerID");
    res.json(products);
} catch (e) {
    res.status(400).json({e: e.message});
}
});

productRouter.put("/updateProduct", async (req, res) => {
    const {product} = req.body
    try {
        const products = await Product.updateOne({}, {product});
        res.json(products);
    } catch (e) {
        res.status(400).json({e: e.message});
    }
    });


    productRouter.delete("/deleteProduct", async (req, res) => {
        const {product} = req.body
        try {
            const products = await Product.deleteOne({product});
            res.json(products);
        } catch (e) {
            res.status(400).json({e: e.message});
        }
        });

export default productRouter;
