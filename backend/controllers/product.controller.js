import Product from "../models/product.model.js";
import { buildFilter } from "../utilities/searchUtils.js";
import Order from "../models/order.model.js";
import Seller from "../models/seller.model.js";
import Admin from "../models/admin.model.js";
export const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const { userId, userType } = req.user;
        productData.ownerID = userId;
        productData.ownerType = userType;
        console.log("productData: ", productData);
        const newProduct = await Product.create(productData);
        res.status(201).json(newProduct);
    } catch (e) {
        console.log(e);
        res.status(400).json({ e: e.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
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

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            quantity: { $gt: 0 },
            isArchived: false,
        }).populate("ownerID ratings");
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
export const getProductOwnerName = async (ownerID, ownerType) => {
    console.log("ownerID: ", ownerID);
    if (ownerType === "Seller") {
        return (await Seller.findById(ownerID))?.name;
    } else {
        return (await Admin.findById(ownerID))?.name;
    }
};

export const getProductsById = async (req, res) => {
    const query = buildFilter(req.query);
    const _id = req.user.userId;
    try {
        const products = await Product.find({ ownerID: _id, ...query });
        res.status(200).json(products);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const ordered = await Order.findOne({
            "purchases.product": id,
            status: "pending",
        });
        console.log(1);
        // console.log(ordered._id);
        if (ordered) {
            console.log(2);
            return res
                .status(400)
                .json({ message: "Cannot delete a product that is ordered" });
        }
        await Product.findByIdAndDelete(id);
        console.log(3);
        res.json({ message: "deleted successfully" });
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const deleteProducts = async (req, res) => {
    try {
        await Product.deleteMany(req.body);
        res.json({ message: "deleted successfully" });
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const searchProducts = async (req, res) => {
    try {
        const { rating, sortBy, page, limit, ...rest } = req.query;
        const _page = Math.max(1, parseInt(req.query.page) || 1);
        const _limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (_page - 1) * _limit;
        const query = buildFilter(rest);
        let products = await Product.find({
            ...query,
            isArchived: false,
        }).populate("ownerID ratings");
        if (rating) {
            const bounds = rating.split("-");
            const minRating = bounds[0] ? parseInt(bounds[0]) : -1;
            const maxRating = bounds[1] ? parseInt(bounds[1]) : 5;
            products = products.filter((product) => {
                return product.rating >= minRating && product.rating <= maxRating;
            });
        }
        if (sortBy) {
            if (sortBy === "priceAsc") {
                products.sort((a, b) => a.price - b.price);
            } else if (sortBy === "priceDesc") {
                products.sort((a, b) => b.price - a.price);
            } else if (sortBy === "ratingAsc") {
                products.sort((a, b) => a.rating - b.rating);
            } else if (sortBy === "ratingDesc") {
                products.sort((a, b) => b.rating - a.rating);
            }
        }
        const count = products.length;
        products = products.slice(toSkip, Math.min(toSkip + _limit, count));
        return res.status(200).json({
            result: products,
            totalPages: count > 0 ? Math.ceil(count / _limit) : 1,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const archeiveProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            {
                isArchived: true,
            },
            { new: true }
        );
        res.json(product);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const unarcheiveProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            {
                isArchived: false,
            },
            { new: true }
        );
        res.json(product);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};
