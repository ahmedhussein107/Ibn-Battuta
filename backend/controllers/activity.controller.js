import Activity from "../models/activity.model.js";

// view upcoming activities that are open for booking and are not flagged
export const getUpcomingActivities = async (req, res) => {
	const sortField = req.query.sortBy || "rating";
	const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

	try {
		const activities = await Activity.find({
			isFlagged: false, // activities that are flagged do not appear to the user according to requirement (33)
			startDate: { $gt: Date.now() },
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
