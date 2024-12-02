import TouristCart from "../models/touristCart.model.js";

export const getTouristCart = async (req, res) => {
    try {
        const touristID = req.user.userId;
        const touristCart = await TouristCart.find({ touristID }).populate("productID");
        res.status(200).json(touristCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateTouristCart = async (req, res) => {
    try {
        const touristID = req.user.userId;
        const { productID, count } = req.body;
        const existingCart = await TouristCart.findOne({ touristID, productID });

        if (existingCart) {
            existingCart.count = count;
            await existingCart.save();
            return res.status(200).json({
                message: "product quantity modified successfully",
                existingCart,
            });
        }
        const newCart = await TouristCart.create({ touristID, productID, count });
        res.status(201).json({ message: "product added to cart successfully", newCart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTouristCart = async (req, res) => {
    try {
        const touristID = req.user.userId;
        await TouristCart.deleteMany({ touristID });
        res.status(200).json({ message: "cart cleared successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteItemFromTouristCart = async (req, res) => {
    try {
        const touristID = req.user.userId;
        const productID = req.body.productID;
        await TouristCart.findOneAndDelete({ touristID, productID });
        res.status(200).json({ message: "product removed from cart successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
