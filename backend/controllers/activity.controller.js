import Activity from "../models/activity.model.js";
import { genericSearch } from "../utilities/searchUtils.js";

// view upcoming activities that are open for booking and are not flagged
export const getUpcomingActivities = async (req, res) => {
	const { budget, minDate, maxDate, category, rating } = req.query;

	const filter = {};

	if (budget) {
		const [minPrice, maxPrice] = budget.split("-").map(Number);
		filter.price = {};
		if (minPrice) filter.price.$gte = minPrice;
		if (maxPrice) filter.price.$lte = maxPrice;
	}

	if (minDate) {
		filter.startDate = {};
		filter.startDate.$gte = new Date(minDate);
	}

	if (maxDate) {
		filter.startDate = {};
		filter.startDate.$lte = new Date(maxDate);
	}

	if (category) {
		filter.category = category;
	}

	const sortField = req.query.sortBy || "rating";
	const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

	try {
		let activities = await Activity.find({
			isFlagged: false, // activities that are flagged do not appear to the user according to requirement (33)
			startDate: { $gt: Date.now() },
			...filter,
		})
			.populate("advertiserID")
			.populate("ratings")
			.lean(); // Returns plain JS objects instead of Mongoose documents

		// Calculate the average rating for each activity
		activities.map((activity) => {
			if (activity.ratings && activity.ratings.length > 0) {
				activity.rating =
					activity.sumOfRatings / activity.ratings.length;
			} else {
				activity.rating = -1; // remember that -1 means "no ratings" and handle in frontend
			}
			return activity;
		});

		if (rating) {
			const [minRating, maxRating] = rating.split("-").map(Number);
			activities = activities.filter(
				(activity) =>
					activity.rating >= minRating && activity.rating <= maxRating
			);
		}

		activities.sort((a, b) => sortOrder * (a[sortField] - b[sortField])); // sort the activities
		res.json(activities);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getActivity = async (req, res) => {
	try {
		const activity = await Activity.find();
		res.status(200).json(activity);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const createActivity = async (req, res) => {
	const activity = new Activity(req.body);

	try {
		await activity.save();
		res.status(201).json(activity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getActivityById = async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id);
		if (activity) {
			res.status(200).json(activity);
		} else {
			res.status(404).json({ message: "Activity not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateActivity = async (req, res) => {
	try {
		const activity = await Activity.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);

		if (activity) {
			res.status(200).json(activity);
		} else {
			res.status(404).json({ message: "Activity not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteActivity = async (req, res) => {
	try {
		const activity = await Activity.findByIdAndDelete(req.params.id);

		if (activity) {
			res.status(200).json({ message: "Activity deleted" });
		} else {
			res.status(404).json({ message: "Activity not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const searchActivities = async (req, res) => {
  try {
    const results = await genericSearch(Activity, req.query);
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
