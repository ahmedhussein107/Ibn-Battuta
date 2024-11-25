import Activity from "../models/activity.model.js";
import { buildFilter } from "../utilities/searchUtils.js";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";
export const getAllActivities = async (req, res) => {
    const query = buildFilter(req.query);
    console.log("in getAllActivities, query is: ", query);
    try {
        const activity = await Activity.find(query);
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createActivity = async (req, res) => {
    req.body.advertiserID = req.user.userId;
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
        const activity = await Activity.findById(req.params.id).populate("advertiserID");
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
        console.log("i am in activity update");
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
    const query = buildFilter(req.query);
    const advertiserId = req.user.userId;
    console.log("advertiserId", advertiserId);
    try {
        const activities = await Activity.find({ advertiserID: advertiserId, ...query }); // Find all activities for the given advertiser ID
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

export const toggleFlaggedActivities = async (req, res) => {
    try {
        const activityID = req.params.id;
        const activity = await Activity.findById(activityID);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }
        activity.isFlagged = !activity.isFlagged;
        await activity.save();
        await sendNotificationToEmailAndSystem(
            "Activity Flagged",
            `Your activity ${activity.name} has been flagged as ${
                activity.isFlagged ? "not " : ""
            }appropriate`,
            activity.advertiserID,
            "Advertiser",
            activity._id,
            "Activity",
            "warning"
        );

        res.status(200).json({
            message: "Activity flagged status changed successfully",
            activity,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
