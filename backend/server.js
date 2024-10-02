import dotenv from "dotenv";
import express from "express";
import { connect } from "mongoose";
import touristRouter from "./routes/tourist.router.js";
import usernameRouter from "./routes/username.router.js";
import adminRouter from "./routes/admin.router.js";
import activityRouter from "./routes/activity.router.js";
import emailRouter from "./routes/email.router.js";
import governorRouter from "./routes/governor.router.js";
import complaintRouter from "./routes/complaint.router.js";
import advertiserRouter from "./routes/advertiser.router.js";
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
app.use("/api/advertiser", advertiserRouter);
