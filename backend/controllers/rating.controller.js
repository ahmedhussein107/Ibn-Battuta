import Rating from "../models/rating.model.js";
import Product from "../models/product.model.js";
import Itinerary from "../models/itinerary.model.js";
import TourGuide from "../models/tourguide.model.js";
import Activity from "../models/activity.model.js";

export const createRating = async (req, res) => {
	try {
		// TODO: add the rating to the thing being rated
		const rating = await Rating.create(req.body);
		res.status(201).json(rating);
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const getRatings = async (req, res) => {
	try {
		const ratings = await Rating.find(req.body); // in case of filtering
		res.status(200).json(ratings);
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const getRatingById = async (req, res) => {
	try {
		const rating = await Rating.findById(req.params.id).populate("touristID");
		if (rating) {
			res.status(200).json(rating);
		} else {
			res.status(404).json({ e: "Rating not found" });
		}
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const updateRating = async (req, res) => {
	try {
		const rating = await Rating.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (rating) {
			res.status(200).json(rating);
		} else {
			res.status(404).json({ e: "Rating not found" });
		}
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const deleteRating = async (req, res) => {
	try {
		const rating = await Rating.findByIdAndDelete(req.params.id);
		if (rating) {
			res.status(200).json({ message: "Rating deleted successfully" });
		} else {
			res.status(404).json({ e: "Rating not found" });
		}
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const rateProduct = async (req, res) => {
	try {
		// rating should have touristID, rating, comment
		const touristID = req.user.userId;
		const { rating, comment } = req.body;
		const productID = req.params.id; // Extract productID from params
		const product = await Product.findById(productID);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		const newRating = await Rating.create({ touristID, rating, comment });
		product.addRating(newRating);
		res.status(201).json(newRating);
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const rateTourGuide = async (req, res) => {
	try {
		const touristID = req.user.userId;
		const { rating, comment } = req.body;
		const itineraryID = req.params.id; // Extract itineraryID from params
		const itinerary = await Itinerary.findById(itineraryID);
		if (!itinerary) {
			return res.status(404).json({ message: "Itinerary not found" });
		}
		const tourguideID = itinerary.tourguideID;
		const tourGuide = await TourGuide.findById(tourguideID);
		if (!tourGuide) {
			return res.status(404).json({ message: "Tour guide not found" });
		}
		const newRating = await Rating.create({ touristID, rating, comment });
		tourGuide.addRating(newRating);
		res.status(201).json({ message: "Rating added to tour guide", newRating });
	} catch (error) {
		res.status(500).json({ message: "Error rating tour guide", error });
	}
};

export const rateItinerary = async (req, res) => {
	try {
		const touristID = req.user.userId;
		const { rating, comment } = req.body;
		const itineraryID = req.params.id; // Extract itineraryID from params

		const itinerary = await Itinerary.findById(itineraryID);
		if (!itinerary) {
			return res.status(404).json({ message: "Itinerary not found" });
		}
		const newRating = await Rating.create({ touristID, rating, comment });
		itinerary.addRating(newRating);
		res.status(201).json({ newRating });
	} catch (error) {
		res.status(500).json({ message: "Error rating itinerary", error: error.message });
	}
};

export const rateActivity = async (req, res) => {
	try {
		const touristID = req.user.userId;
		const { rating, comment } = req.body;
		const activityID = req.params.id; // Extract activityID from params
		const activity = await Activity.findById(activityID);

		if (!activity) {
			return res.status(404).json({ message: "Activity not found" });
		}

		const newRating = await Rating.create({ touristID, rating, comment });
		activity.addRating(newRating);
		res.status(201).json({ newRating });
	} catch (error) {
		res.status(500).json({ message: "Error rating activity", error: error.message });
	}
};
