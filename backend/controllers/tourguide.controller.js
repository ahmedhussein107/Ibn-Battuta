import TourGuide from "../models/tourguide.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";

export const createTourGuide = async (req, res) => {
  //console.log(req.body);
  const inputUsername = req.body.username;
  const inputEmail = req.body.email;
  const username = await Username.findById(inputUsername);
  const email = await Email.findById(inputEmail);
  try {
    if (!username && !email) {
      const newUsername = await Username.create({
        _id: inputUsername,
        userType: "TourGuide",
      });
      const newEmail = await Email.create({
        _id: inputEmail,
      });
      const newTourGuide = await TourGuide.create(req.body);
      res.status(201).json(newTourGuide);
    } else {
      if (username) {
        res.status(400).json({ e: "Username already exists" });
      } else {
        res.status(400).json({ e: "Email already exists" });
      }
    }
  } catch (e) {
    await Username.findByIdAndDelete(inputUsername);
    await Email.findByIdAndDelete(inputEmail);
    res.status(400).json({ e: e.message });
  }
};

export const getAllTourGuides = async (req, res) => {
  try {
    const tourGuides = await TourGuide.find();
    res.status(200).json(tourGuides);
  } catch (e) {
    // console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};

export const getTourGuideById = async (req, res) => {
    try {
        const tourGuide = await TourGuide.findById(req.params.id);
        if (tourGuide) {
            const {
                isAccepted,
                document,
                ratings,
                sumOfRatings,
                createdAt,
                updatedAt,
                __v,
                ...others
            } = tourGuide._doc;
            res.status(200).json(others);
        } else {
            res.status(404).json({ e: "TourGuide not found" });
        }
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
  } catch (e) {
    //console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};

export const updateTourGuide = async (req, res) => {
    try {
        const tourGuide = await TourGuide.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (tourGuide) {
            res.status(200).json(tourGuide);
        } else {
            res.status(404).json({ e: "TourGuide not found" });
        }
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
  } catch (e) {
    //console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};

export const deleteTourGuide = async (req, res) => {
  try {
    const tourGuide = await TourGuide.findByIdAndDelete(req.params.id);
    if (tourGuide) {
      await Username.findByIdAndDelete(tourGuide.username);
      await Email.findByIdAndDelete(tourGuide.email);
      res.status(200).json({ message: "TourGuide deleted successfully" });
    } else {
      res.status(404).json({ e: "TourGuide not found" });
    }
  } catch (e) {
    //console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};
