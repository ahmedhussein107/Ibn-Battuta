import customActivity from "../models/customActivity.model.js";

export const getCustomActivities = async (req, res) => {
    try {
        const activity = await customActivity.find();
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCustomActivity = async (req, res) => {
    const activity = new customActivity(req.body);

    try {
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCustomActivityById = async (req, res) => {
    try {
        const activity = await customActivity.findById(req.params.id);
        if (activity) {
            res.status(200).json(activity);
        } else {
            res.status(404).json({ message: "Custom Activity not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCustomActivity = async (req, res) => {
    try {
        const activity = await customActivity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (activity) {
            res.status(200).json(activity);
        } else {
            res.status(404).json({ message: "Custom Activity not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCustomActivity = async (req, res) => {
    try {
        const activity = await customActivity.findByIdAndDelete(req.params.id);

        if (activity) {
            res.status(200).json({ message: "Custom Activity deleted" });
        } else {
            res.status(404).json({ message: "CustomActivity not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomActivityByTourGuideId = async (req, res) => {
    const tourguideID = req.user.userId;
    try {
        const activities = await customActivity.find({ tourguideID });
        if (activities) {
            res.status(200).json(activities);
        } else {
            res.status(404).json({ message: "Custom Activities not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
