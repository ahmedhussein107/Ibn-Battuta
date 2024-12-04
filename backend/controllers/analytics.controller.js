import Activity from "../models/activity.model.js";
import mongoose from "mongoose";
import Tourist from "../models/tourist.model.js";
import Booking from "../models/booking.model.js";
import Product from "../models/product.model.js";
import Itinerary from "../models/itinerary.model.js";
import Order from "../models/order.model.js";

export default getAnalytics = async (req, res) => {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let result = { message: "Success" };

    if (req.user.userType === "Tourguide" || req.user.userType === "Advertiser") {
        const eventDateRevenue = await getEventDatePriceData(
            userId,
            userType,
            eventType === "Tourguide" ? "Itinerary" : "Ac tivity"
        );
        result = { ...result, eventDateRevenue };
    } else {
        const productDateRevenue = await getProductDatePriceData(userId, userType);
        result = { ...result, productDateRevenue };
    }
    if (req.user.userType === "Admin") {
        const touristData = await getTouristsData();
        result = { ...result, touristData };
    }

    res.status(200).json(result);
    try {
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBookingData = (productType = "Itinerary") => {
    // returns : 1- list (date,totalprice in this date)
    //           2- list of (_id, capacity, enrolled, revenue)
    //           3- list of (productTypeID, totaltickets, solddtickets)
};
const getOrderData = () => {
    // returns : 1- list (date,totalprice in this date)
    //           2- list of (_id, capacity, enrolled, revenue)
    //           3- list of (productTypeID, totaltickets, solddtickets)
};

const getEventNameWithData = async (eventType = "Activity", userId, userType) => {
    const events = await mongoose.model(eventType).find({
        [`${userType.toLowerCase()}ID`]: userId,
    });

    return events.map(async (event) => {
        const bookedTickets = await Booking.find({
            bookingType: eventType,
            typeId: event._id,
        }).countDocuments();
        const revenue = await Booking.aggregate([
            {
                $match: { bookingType: eventType, typeId: event._id },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
        ]);

        const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0; // case with no matching documents
        let _event = {
            id: event._id,
            name: event.name,
            totalTickets: event?.initialFreeSpots,
            startDate: event.startDate,
            bookedTickets: bookedTickets,
            revenue: totalRevenue,
        };
        return _event;
    });
};

const getProductDatePriceData = async (userId, userType) => {
    // TODO: update when order becomes a list of product
    try {
        const products = Product.find({
            ownerID: mongoose.Types.ObjectId(userId),
            ownerType: userType,
        });

        const revenueData = await Order.aggregate([
            {
                $match: {
                    product: { $in: products.map((_product) => _product._id) },
                },
            },
            {
                $addFields: {
                    formattedDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $group: {
                    _id: "$formattedDate",
                    totalRevenue: { $sum: "$price" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        return revenueData.map((item) => ({ date: item._id, price: item.totalRevenue }));
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        throw error;
    }
};
const getEventDatePriceData = async (userId, userType, eventType = "Itinerary") => {
    try {
        const events = await mongoose
            .model(eventType)
            .find({ [`${userType.toLowerCase()}ID`]: mongoose.Types.ObjectId(userId) });

        const revenueData = await Booking.aggregate([
            {
                $match: {
                    typeId: { $in: events.map((event) => event._id) },
                    bookingType: { $eq: eventType },
                },
            },
            {
                $addFields: {
                    formattedDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $group: {
                    _id: "$formattedDate",
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        return revenueData.map((item) => ({ date: item._id, price: item.totalRevenue }));
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        throw error;
    }
};

const getTouristsData = async () => {
    // get a list of [month, tourist count] for the last year
    try {
        const currentDate = new Date();

        const lastYearStart = new Date(
            currentDate.getFullYear() - 1,
            currentDate.getMonth() + 1,
            1
        );

        const currentMonthEnd = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const result = await Tourist.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastYearStart,
                        $lte: currentMonthEnd,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
        ]);

        const monthlyCounts = Array(12).fill(0);

        result.forEach(({ _id, count }) => {
            const monthIndex =
                (_id.year - lastYearStart.getFullYear()) * 12 +
                (_id.month - lastYearStart.getMonth() - 1);
            if (monthIndex >= 0 && monthIndex < 12) {
                monthlyCounts[monthIndex] = count;
            }
        });

        return monthlyCounts.map((count, index) => {
            const monthDate = new Date(
                lastYearStart.getFullYear(),
                lastYearStart.getMonth() + index
            );
            return [
                monthDate.toLocaleString("default", { month: "long" }), // Month name
                count,
            ];
        });
        // [{month,count},..]
    } catch (error) {
        console.error("Error during aggregation:", error);
        throw error;
    }
};
