import Activity from "../models/activity.model.js";
import { buildFilter } from "../utilities/searchUtils.js";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";
import TouristBookmark from "../models/touristBookmark.model.js";
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
        const oldActivity = await Activity.findById(req.params.id);
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        const tourists = await TouristBookmark.find({ bookmarkID: req.params.id });

        console.log("i am in activity update");
        if (
            oldActivity.isOpenForBooking === false &&
            req.body.isOpenForBooking === true
        ) {
            console.log("i am in if condition");
            for (let tourist of tourists) {
                await sendNotificationToEmailAndSystem(
                    "Activity Open for Booking",
                    `Your activity ${activity.name} is now open for booking`,
                    tourist.touristID,
                    "Tourist",
                    req.params.id,
                    "Activity"
                );
            }
        }
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
        const { rating, price, page, limit, sortBy, ...rest } = req.query;
        const _page = Math.max(1, parseInt(req.query.page) || 1);
        const _limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (_page - 1) * _limit;
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

        if (price) {
            const bounds = price.split("-");
            const minPrice = bounds[0] ? parseFloat(bounds[0]) : 0;
            const maxPrice = bounds[1] ? parseFloat(bounds[1]) : Number.MAX_SAFE_INTEGER;
            activities = activities.filter((activity) => {
                const activityPrice =
                    activity.price * (1 - activity.specialDiscount / 100);
                return activityPrice >= minPrice && activityPrice <= maxPrice;
            });
        }

        if (sortBy) {
            if (sortBy === "priceAsc") {
                activities.sort((a, b) => {
                    const specialDiscountPriceA =
                        (a.price * (100 - a.specialDiscount)) / 100;
                    const specialDiscountPriceB =
                        (b.price * (100 - b.specialDiscount)) / 100;
                    return specialDiscountPriceA - specialDiscountPriceB;
                });
            } else if (sortBy === "priceDesc") {
                activities.sort((a, b) => {
                    const specialDiscountPriceA =
                        (a.price * (100 - a.specialDiscount)) / 100;
                    const specialDiscountPriceB =
                        (b.price * (100 - b.specialDiscount)) / 100;
                    return specialDiscountPriceB - specialDiscountPriceA;
                });
            } else if (sortBy === "ratingAsc") {
                activities.sort((a, b) => a.rating - b.rating);
            } else if (sortBy === "ratingDesc") {
                activities.sort((a, b) => b.rating - a.rating);
            }
        }
        const count = activities.length;
        activities = activities.slice(toSkip, Math.min(toSkip + _limit, count));
        return res.status(200).json({
            result: activities,
            totalPages: count > 0 ? Math.ceil(count / _limit) : 1,
        });
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
            activity.isFlagged ? "warning" : "info"
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
