import Seller from "../models/seller.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Notification from "../models/notification.model.js";
import Product from "../models/product.model.js";
import Rating from "../models/rating.model.js";
import bcrypt from "bcrypt";
export const createSeller = async (req, res) => {
  //console.log(req.body);
  const inputUsername = req.body.username;
  const inputEmail = req.body.email;
  const username = await Username.findById(inputUsername);
  const email = await Email.findById(inputEmail);
  try {
    if (!username && !email) {
      const newUsername = await Username.create({
        _id: inputUsername,
        userType: "Seller",
      });
      const newEmail = await Email.create({
        _id: inputEmail,
      });
      // hashing password 10 times
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      const newSeller = await Seller.create(req.body);
      res.status(201).json(newSeller);
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

export const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (e) {
    //console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};

export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (seller) {
      res.status(200).json(seller);
    } else {
      res.status(404).json({ e: "Seller not found" });
    }
  } catch (e) {
    //console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};

export const updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (seller) {
      res.status(200).json(seller);
    } else {
      res.status(404).json({ e: "Seller not found" });
    }
  } catch (e) {
    //console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (seller) {
      await Username.findByIdAndDelete(seller.username);
      await Email.findByIdAndDelete(seller.email);

      // If there are notifications, delete each one
      if (seller.notifications && seller.notifications.length > 0) {
        await Promise.all(
          seller.notifications.map(async (notificationId) => {
            await Notification.findByIdAndDelete(notificationId);
          })
        );
      }

      // Find all products associated with this seller
      const products = await Product.find({
        ownerID: req.params.id,
        ownerType: "Seller",
      });

      // Iterate over the products and delete each product's ratings
      await Promise.all(
        products.map(async (product) => {
          if (product.ratings && product.ratings.length > 0) {
            await Promise.all(
              product.ratings.map(async (ratingId) => {
                await Rating.findByIdAndDelete(ratingId);
              })
            );
          }
        })
      );

      // Delete all products associated with this seller
      await Product.deleteMany({ ownerID: req.params.id, ownerType: "Seller" });

      res.status(200).json({ message: "Seller deleted successfully" });
    } else {
      res.status(404).json({ e: "Seller not found" });
    }
  } catch (e) {
    //console.log(e.message);
    res.status(400).json({ e: e.message });
  }
};
