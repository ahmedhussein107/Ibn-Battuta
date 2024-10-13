import Rating from "../models/rating.model.js";
import Product from "../models/product.model.js";

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
		const rating = await Rating.findById(req.params.id);
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
		const rating = await Rating.create(req.body);
		const product = await Product.findById(req.params.id);
		await product.addRating(rating);
		res.status(201).json(product);
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const rateTourGuide = async (req, res) => {
	try {
		const { touristID, rating, comment } = req.body;
		const { itineraryID } = req.params;  // Extract itineraryID from params
		const itinerary = await Itinerary.findById(itineraryID);
		if (!itinerary) {
		  return res.status(404).json({ message: 'Itinerary not found' });
		}
		const tourguideID = itinerary.tourguideID;
	
		const newRating = new Rating({ touristID, rating, comment });
		await newRating.save();
		const tourGuide = await TourGuide.findById(tourguideID);
		if (!tourGuide) {
		  return res.status(404).json({ message: 'Tour guide not found' });
		}
	
		res.status(200).json({ message: 'Rating added to tour guide', tourGuide });
	  } catch (error) {
		res.status(500).json({ message: 'Error rating tour guide', error });
	  }
	};
  
  export const rateItinerary = async (req, res) => {
	try {
	  const { itineraryID, touristID, rating, comment } = req.body;
	  const newRating = new Rating({ touristID, rating, comment });
	  await newRating.save();
  
	  const itinerary = await Itinerary.findById(itineraryID);
	  if (!itinerary) {
		return res.status(404).json({ message: 'Itinerary not found' });
	  }
	  
	  res.status(200).json({ message: 'Rating added to itinerary', itinerary });
	} catch (error) {
	  res.status(500).json({ message: 'Error rating itinerary', error });
	}
  };