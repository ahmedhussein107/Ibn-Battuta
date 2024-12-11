import Landmark from "../models/landmark.model.js";

import { genericSearch, buildFilter } from "../utilities/searchUtils.js";

export const createLandmark = async (req, res) => {
    try {
        const governorID = req.user.userId;
        req.body.governorID = governorID;
        const landmark = await Landmark.create(req.body);
        res.status(201).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getAllLandmarks = async (req, res) => {
    try {
        const { page, limit, ...rest } = req.query;
        console.log("rest", rest);
        const query = buildFilter(rest);
        console.log("query", query);
        const _page = Math.max(1, parseInt(req.query.page) || 1);
        const _limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (_page - 1) * _limit;
        let landmarks = await Landmark.find(query);

        const count = landmarks.length;
        landmarks = landmarks.slice(toSkip, Math.min(toSkip + _limit, count));
        return res.status(200).json({
            result: landmarks,
            totalPages: count > 0 ? Math.ceil(count / _limit) : 1,
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const updateLandmark = async (req, res) => {
    try {
        console.log(req.body);
        const landmark = await Landmark.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        // console.log(landmark);

        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }

        res.status(200).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getTicketPricesFromLandmark = async (req, res) => {
    try {
        const landmark = await Landmark.findById(req.params.id);
        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }
        res.status(200).json(landmark.ticketPrices);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getLandmarkById = async (req, res) => {
    try {
        const landmark = await Landmark.findById(req.params.id);
        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }

        res.status(200).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const deleteLandmark = async (req, res) => {
    try {
        const landmark = await Landmark.findByIdAndDelete(req.params.id);
        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }
        res.status(200).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getGovernorLandmarks = async (req, res) => {
    try {
        const governorId = req.user?.userId;
        if (!governorId) {
            return res
                .status(400)
                .json({ message: "Governor ID not found in request" });
        }

        console.log("Fetching landmarks for Governor ID:", governorId);

        const landmarks = await Landmark.find({ governorID: governorId });
        res.status(200).json(landmarks);
    } catch (error) {
        console.error("Error fetching governor landmarks:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
