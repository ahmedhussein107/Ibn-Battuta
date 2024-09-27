import dotenv from "dotenv";
import express from "express";
import { connect } from "mongoose";

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
