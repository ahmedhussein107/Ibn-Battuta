import Product from "../models/product.model.js";
import { buildFilter } from "../utilities/searchUtils.js";

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
		const product = await Product.findById(productID).populate("ownerID").populate("ratings");
		console.log(product);
		res.status(200).json(product);
	} catch (e) {
		res.status(400).json({ e: e.message });
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
		await Product.findByIdAndDelete(id);
		res.json({ message: "deleted successfully" });
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const searchProducts = async (req, res) => {
	try {
		const { rating, ...rest } = req.query;
		const products = await Product.find(buildFilter(rest));
		if (rating) {
			const bounds = rating.split("-");
			const minRating = bounds[0] != "null" ? parseInt(bounds[0]) : -1;
			const maxRating = bounds[1] != "null" ? parseInt(bounds[1]) : -1;
			const result = products.filter((product) => {
				console.log(
					"product",
					rating,
					product.rating >= minRating && product.rating <= maxRating
				);
				return product.rating >= minRating && product.rating <= maxRating;
			});
			return res.status(200).json(result);
		}
		return res.status(200).json(products);
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
