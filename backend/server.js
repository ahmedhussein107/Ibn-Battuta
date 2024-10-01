import dotenv from "dotenv";
import express from "express";
import { connect } from "mongoose";
import touristRouter from "./routes/tourist.router.js";
import usernameRouter from "./routes/username.router.js";
import adminRouter from "./routes/admin.router.js";

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
