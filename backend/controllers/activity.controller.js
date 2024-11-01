import Activity from "../models/activity.model.js";
import { genericSearch, buildFilter } from "../utilities/searchUtils.js";

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
            const { toBeNotifiedTourists, createdAt, updatedAt, __v, ...others } =
                activity._doc;
            res.status(200).json(others);
        } else {
            res.status(404).json({ message: "Activity not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

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

export const getAdvertiserActivities = async (req, res) => {
    const advertiserId = req.params.id;
    try {
        const activities = await Activity.find({ advertiserID: advertiserId }); // Find all activities for the given advertiser ID
        res.status(200).json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUpcomingActivities = async (req, res) => {
    try {
        const { rating, ...rest } = req.query;
        const filter = buildFilter(rest);
        console.log(filter);

        let activities = await Activity.find({
            isFlagged: false, // activities that are flagged do not appear to the user according to requirement (33)
            startDate: { $gt: Date.now() },
            ...filter,
        })
            .populate("advertiserID")
            .populate("ratings");

        if (rating) {
            const bounds = rating.split("-");
            const minRating = bounds[0] ? parseInt(bounds[0]) : -1;
            const maxRating = bounds[1] ? parseInt(bounds[1]) : 5;
            activities = activities.filter((activity) => {
                return activity.rating >= minRating && activity.rating <= maxRating;
            });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
