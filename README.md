![Ibn Battuta Logo](https://github.com/user-attachments/assets/88406ce0-0de2-4b43-9e92-a16eaba79f50)

# Ibn-Battuta

## Table of Contents

1. [Motivation](#motivation-)
2. [Build Status](#build-status-)
3. [Code Style](#code-style-%EF%B8%8F)
4. [Screenshots](#screenshots-)
5. [Tech and Frameworks](#tech-and-frameworks-%EF%B8%8F)
6. [Features](#features-)
7. [Code Examples](#code-examples-)
8. [Installation](#installation-)
9. [API References](#api-references)
10. [Tests](#tests)
11. [How To Use](#how-to-use-)
12. [Contribute](#contribute-)
13. [Credits](#credits-)
14. [License](#license-)

## Motivation 🚀 

Welcome to Ibn Battuta, a team inspired by the legendary explorer who traversed continents, connecting people and cultures through his unparalleled journeys. Just as Ibn Battuta ventured boldly into the unknown, our team embraces the challenge of creating the ultimate Virtual Trip Planner. With a shared vision of innovation and exploration, we are committed to delivering a platform that redefines how people discover, plan, and experience travelling. Guided by curiosity, collaboration, and a passion for excellence, we take each sprint as a new step in our journey toward crafting seamless, personalized, and unforgettable travel experiences. Together, we aim to leave a lasting mark on the world of travel technology, one milestone at a time.
## Build Status 🚧

* This project is currently under active development and is not ready for production use.

* More comprehensive automated tests should be added to ensure better coverage and reliability in future iterations.

* More documentation should be added to provide clear guidance for contributors and users.
  
## Code Style 🖋️

Our codebase adheres to clean and consistent coding standards to ensure readability, maintainability, and collaboration across the team. Below are the key practices we follow:

- General Conventions: - Use camelCase, PascalCase as well as writing self-documenting code.
- Linting and Formatting: Format code with [Prettier](https://prettier.io/) to enforce consistent style (e.g., single quotes, semicolon usage, indentations).
  
## Screenshots 📸

* Guest

    <details>
        <summary> Home</summary>
    
    
    ![Home Page](https://github.com/user-attachments/assets/bf2daf68-6f97-478e-b482-5705cff1adb2)
    
    
    </details>
    
    <details>
        <summary> Sign Up</summary>
    
    
    ![Choose Your Role](https://github.com/user-attachments/assets/e4b426d1-ef40-4864-8187-7dafc39b51f3)
    ![Sign Up](https://github.com/user-attachments/assets/9ba45856-7a4b-46e7-88ac-e9ad378de6c6)
    
    
    </details>
    
    <details>
        <summary> Sign In</summary>
    
    
    ![Sign In](https://github.com/user-attachments/assets/9a6799f1-1df0-48ff-bd05-8b12ccf663b2)
    
    
    </details>

- Tourist

    <details>
        <summary> Itineraries</summary>
    
    
    ![Itineraries](https://github.com/user-attachments/assets/6aeba29b-03bb-453e-bb86-260ab85df3fc)
    
    ![Itinerary Details](https://github.com/user-attachments/assets/2ad012bf-6946-47e7-be89-a0704eacbd54)
    
    
    </details>
    
    <details>
        <summary> Shop</summary>
    
    
    ![Shop](https://github.com/user-attachments/assets/32784244-95cc-4432-8b1d-9124c1caeae2)
    
    ![Cart](https://github.com/user-attachments/assets/c0866300-5b77-4cfe-a7c8-79cf0dcb41f2)
    
    ![Checkout](https://github.com/user-attachments/assets/0d00fd70-ebca-4334-ad98-6fc4bbb6c89c)
    
    
    </details>
    
    <details>
        <summary> Flights</summary>
    
    ![Flights](https://github.com/user-attachments/assets/5a017d85-9792-4094-bcd5-6436dadac124)
    
    ![Flight Details](https://github.com/user-attachments/assets/8ff2153b-3d40-4a6e-806f-0b39aa781f20)
    
    
    </details>
    
    <details>
        <summary> Hotels</summary>
    
    
    ![Hotel Offers](https://github.com/user-attachments/assets/209bbdce-96cf-4d07-9288-a71f4cadd19b)
    
    ![Hotel Offer Details](https://github.com/user-attachments/assets/83e3c633-18d5-454d-baa5-8aa1dfddc37c)
    
    
    </details>

- Admin

    <details>
        <summary> Dashboard</summary>
    
    
    ![Analytics](https://github.com/user-attachments/assets/4e85064c-ad6e-4f5a-b9c4-ade845707b36)
    
    ![Analytics Part 2](https://github.com/user-attachments/assets/20d4f515-9ae2-418a-a0d9-4d7dc1c39d5d)
    
    
    </details>
    
    <details>
        <summary> User Management</summary>
    
    
    ![Existing Users](https://github.com/user-attachments/assets/28eb94b3-f755-4b5a-af65-0a16a843134d)
    
    ![Pending Users](https://github.com/user-attachments/assets/cb732d96-5860-4b2e-b03a-4aa835e43c6d)
    
    
    </details>
    
    <details>
        <summary> Complaints</summary>
    
    
    ![Complaints](https://github.com/user-attachments/assets/be3415e0-6a0e-4567-8ab3-30d897872973)
    
    
    </details>
    
    <details>
        <summary> Categorization</summary>
    
    
    ![Tags](https://github.com/user-attachments/assets/9f63054f-a5de-4359-88fe-b5ae4009b767)
    
    ![Categories](https://github.com/user-attachments/assets/bb4195c1-5fa1-4398-8f91-cb45868aefa7)
    
    
    </details>
    
    <details>
        <summary> Promocodes</summary>
    
    
    ![Promocodes](https://github.com/user-attachments/assets/f1214d4b-18f8-4cda-a235-cebc3edbb04e)
    
    
    </details>

- Seller

    <details>
        <summary> Inventory</summary>
    
    
    ![Inventory](https://github.com/user-attachments/assets/cb3081e7-e8fb-4abf-9fd1-ca3c4cc22e0f)
    
    ![Create Product](https://github.com/user-attachments/assets/128d2cd4-ec96-4f26-ad1a-dab5fdfc6d58)
    
    
    </details>

- Advertiser

    <details>
        <summary> My Activites</summary>
    
    
    ![My Activities](https://github.com/user-attachments/assets/10a1b170-36fe-4416-90c9-fc4811449da5)
    
    ![Create Activity](https://github.com/user-attachments/assets/75454485-0282-4797-a6f4-256a3c5aec32)
    
    
    </details>

- Tour Guide
  
    <details>
        <summary> My Tours</summary>
    
    
    ![My Tours](https://github.com/user-attachments/assets/b615a552-46cf-4339-bffe-f3149907c848)
    
    ![Create Itinerary](https://github.com/user-attachments/assets/65238e22-cd3c-4911-bd3d-e7c398ee8d01)
    
    </details>


- Tourism Governor
  
    <details>
      <summary> My Landmarks</summary>
    
    
    ![My Landmarks](https://github.com/user-attachments/assets/83901aea-00e9-49e8-8dd0-2700672b870e)
    
    ![Create Landmark](https://github.com/user-attachments/assets/10c32138-eaea-4711-b057-6f64771ea756)
    
    
    </details>



## Tech and Frameworks 🛠️

Our project leverages modern technologies and tools to deliver a robust, scalable, and user-friendly platform. Below is a list of the main tech stack and frameworks used:

* Frontend:
    
    - [React.js](https://reactjs.org/): For building dynamic, responsive, and reusable UI components.

    - [Material-UI](https://mui.com/): For creating a consistent, visually appealing, and responsive design.
    
    - [Axios](https://axios-http.com/): For making HTTP requests to the backend API.
  
* Backend:
    
    - [Node.js](https://nodejs.org/en/): For building the server-side logic and handling RESTful API endpoints.
    
    - [Express.js](https://expressjs.com/): As the web application framework for routing and middleware.
  
* Database:
    
    - [MongoDB](https://www.mongodb.com/): For storing and managing application data in a NoSQL format.

    - [Mongoose](https://mongoosejs.com/): For schema modeling and interacting with the MongoDB database.
      DevOps and Tools:
  
* Other Libraries and Utilities:

    - [Git](https://git-scm.com/): For version control and collaboration.
    
    - [GitHub](https://github.com/): For repository hosting and issue tracking.
    
    - [Prettier](https://prettier.io/): For maintaining code quality and consistency.
    
    - [Postman](https://www.postman.com/): For API testing and debugging.
    
    - [dotenv](https://www.npmjs.com/package/dotenv): For managing environment variables securely.
    
    - [Google Maps API](https://developers.google.com/maps): For location-based services like reverse geocoding and displaying maps.
      
    - [Bcrypt](https://www.npmjs.com/package/bcrypt): For encrypting and safely storing user data.
 
    - [JSON Web Token](https://jwt.io/): For managing user sessions through cookies.
 
    - [Nodemailer](https://nodemailer.com/about/): For sending personalized emails to users.
 
    - [Firebase](https://firebase.google.com/docs/storage): For storing images and files uploaded by users.
  
## Features ✨
 
Our Virtual Trip Planner offers a comprehensive suite of features to make travel planning effortless and enjoyable. Key highlights include:

-   Personalized Travel Planning:

    - Customize your trip based on preferences like historic landmarks, beaches, shopping, or budget-friendly options.

-   Seamless Booking:

    - Book flights, accommodations, and transportation directly within the app through trusted third-party services (Amadeus).

-   Loyalty Points:
  
    - Receive points when completing a booking, which can then be redeemed and added to your balance to spend on our website.

-   Discover Local Gems:

    - Explore curated recommendations for local activities, itineraries, museums, and historical landmarks with ticket prices and navigation options.

-   Real-Time Notifications:

    - Stay updated with instant alerts for upcoming activities, bookings, or changes via app notifications and email.

-   Tour Guide Integration:

    - Access professional guided tours or create your own itinerary with customizable activity breakdowns.

-   In-App Gift Shop:

    - Browse a curated selection of souvenirs and unique local items to commemorate your journey.

-   Comprehensive Itinerary Management:

    - View, modify, and share your itinerary with an intuitive timeline display.

-   Location-Based Services:

    - Use integrated maps for navigation and get detailed location data for activities and landmarks.

-   Accessibility and Tagging:

    - Find activities and destinations tailored to your needs with accessibility filters and categorized tags.

-   Online Payment:
  
    - Pay for everything online easily through our Stripe integration.

-   Frequent Promocodes and Discounts:
 
    - Enjoy money-saving discounts on events, and save even further when applying a promocode during checkout.

-   Full Refund after Cancellation:

    - Cancel your booking at least 48 hours before an event and get your money back in full.

-   Customer Service:

    - Contact us any time for any inquiries or complaints.
    
## Code Examples 💻

<details>
    <summary> Backend Routes</summary>

```javascript
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
```
    
          
</details>



<details>
<summary>Backend Tourist Model</summary>

```javascript
  
        import { mongoose } from "mongoose";

        import { validateReference, validateReferences } from "./validatingUtils.js";

        const touristSchema = new mongoose.Schema(

          {

          username: {

              type: String,
              ref: "Username",
              required: true,
              unique: true, // auto-created index
          },
          password: { type: String, required: true },
          name: { type: String, required: true },
          email: {
              type: String,
              ref: "Email",
              required: true,
              unique: true,
          },
          mobile: { type: String, default: null },
          nationality: { type: String, default: null },
          DOB: { type: Date, required: true, immutable: true },
          job: { type: String, default: null },
          picture: String,
          wallet: { type: Number, default: 0 },
          points: { type: Number, default: 0 },
          loyalityPoints: { type: Number, default: 0 },
          cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
          notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notification" }],
          hotelBookings: [{ type: Object, default: [] }],
          flightBookings: [{ type: Object, default: [] }],
          preferences: [{ type: String, ref: "Tag" }],
          address: [{ name: String, Latitude: Number, Longitude: Number }],
          currency: { type: String, default: "EGP" },
      },
      { timestamps: true }
      );  

      touristSchema.index({ createdAt: 1 });

      touristSchema.pre("save", async function (next) {
      try {
          const { username, email, notifications, cart, preferences, wishlist } = this;

          await validateReference(username, "Username", next);

          if (email) {
              await validateReference(email, "Email", next);
          }
          if (notifications) {
              await validateReferences(notifications, "Notification", next);
          }
          if (cart) {
              await validateReferences(cart, "Product", next);
          }
          if (preferences) {
              await validateReferences(preferences, "Tag", next);
          }

          if (wishlist) {
              await validateReferences(wishlist, "Product", next);
          }

          next();
      } catch (error) {
          next(error);
      }
      });

      const validateUpdateReferences = async function (next) {
          try {
              const update = this.getUpdate();
              const username = update.username || update["$set.username"];
              const email = update.email || update["$set.email"];
              const notifications = update.notifications || update["$set.notifications"];
              const cart = update.cart || update["$set.cart"];
              const preferences = update.preferences || update["$set.preferences"];
              const wishlist = update.wishlist || update["$set.wishlist"];

          if (username) {
              await validateReference(username, "Username", next);
          }

          if (email) {
              await validateReference(email, "Email", next);
          }

          if (notifications) {
              await validateReferences(notifications, "Notification", next);
        }
  
          if (cart) {
              await validateReferences(cart, "Product", next);
          }
          if (preferences) {
              await validateReferences(preferences, "Tags", next);
          }

          if (wishlist) {
              await validateReferences(wishlist, "Product", next);
          }

          next();
      } catch (error) {
          next(error);
      }  
      };

      touristSchema.pre("findOneAndUpdate", validateUpdateReferences);
      touristSchema.pre("updateOne", validateUpdateReferences);
      touristSchema.pre("findByIdAndUpdate", validateUpdateReferences);
      touristSchema.virtual("age").get(function () {
        const ageInMs = Date.now() - this.DOB.getTime();
        const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
        return ageInYears;
        });

        export default mongoose.model("Tourist", touristSchema);
```
</details>


<details>
<summary>Backend Tourist Controller</summary>

```javascript
      import Tourist from "../models/tourist.model.js";
      import Username from "../models/username.model.js";
      import Email from "../models/email.model.js";
      import Notification from "../models/notification.model.js";
      import TouristActivityNotification from "../models/touristActivityNotification.model.js";
      import bcrypt from "bcrypt";
      import { assignCookies } from "./general.controller.js";
      import Admin from "../models/admin.model.js";
      import Complaint from "../models/complaint.model.js";
      import Booking from "../models/booking.model.js";
      import TouristBookmark from "../models/touristBookmark.model.js";

      export const getTourists = async (req, res) => {
          try {
            const tourguides = await Tourist.find(req.body);
            res.json(tourguides);
        } catch (e) {
            res.json(e.message);
            //console.log(e.message);
        }  
      };

    export const getTouristById = async (req, res) => {
        try {
            const { userId } = req.user;
            if (!userId) {
                return res.status(404).json({ e: "ID not found" });
          }  

            const tourist = await Tourist.findById(userId);

          if (!tourist) {
              return res.status(404).json({ e: "Tourist not found" });
          }

          const age = tourist.age;
          const {
              cart,
              preferences,
              wishlist,
              deliveryAddresses,
              createdAt,
              updatedAt,
              __v,
              DOB,
              ...other
          } = tourist._doc;

          console.log(other);
          res.status(200).json({ ...other, age, preferences });
      } catch (e) {
          console.error(e.message); // Log the error for debugging
          res.status(400).json({ e: e.message });
      }
    };

      export const createTourist = async (req, res) => {
          console.log(req.body);
          const inputUsername = req.body.username;
          const inputEmail = req.body.email;
          const username = await Username.findById(inputUsername);
          const email = await Email.findById(inputEmail);
          try {
              if (!username && !email) {
                  const newUsername = await Username.create({
                      _id: inputUsername,
                      userType: "Tourist",
                  });
                  const newEmail = await Email.create({
                      _id: inputEmail,
                  });

              // hashing password 10 times
              const hashedPassword = await bcrypt.hash(req.body.password, 10);
              req.body.password = hashedPassword;
              const { address, ...body } = req.body;
              const newTourist = await Tourist.create(body);
              assignCookies(
                  res,
                  "Tourist",
                  newTourist._id,
                  newTourist.picture,
                  newTourist.currency,
                  newTourist.email
              )
                  .status(201)
                  .json({ message: "Sign up successful" });
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

    export const updateTourist = async (req, res) => {
      try {
          let ID = req.user.userId;
          const admin = await Admin.findById(req.user.userId);
          if (admin) {
            ID = req.query.userId; // Admin can update any tourist
        }

        const tourist = await Tourist.findById(ID);
        if (!tourist) {
            return res.status(404).json({ e: "Tourist not found" });
        }

        if (req.body.email) {
            // Check if the email already exists
            const existingEmail = await Email.findById(req.body.email);
            if (existingEmail) {
                return res.status(400).json({ e: "Email already exists." });
            }

            // Proceed to update the email
            await Email.findByIdAndDelete(tourist.email); // Remove the old email
            try {
                await Email.create({
                    _id: req.body.email, // Create the new email
                });
            } catch (e) {
                await Email.create({
                    _id: tourist.email,
                });
                res.status(400).json({ e: e.message });
            }
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10); // Hash the new password
        }

        const touristUpdated = await Tourist.findByIdAndUpdate(ID, req.body, {
            new: true,
        });

        res.cookie("currency", touristUpdated.currency, {
            maxAge: 60 * 60 * 24 * 1000,
        })
            .cookie("email", touristUpdated.email, {
                maxAge: 60 * 60 * 24 * 1000,
            })
            .status(200)
            .json({ message: "Tourist updated", tourist: touristUpdated });
    } catch (e) {
        res.status(400).json({ e: e.message });
      }
    };

    export const deleteTourist = async (req, res) => {
        try {
            let touristID = req.user.userId;
            const admin = await Admin.findById(req.user.userId);
            if (admin) {
            touristID = req.query.userId;
        }
        const currentTourist = await Tourist.findById(touristID);

        // Check for bookings first
        if (currentTourist) {
            const hasBookings =
                (await Booking.find({
                    touristID: touristID,
                }).countDocuments()) > 0;
            if (hasBookings) {
                return res
                    .status(400)
                    .json({ message: "Cannot delete tourist with bookings" });
            }
        }

        // If current tourist doesn't exist, check if the user is an admin
        const ID = touristID;

        const tourist = await Tourist.findByIdAndDelete(ID);
        if (tourist) {
            await Username.findByIdAndDelete(tourist.username);
            await Email.findByIdAndDelete(tourist.email);

            // Delete notifications
            if (tourist.notifications && tourist.notifications.length > 0) {
                await Promise.all(
                    tourist.notifications.map((notificationId) =>
                        Notification.findByIdAndDelete(notificationId)
                    )
                );
            }

            // Delete complaints
            if (tourist.complaints && tourist.complaints.length > 0) {
                await Promise.all(
                    tourist.complaints.map((complaintId) =>
                        Complaint.findByIdAndDelete(complaintId)
                    )
                );
            }

            // Delete related tourist activity notifications
            await TouristActivityNotification.deleteMany({
                touristID: tourist._id,
            });

            return res.status(200).json({
                message: "Tourist deleted successfully",
            });
        } else {
            return res.status(404).json({ message: "Tourist not found" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message }); // Use 500 for internal server errors
      }
    };

      export const redeemPoints = async (req, res) => {
          try {
              const tourist = await Tourist.findById(req.user.userId);
              if (!tourist) {
                  return res.status(404).json({ e: "Tourist not found" });
                }
            const { points } = req.body;
          if (points < 0 || points > (tourist.loyalityPoints || 0)) {
              return res.status(400).json({ e: "Not enough points" });
          }

          // Assuming the conversion is 10000 points = $100
          const cashValue = (points / 10000) * 100;

          tourist.loyalityPoints -= points; // Deducting points
          tourist.wallet += cashValue; // Adding cash value to the wallet
          await tourist.save(); // Save the updated tourist details

          res.status(200).json({
              message: "Points redeemed successfully",
              cashValue,
          });
      } catch (e) {
          res.status(400).json({ e: e.message });
          }
      };

      export const addPreference = async (req, res) => {
          try {
              const tourist = await Tourist.findById(req.user.userId);
              if (!tourist) {
                  return res.status(404).json({ e: "Tourist not found" });
              }
              const { preference } = req.body;
          if (!preference) {
              return res.status(400).json({ e: "Preference is required" }); // Check for missing preference
          }
              if (tourist.preferences.includes(preference)) {
                  return res.status(400).json({ e: "Preference already exists" });
              }
              tourist.preferences.push(preference);
              await tourist.save();
              res.status(200).json({ message: "Preference added successfully" });
          } catch (e) {
              res.status(400).json({ e: e.message });
          }
      };
      // I want a function to get the wishlist of a tourist
      export const getWishlist = async (req, res) => {
          try {
              const tourist = await Tourist.findById(req.user.userId);
              if (!tourist) {
                  return res.status(404).json({ e: "Tourist not found" });
              }

              res.status(200).json({ wishlist: tourist.wishlist });
          } catch (e) {
              res.status(400).json({ e: e.message });
          }
      };

      export const addToWishlist = async (req, res) => {
          try {
              const tourist = await Tourist.findById(req.user.userId);
              if (!tourist) {
                  return res.status(404).json({ e: "Tourist not found" });
              }
              const { item } = req.body;
              if (!item) {
                  return res.status(400).json({ e: "Item is required" });
              }
              if (tourist.wishlist.includes(item)) {
                  return res
                    .status(400)
                    .json({ e: "Item already exists in wishlist" });
            }
            tourist.wishlist.push(item);
          await tourist.save();
          res.status(200).json({
              message: "Item added to wishlist successfully",
          });
      } catch (e) {
          res.status(400).json({ e: e.message });
        }
      };
      export const removeFromWishlist = async (req, res) => {
              try {
              const tourist = await Tourist.findById(req.user.userId);
              if (!tourist) {
                return res.status(404).json({ e: "Tourist not found" });
              }
              const { item } = req.body;
              const index = tourist.wishlist.indexOf(item);
              if (index === -1) {
                  return res
                        .status(400)
                  .json({ e: "Item does not exist in wishlist" });
              }
              tourist.wishlist.splice(index, 1);
              await tourist.save();
                res.status(200).json({
                  message: "Item removed from wishlist successfully",
              });
          } catch (e) {
              res.status(400).json({ e: e.message });
          }
      };

      export const removePreference = async (req, res) => {
      try {
          const tourist = await Tourist.findById(req.user.userId);
          if (!tourist) {
              return res.status(404).json({ e: "Tourist not found" });
          }
          const { preference } = req.body;
          const index = tourist.preferences.indexOf(preference);
          if (index === -1) {
              return res.status(400).json({ e: "Preference does not exist" });
          }
          tourist.preferences.splice(index, 1);
          await tourist.save();
          res.status(200).json({ message: "Preference removed successfully" });
      } catch (e) {
          res.status(400).json({ e: e.message });
      }
      };

      export const changeTouristPassword = async (req, res) => {
          const touristId = req.user.userId; // Assuming userId is stored in the req.user object after authentication
          const { oldPassword, newPassword } = req.body;

      try {
          // Validate the input fields
          if (!oldPassword || !newPassword) {
              return res
                  .status(400)
                  .json("Both old and new passwords are required");
          }

          // Find the tourist by ID
          const tourist = await Tourist.findById(touristId);
          if (!tourist) {
              return res.status(404).json("Tourist not found");
          }

          // Check if the old password matches
          const isMatch = await bcrypt.compare(oldPassword, tourist.password);
          if (!isMatch) {
              return res.status(400).json("Incorrect old password");
          }
  
          // Update the password
          tourist.password = await bcrypt.hash(newPassword, 10);
          await tourist.save();

          // Return success response
          return res.status(200).json("Password changed successfully!");
      } catch (err) {
          console.error("Error changing password:", err);
          return res
              .status(500)
              .json("An error occurred while changing the password");
      }
    };
```
</details>

<details> 
    <summary> Frontend Admin Routes</summary>


```javascript
import AdminHome from "../pages/Admin/AdminHome";
import UserManagement from "../pages/Admin/UserManagement";
import ViewTags from "../pages/Admin/ViewTags";
import AllActivities from "../pages/Admin/AllActivities";
import ComplaintList from "../components/Complaint/ComplaintList";
import ViewSingleComplaint from "../components/Complaint/ViewSingleComplaint";
import Shop from "../pages/Product/Shop";
import CreateProductPage from "../pages/Product/CreateProductPage";
import AddNewUser from "../pages/Admin/AddNewUser";
import ViewCategories from "../pages/Admin/ViewCategories";
import AllItineraries from "../pages/Admin/AllItineraries";
import UpdateProductPage from "../pages/Product/UpdateProductPage";
import Inventory from "../pages/Seller/Inventory";
import AdminProfilePage from "../pages/Admin/AdminProfilePage";
import Analytics from "../pages/Analytics/Analytics";
import EditProductPage from "../pages/Product/EditProduct";
import AdminPromoCode from "../pages/Admin/AdminPromoCode";

const adminRoutes = [
    { path: "/admin", element: <Analytics /> },
    {
        path: "/admin/profile",
        element: <AdminProfilePage />,
    },
    {
        path: "/admin/promocode",
        element: <AdminPromoCode />,
    },
    { path: "/admin/tags", element: <ViewTags /> },
    { path: "/admin/categories", element: <ViewCategories /> },
    { path: "/admin/itineraries", element: <AllItineraries /> },
    { path: "/admin/activities", element: <AllActivities /> },
    { path: "/admin/complaints", element: <ComplaintList /> },
    {
        path: "/admin/complaint/:complaintId",
        element: <ViewSingleComplaint />,
    },
    { path: "/admin/inventory", element: <Inventory /> },
    { path: "/admin/shop/update-product/:productId", element: <UpdateProductPage /> },
    { path: "/admin/create-product", element: <CreateProductPage /> },
    { path: "/admin/edit-product/:productId", element: <EditProductPage /> },
    { path: "/admin/users", element: <UserManagement /> },

    {
        path: "admin/users/pending",
        element: <UserManagement isAll={false} />,
    },
    { path: "/admin/users/new", element: <AddNewUser /> },
];

export default adminRoutes;

```


</details>

<details>
    <summary>Frontend Authorization Routes</summary>

```javascript
import Signin from "../pages/Signin/Signin";
import SignUpPage from "../pages/Signup/SignUpPage";
import SelectYourRole from "../pages/Signup/SelectYourRole";
import ForgotYourPassword from "../pages/Signin/ForgotYourPassword.jsx";

const authRoutes = [
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/select-your-role", element: <SelectYourRole /> },
    { path: "/forgot-your-password", element: <ForgotYourPassword /> },
];
export default authRoutes;

```

  
</details>

## Installation 🪛

-   Make sure you have [Node](https://nodejs.org/en/) and [Git](https://git-scm.com/) installed

-   Navigate to the folder where you want the repo to be  

-   Clone the repository
        
        git clone https://github.com/mabryuk/Ibn-Battuta.git
        cd Ibn-Battuta

-   Open two terminals, one for the backend, and one for the frontend 

-   In one terminal, install backend dependencies
        
        # Install backend dependencies
            cd backend
            npm install

-   In the other terminal, install frontend dependencies
  
         # Install frontend dependencies
            cd frontend
            npm install

- Set Up Environment Variables 

    -Create a .env file in both the backend and frontend directories and configure the necessary environment variables.

        //Backend .env
  
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        AMADEUS_API_KEY=your_amadeus_api_key
        AMADEUS_API_SECRET=your_amadeus_api_secret
        WEBSITE_EMAIL=your_website_email
        WEBSITE_EMAIL_PASSWORD=your_website_email_password
        STRIPE_SECRET_KEY=your_stripe_secret_key
        STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret


        //Frontend .env
       
        VITE_API_URI="http://localhost:5000/"
        VITE_FIREBASE_API_KEY=your_firebase_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
        VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
        VITE_FIREBASE_APP_ID=your_firebase_app_id
        VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
        VITE_MAP_API_KEY=your_google_maps_api_key
        VITE_CURRENCY_RATE_API_KEY=your_currency_rate_api_key
        VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

-   In the backend terminal, run the backend
        
        npm run dev

-   In the frontend terminal, run the frontend
        
        npm run dev

-  Visit the application in your browser at the URL in your frontend terminal

## API References 

Below are some of the API endpoints used in the project. Each endpoint is organized by its related model, functionality and includes details about the request method and URL.

**Note**: > - All endpoints are prefixed by `/api/<The URI>`


<details>
  <summary>Activity Endpoints</summary>
  <br>

* `POST /activity/createActivity` - Create a new activity by the logged in advertiser
  - **Request Body**
    ```
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        pictures: [String],
        location: { type: String },
        Latitude: { type: Number },
        Longitude: { type: Number },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        isOpenForBooking: { type: Boolean, default: true },
        initialFreeSpots: { type: Number, default: 0, required: true },
        freeSpots: { type: Number, required: true },
        specialDiscount: { type: Number, default: 0 },
    }
    ```
  - **Response Body**:
    ```
    {
        advertiserID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Advertiser",
        },
        name: String,
        description: String,
        pictures: [String],
        location: String,
        Latitude: Number,
        Longitude: Number,
        startDate: Date,
        endDate: Date,
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
        isOpenForBooking: Boolean,
        isFlagged: Boolean,
        sumOfRatings: Number,
        initialFreeSpots: Number,
        freeSpots: Number,
        specialDiscount: Number,
    }
    ```



* `GET /activity/getActivity/:id` - Get an activity by ID
  - **Request Body**: N/A

  - **Response Body**
     ```
        {
        advertiserID: {
            username: {type: String, ref: "Username"},
            password: String,
            email: { type: String, ref: "Email"},
            name: String,
            isAccepted: Boolean,
            documents: [String],
            website:  String,
            hotline: String,
            companyProfile: String,
            picture: String,
            notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notification" }],
        },
        name: String,
        description: String,
        pictures: [String],
        location: String,
        Latitude: Number,
        Longitude: Number,
        startDate: Date,
        endDate: Date,
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
        isOpenForBooking: Boolean,
        isFlagged: Boolean,
        sumOfRatings: Number,
        initialFreeSpots: Number,
        freeSpots: Number,
        specialDiscount: Number,
    }
    ```



* `GET /activity/getAllActivities` - Get all activities matching the request query filters
  - **Request Body**: N/A

  - **Response Body**
     ```
        [{
        advertiserID: {
            username: {type: String, ref: "Username"},
            password: String,
            email: { type: String, ref: "Email"},
            name: String,
            isAccepted: Boolean,
            documents: [String],
            website:  String,
            hotline: String,
            companyProfile: String,
            picture: String,
            notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notification" }],
        },
        name: String,
        description: String,
        pictures: [String],
        location: String,
        Latitude: Number,
        Longitude: Number,
        startDate: Date,
        endDate: Date,
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
        isOpenForBooking: Boolean,
        isFlagged: Boolean,
        sumOfRatings: Number,
        initialFreeSpots: Number,
        freeSpots: Number,
        specialDiscount: Number]
    }
    ```



* `GET /activity/getUpcomingActivities` - Get all upcoming, unflagged activities matching the request query filters
  - **Request Body**: N/A

  - **Response Body**
     ```
        [{
        advertiserID: {
            username: {type: String, ref: "Username"},
            password: String,
            email: { type: String, ref: "Email"},
            name: String,
            isAccepted: Boolean,
            documents: [String],
            website:  String,
            hotline: String,
            companyProfile: String,
            picture: String,
            notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notification" }],
        },
        name: String,
        description: String,
        pictures: [String],
        location: String,
        Latitude: Number,
        Longitude: Number,
        startDate: Date,
        endDate: Date,
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        ratings: [{
            touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
            },
            rating: Number,
            comment: String
            }
        ],
        isOpenForBooking: Boolean,
        isFlagged: Boolean,
        sumOfRatings: Number,
        initialFreeSpots: Number,
        freeSpots: Number,
        specialDiscount: Number]
    }
    ```


* `GET /activity/getAdvertiserActivities` - Get all activities of the logged in advertiser
  - **Request Body**: N/A

  - **Response Body**
     ```
        [{
        advertiserID: { type: Schema.Types.ObjectId, ref: "Advertiser" }
        name: String,
        description: String,
        pictures: [String],
        location: String,
        Latitude: Number,
        Longitude: Number,
        startDate: Date,
        endDate: Date,
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
        isOpenForBooking: Boolean,
        isFlagged: Boolean,
        sumOfRatings: Number,
        initialFreeSpots: Number,
        freeSpots: Number,
        specialDiscount: Number]
    }
    ```


* `PATCH /activity/updateActivity/:id` - Update the activity with the specified ID
  - **Request Body**
    ```
    {
        name: String,
        description: String,
        pictures: [String],
        location: String,
        Latitude: Number,
        Longitude: Number,
        startDate: Date,
        endDate: Date,
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        isOpenForBooking: Boolean,
        initialFreeSpots: Number,
        freeSpots: Number,
        specialDiscount: Number,
    }
    ```
  - **Response Body**
    ```
    {
        advertiserID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Advertiser",
        },
        name: String,
        description: String,
        pictures: [String],
        location: String,
        Latitude: Number,
        Longitude: Number,
        startDate: Date,
        endDate: Date,
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
        isOpenForBooking: Boolean,
        isFlagged: Boolean,
        sumOfRatings: Number,
        initialFreeSpots: Number,
        freeSpots: Number,
        specialDiscount: Number,
    }
    ```



* `DELETE /activity/deleteActivity/:id` - Delete the activity with the specified ID
  - **Request Body**: N/A
  - **Response Body**
    ```
    {
        message: "Activity Deleted"
    }
    ```
 
* `PATCH /activity/toggleFlag/:id` - Toggles the isFlagged property of the activity with the specified ID 
  - **Request Body**: N/A
  - **Response Body**
    ```
    {
        message: "Activity flagged status changed successfully",
			  activity: {
            advertiserID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Advertiser",
            },
            name: String,
            description: String,
            pictures: [String],
            location: String,
            Latitude: Number,
            Longitude: Number,
            startDate: Date,
            endDate: Date,
            price: Number,
            category: { type: String, ref: "Category" },
            tags: [{ type: String, ref: "Tag" }],
            ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
            isOpenForBooking: Boolean,
            isFlagged: Boolean,
            sumOfRatings: Number,
            initialFreeSpots: Number,
            freeSpots: Number,
            specialDiscount: Number,
        }
    }
    ```


</details>
     
 <details>
  <summary>Admin Endpoints</summary>
  <br>
     
      const adminRouter = express.Router();

    adminRouter.post("/createAdmin", createAdmin);

    adminRouter.get("/getAdmins", getAdmins);

    adminRouter.get("/getUsers", getUsers);

    adminRouter.delete("/deleteAdmin", isAuthenticated, deleteAdmin);

    adminRouter.put("/updateAdmin", isAuthenticated, updateAdmin);

    adminRouter.get("/getAdminById", isAuthenticated, getAdminById);

    adminRouter.put("/changeAdminPassword", isAuthenticated, changeAdminPassword);
</details>

 <details>
  <summary>Analytics Endpoints</summary>
  <br>
     

    analyticsRouter.get("/getAnalytics", isAuthenticated, getAnalytics);
</details>

 <details>
  <summary>Booking Endpoints</summary>
  <br>
  
     bookingRouter.get("/getBookings", getBookings);

    bookingRouter.post("/createBooking", isAuthenticated, createBooking);

    bookingRouter.get("/getBooking/:id", getBooking);

    bookingRouter.patch("/updateBooking/:id", updateBooking);

    bookingRouter.patch("/completeBooking/:id", isAuthenticated, completeBooking);

    bookingRouter.patch("/redeemPoints/:id", redeemPoints);

    bookingRouter.delete("/deleteBooking/:id", deleteBooking);

    bookingRouter.delete("/deleteBookings", deleteBookings);

    bookingRouter.get("/getItineraryBookings", isAuthenticated, getitineraryBookings);

    bookingRouter.get("/getActivityBookings", isAuthenticated, getActivityBookings);

    bookingRouter.get("/getHotelBookings", isAuthenticated, getHotelBookings);

    bookingRouter.get("/getFlightBookings", isAuthenticated, getFlightBookings);

    bookingRouter.get(
        "/checkPossiblePackageFlight",
        isAuthenticated,
        checkPossiblePackageFlight
    );

    bookingRouter.get(
        "/checkPossiblePackageHotel",
        isAuthenticated,
        checkPossiblePackageHotel
    );
</details>

 <details>
  <summary>Categoey Endpoints</summary>
  <br>
     
      const categoryRouter = express.Router();

    categoryRouter.post("/createCategory", createCategory);
    categoryRouter.get("/allCategories", getCategories);
    categoryRouter.put("/updateCategory/:id", updateCategory);
    categoryRouter.delete("/deleteCategory/:id", deleteCategory);
    categoryRouter.get("/getCategoryByID/:id", getCategoryByID);
    categoryRouter.get("/searchCategories", searchCategories);

</details>
 <details>
  <summary>Comment Endpoints</summary>
  <br>
     
      const commentRouter = express.Router();

    commentRouter.post("/createcomment", isAuthenticated, createComment);

    commentRouter.get("/getCommentByID/:id", getCommentById);

    commentRouter.get("/getComments", getComments);

    commentRouter.get("/getComplaintComments/:id", getComplaintComments);

    commentRouter.put("/updateComment/:id", updateComment);

    commentRouter.delete("/deleteComment/:id", deleteComment);

    commentRouter.post("/replyToComplaint/:complaintID", replyToComplaint);

    commentRouter.post("/replyToComment/:commentID", replyToComment);
    import { isAuthenticated } from "../routers.middleware/authentication.js";
</details>

 <details>
      <summary>Complaint Endpoints</summary>
  <br>
    
     const complaintRouter = express.Router();

    complaintRouter.post("/createComplaint", isAuthenticated, createComplaint);

    complaintRouter.get("/getComplaints", getAllComplaints);

    complaintRouter.get("/getComplaint/:id", getComplaintById);
    complaintRouter.get("/getComplaintAlongWithReplies/:id", getComplaintAlongWithReplies);

    complaintRouter.put("/updateComplaint/:id", updateComplaintById);

    complaintRouter.delete("/deleteComplaint/:id", deleteComplaintById);

    complaintRouter.get("/getComplaintsOfTourist/:id", isAuthenticated, getTouristComplaints);

    complaintRouter.get("/getSomeComplaints", isAuthenticated, getSomeComplaints);
    </details>

</details>
<details>
    <summary>Custom Activity Endpoints</summary>
   <br>
  
      const customActivityRouter = express.Router();

    customActivityRouter.post("/createCustomActivity", isAuthenticated, createCustomActivity);

     customActivityRouter.get("/getAllCustomActivities", getCustomActivities);

     customActivityRouter.get("/getCustomActivity/:id", getCustomActivityById);

     customActivityRouter.patch("/updateCustomActivity/:id", updateCustomActivity);

    customActivityRouter.delete("/deleteCustomActivity/:id", deleteCustomActivity);

    customActivityRouter.get(
        "/getCustomActivityByTourGuideId",
        isAuthenticated,
        getCustomActivityByTourGuideId
    );
</details>

<details>
          <summary>General Endpoints</summary>
          <br>
          
          generalRouter.put("/changePassword", changePassword);
        generalRouter.post("/login", login);
        generalRouter.post("/createOTP", createOTPandSendEmail);
        generalRouter.post("/verifyOTP", verifyOTP);
        import { isAuthenticated } from "../routers.middleware/authentication.js";
</details>
  
 <details>
      <summary>Governor Endpoints</summary>
      <br>
      
     const governorRouter = express.Router();

    governorRouter.post("/createGovernor", createGovernor);

    governorRouter.get("/getGovernors", getGovernors);

    governorRouter.get("/getGovernor", isAuthenticated, getGovernor);

    governorRouter.delete("/deleteGovernor", isAuthenticated, deleteGovernor);

    governorRouter.put("/updateGovernor", isAuthenticated, updateGovernor);

    governorRouter.put("/changeGovernorPassword", isAuthenticated, changeGovernorPassword);
</details>


  <details>
        <summary>Itinerary Endpoints</summary>
        <br>
          
      const itineraryRouter = express.Router();

        itineraryRouter.post("/createItinerary", isAuthenticated, createItinerary);

        itineraryRouter.patch("/updateItinerary/:id", updateItinerary);
    
        itineraryRouter.delete("/deleteItinerary/:id", deleteItinerary);

        itineraryRouter.get("/getAllItineraries", getItineraries);
    
        itineraryRouter.get("/getItinerary/:id", getItineraryById);

        itineraryRouter.get("/getUpcomingItineraries", getUpcomingItineraries);

        itineraryRouter.get("/getTourGuideItinerary/", isAuthenticated, getTourGuideItinerary);

        itineraryRouter.get("/searchItineraries", searchItineraries);

        itineraryRouter.delete("/", deleteItineraries);

        itineraryRouter.get("/getFreeSpots/:id", getFreeSpots);

        itineraryRouter.patch("/toggleFlag/:id", toggleFlaggedItineraries);

        itineraryRouter.patch("/toggleActive/:id", toggleActivatedItineraries);
        import { isAuthenticated } from "../routers.middleware/authentication.js";
  </details>
  
  <details>
          <summary>Landmark Endpoints</summary>
          <br>
          const landmarkRouter = express.Router();

        landmarkRouter.post("/createLandmark", createLandmark);
    
        landmarkRouter.get("/allLandmarks", getAllLandmarks);

        landmarkRouter.get("/landmark/:id", getLandmarkById);

        landmarkRouter.get("/ticketPricesFromLandmark/:id", getTicketPricesFromLandmark);

        landmarkRouter.patch("/updateLandmark/:id", updateLandmark);

        landmarkRouter.delete("/deleteLandmark/:id", deleteLandmark);

        landmarkRouter.get("/getGovernorLandmarks", isAuthenticated, getGovernorLandmarks);
</details>

<details>
      <summary>Tag Endpoints</summary>
      <br>
     
    const landmarkTagRouter = express.Router();

    landmarkTagRouter.post("/createLandmarkTag", createLandmarkTag);

    landmarkTagRouter.get("/allLandmarkTags", getLandmarkTags);

    landmarkTagRouter.put("/updateLandmarkTag/:id", updateLandmarkTag);

    landmarkTagRouter.delete("/deleteLandmarkTag/:id", deleteLandmarkTag);

    landmarkTagRouter.get("/getLandmarkTag/:id", getLandmarkTag);

    landmarkTagRouter.get("/searchLandmarkTag", searchLandmarkTags);
</details>
    
<details>
      <summary>Order Endpoints</summary>
      <br>
      
    const orderRouter = express.Router();
      
    orderRouter.post("/createOrder", isAuthenticated, createOrder);

    orderRouter.get("/getOrders", isAuthenticated, getOrders);

    orderRouter.get("/getOrder/:id", getOrderByID);

    orderRouter.patch("/updateOrder/:id", updateOrder);

    orderRouter.patch("/completeOrder/:id", completeOrder);

    orderRouter.delete("/deleteOrder/:id", deleteOrder);

    orderRouter.get("/getMyOrders", isAuthenticated, getOrdersByUser);

    orderRouter.patch("/addRating/:id", addRatingToProduct);
    import { isAuthenticated } from "../routers.middleware/authentication.js";
</details>

<details>
      <summary>Product Endpoints</summary>
      <br>
          
        const productRouter = express.Router();

        productRouter.post("/createProduct", isAuthenticated, createProduct);
    
        productRouter.get("/getAllProducts", getAllProducts);
    
        productRouter.get("/getProduct/:id", getProduct);
    
        productRouter.patch("/updateProduct/:id", updateProduct);
    
        productRouter.delete("/deleteProduct/:id", deleteProduct);
    
        productRouter.delete("/deleteProducts", deleteProducts);
    
        productRouter.get("/search", searchProducts);
    
        productRouter.patch("/archiveProduct/:id", archeiveProduct);
    
        productRouter.patch("/unarchiveProduct/:id", unarcheiveProduct);
    
        productRouter.get("/getProductsById", isAuthenticated, getProductsById);
</details>

<details>
    <summary>Promocode Endpoints</summary>
    <br>
    
        promoCodeRouter.post("/validatePromoCode", isAuthenticated, validatePromoCode);
        promoCodeRouter.post("/applyPromoCode", isAuthenticated, applyPromoCode);
        promoCodeRouter.post("/createPromoCode", createGeneralPromoCode);
</details>
<details>
    <summary>Rating Endpoints</summary>
    <br>
    
        const ratingRouter = express.Router();
        ratingRouter.post("/createRating", createRating);
        ratingRouter.get("/getRating/:id", getRatingById);
        ratingRouter.get("/getRatings", getRatings);
        ratingRouter.patch("/updateRating/:id", updateRating);
        ratingRouter.delete("/deleteRating/:id", deleteRating);
        ratingRouter.post("/rateProduct/:id", isAuthenticated, rateProduct);
        ratingRouter.post("/rateTourGuide/:id", isAuthenticated, rateTourGuide);
        ratingRouter.post("/rateItinerary/:id", isAuthenticated, rateItinerary);
        ratingRouter.post("/rateActivity/:id", isAuthenticated, rateActivity);
</details>

<details>
      <summary>Seller Endpoints</summary>
      <br>
      
    const sellerRouter = express.Router();

    sellerRouter.post("/createSeller", createSeller);

    sellerRouter.get("/getSellers", getSellers);

    sellerRouter.get("/getSellerById", isAuthenticated, getSellerById);

    sellerRouter.put("/updateSeller", isAuthenticated, updateSeller);

    sellerRouter.delete("/deleteSeller", isAuthenticated, deleteSeller);

    sellerRouter.put("/changeSellerPassword", isAuthenticated, changeSellerPassword);

    sellerRouter.get("/documents", getSellersDocuments);
</details>

<details>
      <summary>Preference Tag Endpoints</summary>
      <br>
    
    const tagRouter = express.Router();

    tagRouter.post("/createTag", createTag);

    tagRouter.get("/allTags", getTag);

    tagRouter.put("/updateTag/:id", updateTag);

    tagRouter.delete("/deleteTag/:id", deleteTag);

    tagRouter.get("/getTagByID/:id", getTagByID);

    tagRouter.get("/searchTags", searchTags);
</details>
<details>
    <summary>Tourguide Endpoints</summary>
    
    const tourGuideRouter = express.Router();
    
    tourGuideRouter.post("/createTourGuide", createTourGuide);
    
    tourGuideRouter.get("/getTourGuides", getTourGuides);
    
    tourGuideRouter.get("/tourGuide", isAuthenticated, getTourGuideById);
    
    tourGuideRouter.put("/updateTourGuide", isAuthenticated, updateTourGuide);
    
    tourGuideRouter.delete("/deleteTourGuide", isAuthenticated, deleteTourGuide);
    
    tourGuideRouter.put("/changeTourguidePassword", isAuthenticated, changeTourguidePassword);
    
    tourGuideRouter.get("/documents", getTourGuidesDocuments);
    
    tourGuideRouter.get("/tourGuide/:id", getTourGuide);
</details>
<details>
    <summary>Tourist Endpoints</summary>
    
  * `GET /tourist/getTourists` - Get all tourists
	  - **Request Body**: N/A
	  - **Response Body**
	    ```
	    {
	        [
			   	username: { type: String, ref: "Username"},
			   	password: String,
			   	name: String,
				email: { type: String, ref: "Email" },
				mobile: String,
				nationality: String,
				DOB: Date,
				job: String,
				picture: String,
				wallet: Number,
				points: Number,
				loyalityPoints: Number,
				notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notification" }],
				hotelBookings: [Object],
				flightBookings: [Object],
				preferences: [{ type: String, ref: "Tag" }],
				address: [{ name: String, Latitude: Number, Longitude: Number, address: String }],
				currency: String,
	    	]
	    }
	    ```
      
    touristRouter.post("/createTourist", createTourist);
    
    touristRouter.get("/tourist", isAuthenticated, getTouristById);
    
    touristRouter.put("/updateTourist", isAuthenticated, updateTourist);
    
    touristRouter.delete("/deleteTourist", isAuthenticated, deleteTourist);
    
    touristRouter.post("/redeemPoints", isAuthenticated, redeemPoints);
    
    touristRouter.post("/addPreference", isAuthenticated, addPreference);
    
    touristRouter.delete("/removePreference", isAuthenticated, removePreference);
    
    touristRouter.patch("/updatePassword", isAuthenticated, changeTouristPassword);
</details>
<details>
    <summary>Tourist Bookmark Endpoints</summary>
    
    const touristBookmarkRouter = express.Router();
    
    touristBookmarkRouter.post("/bookmark", isAuthenticated, toggleBookmark);
    
    touristBookmarkRouter.post("/getBookmarkStatus", isAuthenticated, getBookmarkStatus);
    
    touristBookmarkRouter.get("/getActivityBookmarks", isAuthenticated, getActivityBookmarks);
    
    touristBookmarkRouter.get(
        "/getItineraryBookmarks",
        isAuthenticated,
        getItineraryBookmarks
    );
    import { isAuthenticated } from "../routers.middleware/authentication.js";
</details>

<details>
<summary>Tourist Cart Endpoints</summary>

    const touristCartRouter = express.Router();
    
    touristCartRouter.get("/getCart", isAuthenticated, getTouristCart);
    
    touristCartRouter.post("/updateCart", isAuthenticated, updateTouristCart);
    
    touristCartRouter.delete("/clearCart", isAuthenticated, deleteTouristCart);
    
    touristCartRouter.delete(
        "/deleteProduct/:id",
        isAuthenticated,
        deleteItemFromTouristCart
    );
</details>

<details>
    <summary>Tourist Wishlist Endpoints</summary>
    
    const touristWishlistRouter = express.Router();
    
    touristWishlistRouter.post("/wishlist", isAuthenticated, toggleWishlist);
    
    touristWishlistRouter.post("/getProductsStatus", isAuthenticated, getProductsStatus);
    
    touristWishlistRouter.get("/getWishlistProducts", isAuthenticated, getWishlistProducts);
</details>

<details>
    <summary> Username Endpoints</summary>
    
    const usernameRouter = express.Router();

    usernameRouter.post("/createUsername", createUsername);

    usernameRouter.get("/allUsernames", getUsernames);

    usernameRouter.put("/updateUsername", updateUsername);

    usernameRouter.delete("/deleteUsername", deleteUsername);
</details>


## Tests
- We use [Postman](https://www.postman.com/) to manually test all our API references by making sure the response is as expected.
- Here are some examples:
  
    * [Tourist Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-ff91fd2c-3fb6-4567-9c57-93264c09fc71?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Username Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-872db6df-5b42-42fc-ad09-a551d63df0f8?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Email Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-6c68a556-c215-454a-b0fb-3e12a879af6a?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Activity Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-cbcb4f1b-2b55-4454-86d6-e6d0832c83df?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Advertiser Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-6b9a2551-36be-419f-8826-fae0f3e62f53?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Rating Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-7764dd6d-96ee-4a4c-9e69-6f6e21d0bb2d?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Itinerary Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-993debac-e3ed-40da-bf80-dea0d0568355?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Tour Guide Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-d1632a1d-0a00-43dd-98dd-7f23062a092b?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Landmark Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-45539069-03df-4c74-a1b4-9df1ee004a9a?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Admin Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-0b5d3940-d73d-4e78-abbc-9aba7601955c?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Complaint Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-24c2ae69-7c28-42f4-9e3f-5b99110a6240?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Seller Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-feb8f065-677e-458a-971f-596b5e23695a?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Product Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-689f3e80-8b90-4edf-8026-690dd898e804?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [Hotel Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-8856ecc5-8f89-4443-a2c9-f58b762dc40d?action=share&source=copy-link&creator=40554084&ctx=documentation)
    * [OTP Tests](https://ibn-battuta-1248.postman.co/workspace/3d11366f-74ca-4b83-8721-8cb3204556b7/folder/38606166-d155d337-fcd0-4229-8f15-6f4da428b9d1?action=share&source=copy-link&creator=40554084&ctx=documentation)

## How to Use 🚀

<details>
<summary> For Tourists </summary>
    
    - Create an Account or Login:

    	- Navigate to the app's login or registration page.

    	- Create a new account or log in using your existing credentials.

    - Plan Your Trip:

    	- Use the navigation bar to discover meseums, activities, and itineraries based on your preferences (e.g., historic landmarks, beaches, budget-friendly options).

    	- Browse personalized trip suggestions tailored to your interests, and filter based on rating, location, budget, etc.
      
    	- Choose an activity or itinerary, and view its details.
 
    	- Book tickets easily, and pay online with card.
      
    - Book Flights and Hotels:

    	- Once you’ve planned your itinerary, book flights, hotels, and transportation directly within the app.
      
    	- The app will show you available options with prices and descriptions.
      
    - View Your Booking:

    	- View your itinerary, activity, flight and hotel booking details in **My Bookings**.
      
    	- Stay updated with notifications about your upcoming trips.
 
    	- In case of any change in plans, you can can cancel your activity/itinerary bookings 48 hours before the start date.
      
    - Shop for Souvenirs:

    	- Browse the in-app gift shop for souvenirs, unique items, and local goods to remember your trip by.

    	- Add products to your cart, and checkout your order.

    	- Choose to pay with card, wallet, or cash on delivery.
 
    	- View your order details and status in **My Orders**

</details>

<details>
<summary> For Tour Guides</summary>
    
    - Create an Account or Login:

    	- Navigate to the app's login or registration page.

    	- Create a new account or log in using your existing credentials.

    - Create and Manage Your Itineraries:

    	- Navigate to **My Tours** to view and edit your existing itineraries.
 
     	- Using the **New Itinerary** button, you can create a new itinerary by entering its details, and choosing which activities will be including in it.
     
    - Browse Other Itineraries:
      
      	- Navigate to **Browse** to view itineraries created by other tour guides to scope out the competition.

    - View Your Analytics:
      
      	- Navigate to **Analytics** to view detailed report about your itineraries.
     
      	- Details include your best-selling itinerary, how many tourist booked your itineraries per month, and more.
</details>

<details>
<summary> For Advertisers</summary>
    
    - Create an Account or Login:

    	- Navigate to the app's login or registration page.

    	- Create a new account or log in using your existing credentials.

    - Create and Manage Your Activities:

    	- Navigate to **My Activities** to view and edit your existing activities.
 
     	- Using the **New Activity** button, you can create a new activity by entering its details.
     
    - Browse Other Activities:
      
      	- Navigate to **Browse** to view activities created by other advertisers to scope out the competition.

    - View Your Analytics:
      
      	- Navigate to **Analytics** to view detailed report about your activities.
     
      	- Details include your best-selling activity, how many tourist booked your activities per month, and more.

</details>

<details>
<summary> For Sellers </summary> 
    
    - Create an Account or Login:

    	- Navigate to the app's login or registration page.

    	- Create a new account or log in using your existing credentials.

    - Create and Manage Your Products:

    	- Navigate to **Invetory** to view and edit your existing products.
 
     	- Using the **New Product** button, you can create a new product by entering its details.
     
    - Browse Other Products:
      
      	- Navigate to **Shop** to view products sold by other sellers to scope out the competition.

    - View Your Analytics:
      
      	- Navigate to **Analytics** to view detailed report about your products.
     
      	- Details include your best-selling product, how many tourist bought your products per month, and more.

</details>
  
<details>

<summary> For Tourism Governors </summary>
    
    - Create an Account or Login:

    	- Navigate to the app's login or registration page.

    	- Create a new account or log in using your existing credentials.

      Plan Your Trip:

    - Use the search bar to discover destinations, activities, and itineraries based on your preferences (e.g., historic landmarks, beaches, budget-friendly options).
	
</details>


## Contribute 🤝

We welcome contributions to make this project even better! Whether you're fixing bugs, adding new features, or improving documentation, we appreciate your involvement. Here's how you can contribute:

    1. Fork the Repository
        Start by forking the repository to your own GitHub account:
        - Go to the repository page.
        - Click the Fork button in the top-right corner.

    2. Clone Your Fork
        git clone https://github.com/your-username/your-forked-repository.git cd your-forked-repository

    3. Create a New Branch
        git checkout -b feature/your-feature-name
    
    4. Make Your Changes
        Make your changes locally. Depending on what you're working on, this could involve:

        -Adding new features or functionality.
        -Fixing bugs or improving existing code.
        -Updating or adding documentation.
        -Improving tests or code coverage.
    Ensure that your changes follow the project's coding style and conventions (refer to the Code Style section in the README).

    5. Test Your Changes
        Test your changes locally to ensure that everything works as expected

    6. Commit Your Changes
        git add .
        git commit -m "Add description of your changes"

    7. Push Your Changes
        git push origin feature/your-feature-name

    8. Open a Pull Request
        Go to the main repository and open a pull request (PR) from your fork to the main branch.

    9. Participate in Code Review
        Once your pull request is submitted, it will be reviewed by the team. Be responsive to feedback and make any necessary changes.

## Credits 🙏

-   Docs
    
    - [Mongoose docs](https://mongoosejs.com/docs/)
    
    - [ExpressJS docs](https://expressjs.com/en/guide/routing.html)

    - [ReactJS docs](https://react.dev/learn)

    - [NodeJS docs](https://nodejs.org/docs/latest/api/)
    
    - [MUI docs](https://mui.com/material-ui/getting-started/)

-   YouTube Videos

    - [MongoDB Crash Course](https://youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA&si=Ig6ieW9te1vNuzgS)

    - [ReactJS Crash Course](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d)

    - [NodeJS Crash Course](https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU)
 
    - [NodeJS, ExpressJS and MongoDB Crash Course](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hAJ-ARcYq_z6lDZV7kT1xD)

    - [MERN stack Crash Course](https://www.youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE)
## License 📝


The software is open source under the `Apache 2.0 License`.

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
