import TouristBookmark from "../models/touristBookmark.model.js";

export const toggleBookmark = async (req, res) => {
    const touristID = req.user.userId;
    const { bookmarkID, bookmarkType, isBookmarked } = req.body;

    try {
        if (isBookmarked) {
            const bookmark = await TouristBookmark.deleteOne({
                touristID,
                bookmarkType,
                bookmarkID,
            });
            res.status(200).json({ message: "Bookmark deleted successfully", bookmark });
        } else {
            const bookmark = await TouristBookmark.create({
                touristID,
                bookmarkType,
                bookmarkID,
            });
            res.status(200).json({ message: "Bookmark added successfully", bookmark });
        }
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const getBookmarkStatus = async (req, res) => {
    const touristID = req.user.userId;
    const bookmarkIDs = req.body.bookmarkIDs;
    const result = {};
    try {
        for (let i = 0; i < bookmarkIDs.length; i++) {
            const bookmark = await TouristBookmark.findOne({
                touristID,
                bookmarkID: bookmarkIDs[i],
            });
            if (bookmark) {
                result[bookmarkIDs[i]] = true;
            } else {
                result[bookmarkIDs[i]] = false;
            }
        }
        console.log("result", result);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const getActivityBookmarks = async (req, res) => {
    try {
        const id = req.user.userId;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (page - 1) * limit;
        let query = {
            touristID: id,
            bookmarkType: "Activity",
        };
        const count = await TouristBookmark.countDocuments(query);
        const bookings = await TouristBookmark.find(query)
            .skip(toSkip)
            .limit(limit)
            .populate("bookmarkID");
        res.status(200).json({
            result: bookings,
            totalPages: count > 0 ? Math.ceil(count / limit) : 1,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getItineraryBookmarks = async (req, res) => {
    try {
        const id = req.user.userId;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (page - 1) * limit;
        let query = {
            touristID: id,
            bookmarkType: "Itinerary",
        };
        const count = await TouristBookmark.countDocuments(query);
        const bookings = await TouristBookmark.find(query)
            .skip(toSkip)
            .limit(limit)
            .populate("bookmarkID");
        res.status(200).json({
            result: bookings,
            totalPages: count > 0 ? Math.ceil(count / limit) : 1,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
