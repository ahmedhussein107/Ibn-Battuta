import Activity from "../models/activity.model.js";
import mongoose from "mongoose";
import Tourist from "../models/tourist.model.js";
import Booking from "../models/booking.model.js";
import Product from "../models/product.model.js";
import Itinerary from "../models/itinerary.model.js";
import Order from "../models/order.model.js";
export const getAnalytics = async (req, res) => {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let result = { message: "Success" };

    if (req.user.userType === "Tourguide" || req.user.userType === "Advertiser") {
        const data = await getEventsData(
            userId,
            userType,
            userType === "Tourguide" ? "Itinerary" : "Activity"
        );
        result = { ...result, data };
    } else {
        const data = await getProductsData(userId, userType);
        result = { ...result, data };
    }
    if (req.user.userType === "Admin") {
        const touristData = await getTouristsData();
        result = { ...result, touristData };
    }
    console.log("analytics sent successfully");
    res.status(200).json(result);
    try {
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductsData = async (userId, userType) => {
    try {
        // Fetch products for the given owner
        const products = await Product.find({
            ownerID: userId,
            ownerType: userType,
        });
        console.log("products length", products.length, products);

        // Aggregate sales data from orders
        const salesData = await Order.aggregate([
            {
                $match: {
                    "purchases.product": { $in: products.map((product) => product._id) },
                },
            },
            {
                $unwind: "$purchases", // Unwind the purchases array
            },
            {
                $match: {
                    "purchases.product": { $in: products.map((product) => product._id) }, // Filter purchases
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "purchases.product",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$productDetails",
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
                    _id: {
                        date: "$formattedDate",
                        productId: "$purchases.product",
                        productName: "$productDetails.name",
                    },
                    numberOfSales: { $sum: "$purchases.count" },
                    revenue: { $sum: "$purchases.price" },
                    tourists: { $addToSet: "$buyer" },
                },
            },
            {
                $addFields: {
                    numberOfTourists: { $size: { $ifNull: ["$tourists", []] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    id: "$_id.productId",
                    name: "$_id.productName",
                    numberOfSales: 1,
                    revenue: 1,
                    numberOfTourists: 1,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        console.log("Sales data after aggregation:", salesData);

        return salesData;
    } catch (error) {
        console.error("Error fetching product sales data:", error);
        throw error;
    }
};

// const getProductsData = async (userId, userType) => {
//     // TODO: update when order becomes a list of product
//     try {
//         const products = await Product.find({
//             ownerID: userId,
//             ownerType: userType,
//         });
//         console.log("products length", products.length, products);

//         const salesData = await Order.aggregate([
//             {
//                 $match: {
//                     product: { $in: products.map((product) => product._id) },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "products",
//                     localField: "product",
//                     foreignField: "_id",
//                     as: "productDetails",
//                 },
//             },
//             {
//                 $unwind: "$productDetails",
//             },
//             {
//                 $addFields: {
//                     formattedDate: {
//                         $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$formattedDate",
//                     products: {
//                         $push: {
//                             productId: "$product",
//                             productName: "$productDetails.name",
//                             numberOfSales: { $sum: "$count" },
//                             revenue: { $sum: "$price" },
//                         },
//                     },
//                     tourists: { $addToSet: "$buyer" },
//                 },
//             },
//             {
//                 $unwind: "$products",
//             },
//             {
//                 $addFields: {
//                     numberOfTourists: { $size: { $ifNull: ["$tourists", []] } }, // Calculate size of the array
//                 },
//             },
//             {
//                 $group: {
//                     _id: {
//                         date: "$_id",
//                         productId: "$products.productId",
//                         productName: "$products.productName",
//                     },
//                     numberOfSales: { $sum: "$products.numberOfSales" },
//                     revenue: { $sum: "$products.revenue" },
//                     numberOfTourists: { $first: "$numberOfTourists" },
//                 },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     date: "$_id.date",
//                     id: "$_id.productId",
//                     name: "$_id.productName",
//                     numberOfSales: 1,
//                     revenue: 1,
//                     numberOfTourists: 1,
//                 },
//             },
//             {
//                 $sort: { date: 1 },
//             },
//         ]);

//         console.log("Sales data after aggregation:", salesData);

//         return salesData;
//     } catch (error) {
//         console.error("Error fetching product sales data:", error);
//         throw error;
//     }
// };
const getEventsData = async (userId, userType, eventType = "Itinerary") => {
    try {
        const events = await mongoose
            .model(eventType)
            .find({ [`${userType.toLowerCase()}ID`]: userId });

        const revenueData = await Booking.aggregate([
            {
                $match: {
                    typeId: { $in: events.map((event) => event._id) },
                    bookingType: eventType,
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
                $lookup: {
                    from: `${eventType.toLowerCase().slice(0, -1)}ies`,
                    localField: "typeId",
                    foreignField: "_id",
                    as: "eventDetails",
                },
            },
            {
                $unwind: "$eventDetails",
            },
            {
                $group: {
                    _id: {
                        date: "$formattedDate",
                        eventId: "$typeId",
                        eventName: "$eventDetails.name",
                    },
                    totalRevenue: { $sum: "$totalPrice" },
                    totalBookings: { $sum: 1 },
                    totalTourists: { $addToSet: "$touristID" },
                },
            },
            {
                $addFields: {
                    numberOfTourists: { $size: "$totalTourists" },
                },
            },
            {
                $sort: { "_id.date": 1 },
            },
        ]);

        return revenueData.map((item) => ({
            date: item._id.date,
            id: item._id.eventId,
            name: item._id.eventName,
            revenue: item.totalRevenue,
            numberOfSales: item.totalBookings,
            numberOfTourists: item.numberOfTourists,
        }));
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
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
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

        const touristData = monthlyCounts.map((count, index) => {
            const monthDate = new Date(
                lastYearStart.getFullYear(),
                lastYearStart.getMonth() + index
            );
            return {
                month: monthDate.toLocaleString("default", { month: "long" }), // Month name
                tourists: count,
            };
        });
        // [{month,count},..]
        touristData.sort((a, b) => b.tourists - a.tourists);
        return touristData;
    } catch (error) {
        console.error("Error during aggregation:", error);
        throw error;
    }
};
