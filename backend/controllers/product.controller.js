import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    console.log("i am here at controller of product");
    const productData = req.body;

    if (req.files && req.files.length > 0) {
      productData.pictures = req.files.map((file) => file.path);
    } else {
      productData.pictures = [];
    }
    console.log("productData: ", productData);
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("i am here at updating product");
    console.log(req.body);
    console.log(await Product.findById(id));
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(product);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const allProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $gt: 0 } }).populate(
      "ownerID"
    );
    res.json(products);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productID = id;
    const product = await Product.findById(productID)
      .populate("ownerID")
      .populate("ratings");
    console.log(product);
    res.status(200).json(product);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};
export const deleteProduct = async (req, res) => {
  const { productID } = req.params;
  try {
    await Product.findByIdAndDelete(productID);
    res.json({ message: "deleted successfully" });
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};
