import express from "express";
import { connect } from "mongoose";
import touristRouter from "./routes/tourist.router.js";
import usernameRouter from "./routes/username.router.js";
import adminRouter from "./routes/admin.router.js";
import categoryRouter from "./routes/category.router.js";
import bookingRouter from "./routes/booking.router.js";
import emailRouter from "./routes/email.router.js";
import productRouter from "./routes/product.router.js";
import orderRouter from "./routes/order.router.js";
import promoCodeRouter from "./routes/promocode.router.js";
import notificationRouter from "./routes/notification.router.js";
import itineraryRouter from "./routes/itinerary.router.js";
import activityRouter from "./routes/activity.router.js";
import governorRouter from "./routes/governor.router.js";
import complaintRouter from "./routes/complaint.router.js";
import advertiserRouter from "./routes/advertiser.router.js";
import commentRouter from "./routes/comment.router.js";
import tourGuideRouter from "./routes/tourguide.router.js";
import sellerRouter from "./routes/seller.router.js";
import tagRouter from "./routes/tag.router.js";
import ratingRouter from "./routes/rating.router.js";
import landmarkRouter from "./routes/landmark.router.js";
import customActivityRouter from "./routes/customActivity.router.js";
import generalRouter from "./routes/general.router.js";
import touristBookmarkRouter from "./routes/touristBookmark.router.js";
import landmarkTagRouter from "./routes/landmarkTag.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// services
import amadeusHotelsRouter from "./services/hotels.js";
import amadeusFlightsRouter from "./services/flights.js";
import touristCartRouter from "./routes/touristCart.router.js";
import touristWishlistRouter from "./routes/touristWishlist.router.js";
import analyticsRouter from "./routes/analytics.router.js";

import { setupPromoCodeScheduledJobs } from "./controllers/promocode.controller.js";

import stripeRouter from "./services/stripe.js";
// environment variables
import { PORT, MONGO_URI } from "./config/config.js";

import expressWs from "express-ws";
import { sendNotificationCountToUser, setupWebSocketRoutes } from "./routes/ws.router.js";

const app = expressWs(express()).app;

connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Connected to DB`);
            console.log(`Listening to port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

setupWebSocketRoutes(app);
setupPromoCodeScheduledJobs();

app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

app.use("/api/payment", stripeRouter);
app.use("/api/tourist", touristRouter);
app.use("/api/username", usernameRouter);
app.use("/api/admin", adminRouter);
app.use("/api/activity", activityRouter);
app.use("/api/email", emailRouter);
app.use("/api/governor", governorRouter);
app.use("/api/complaint", complaintRouter);
app.use("/api/category", categoryRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/promocode", promoCodeRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/itinerary", itineraryRouter);
app.use("/api/advertiser", advertiserRouter);
app.use("/api/comment", commentRouter);
app.use("/api/tourguide", tourGuideRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/tag", tagRouter);
app.use("/api/category", categoryRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/landmark", landmarkRouter);
app.use("/api/customActivity", customActivityRouter);
app.use("/api/amadeus/hotels", amadeusHotelsRouter);
app.use("/api/amadeus/flights", amadeusFlightsRouter);
app.use("/api/bookmark", touristBookmarkRouter);
app.use("/api/general", generalRouter);
app.use("/api/cart", touristCartRouter);
app.use("/api/wishlist", touristWishlistRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/landmarkTag", landmarkTagRouter);
app.use("/api/notification", notificationRouter);
