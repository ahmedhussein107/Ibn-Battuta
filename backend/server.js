import dotenv from "dotenv";
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
import tourGuideRouter from "./routes/tourguide.router.js";
import sellerRouter from "./routes/seller.router.js";
import tagRouter from "./routes/tag.router.js";

dotenv.config();
const app = express();

connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB`);
      console.log(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
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
app.use("/api/tourguide", tourGuideRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/tag", tagRouter);
app.use("/api/category", categoryRouter);
