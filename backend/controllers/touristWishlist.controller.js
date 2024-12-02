import TouristWishlist from "../models/touristWishlist.model.js";
import { buildFilter } from "../utilities/searchUtils.js";

export const toggleWishlist = async (req, res) => {
    const touristID = req.user.userId;
    const { productID, isInWishlist } = req.body;

    try {
        if (isInWishlist) {
            const product = await TouristWishlist.deleteOne({
                touristID,
                productID,
            });
            res.status(200).json({
                message: "Product deleted from wishlist successfully",
                product,
            });
        } else {
            const product = await TouristWishlist.create({
                touristID,
                productID,
            });
            res.status(200).json({
                message: "Product added to wishlist successfully",
                product,
            });
        }
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const getProductsStatus = async (req, res) => {
    const touristID = req.user.userId;
    const productIDs = req.body.productIDs;
    const result = {};
    try {
        for (let i = 0; i < productIDs.length; i++) {
            const product = await TouristWishlist.findOne({
                touristID,
                productID: productIDs[i],
            });
            if (product) {
                result[productIDs[i]] = true;
            } else {
                result[productIDs[i]] = false;
            }
        }
        console.log("result", result);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const getWishlistProducts = async (req, res) => {
    try {
        const id = req.user.userId;
        const { rating, page, limit, ...rest } = req.query;
        const _page = Math.max(1, parseInt(req.query.page) || 1);
        const _limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (_page - 1) * _limit;
        let query = buildFilter(rest);
        query.touristID = id;
        let wishlist = await TouristWishlist.find(query).populate("productID");
        wishlist = wishlist.map((item) => item.productID);
        if (rating) {
            const bounds = rating.split("-");
            const minRating = bounds[0] ? parseInt(bounds[0]) : -1;
            const maxRating = bounds[1] ? parseInt(bounds[1]) : 5;
            wishlist = wishlist.filter((product) => {
                return product.rating >= minRating && product.rating <= maxRating;
            });
        }
        if (sortBy) {
            if (sortBy === "priceAsc") {
                wishlist.sort((a, b) => a.price - b.price);
            } else if (sortBy === "priceDesc") {
                wishlist.sort((a, b) => b.price - a.price);
            } else if (sortBy === "ratingAsc") {
                wishlist.sort((a, b) => a.rating - b.rating);
            } else if (sortBy === "ratingDesc") {
                wishlist.sort((a, b) => b.rating - a.rating);
            }
        }
        const count = wishlist.length;
        wishlist = wishlist.slice(toSkip, Math.min(toSkip + _limit, count));
        res.status(200).json({
            result: wishlist,
            totalPages: count > 0 ? Math.ceil(count / _limit) : 1,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
