import express from "express";
import Tourist from "../models/tourist.model.js";
import TourGuide from "../models/tourguide.model.js";
import Seller from "../models/seller.model.js";
import Product from "../models/product.model.js";
import Activity from "../models/activity.model.js";
import Itinerary from "../models/itinerary.model.js";
import Rating from "../models/ratings.model.js";
import Order from "../models/order.model.js";
import Landmark from "../models/landmark.model.js";
import Governor from "../models/governor.model.js";
import Complaint from "../models/complaint.model.js";
import Advertiser from "../models/advertiser.model.js";
import Admin from "../models/admin.model.js";

const touristRouter = express.Router();


touristRouter.post("/createTourist", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Tourist.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allTourists", async (req, res) => {
  try {
    const tourists = await Tourist.find();
    res.json(tourists);
  } catch (e) {
    console.log(e.message);
  }
});




touristRouter.post("/createTourGuide", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await TourGuide.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allTourGuides", async (req, res) => {
  try {
    const tourguides = await TourGuide.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});




touristRouter.post("/createSeller", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Seller.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allSellers", async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (e) {
    console.log(e.message);
  }
});




touristRouter.post("/createRating", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Rating.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allRatings", async (req, res) => {
  try {
    const tourguides = await Rating.findOne({touristID:"66f810300794b304f66f114b"});
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createProduct", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Product.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allProducts", async (req, res) => {
  try {
    const tourguides = await Product.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createOrder", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Order.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allOrders", async (req, res) => {
  try {
    const tourguides = await Order.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createNotification", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Notification.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allNotifications", async (req, res) => {
  try {
    const tourguides = await Notification.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createLandmark", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Landmark.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allLandmarks", async (req, res) => {
  try {
    const tourguides = await Landmark.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createItinerary", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Itinerariescreate(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allItineraries", async (req, res) => {
  try {
    const tourguides = await Itinerary.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createGovernor", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Governor.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allGovernor", async (req, res) => {
  try {
    const tourguides = await Governor.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createComplaint", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Complaint.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allcomplaints", async (req, res) => {
  try {
    const tourguides = await Complaint.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createAdvertiser", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Advertiser.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allAdvertisers", async (req, res) => {
  try {
    const tourguides = await Advertiser.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createAdmin", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Admin.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allAdmins", async (req, res) => {
  try {
    const tourguides = await Admin.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



touristRouter.post("/createActivity", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Activity.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

touristRouter.get("/allActivities", async (req, res) => {
  try {
    const tourguides = await Activity.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});



export default touristRouter;
