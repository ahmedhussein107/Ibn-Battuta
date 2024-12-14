![WhatsApp Image 2024-12-08 at 5 59 48 PM](https://github.com/user-attachments/assets/88406ce0-0de2-4b43-9e92-a16eaba79f50)

# Ibn-Battuta


## Motivation 🚀 


Welcome to Ibn Battuta, a team inspired by the legendary explorer who traversed continents, connecting people and cultures through his unparalleled journeys. Just as Ibn Battuta ventured boldly into the unknown, our team embraces the challenge of creating the ultimate Virtual Trip Planner. With a shared vision of innovation and exploration, we are committed to delivering a platform that redefines how people discover, plan, and experience travelling. Guided by curiosity, collaboration, and a passion for excellence, we take each sprint as a new step in our journey toward crafting seamless, personalized, and unforgettable travel experiences. Together, we aim to leave a lasting mark on the world of travel technology, one milestone at a time.
## Build Status 🚧

-Under Development: This project is currently under active development and is not ready for production use.

-Issue Tracking: Check the Issues section for a complete list of reported bugs, feature requests, and tasks.

-Automated Testing: While the initial set of tests has been implemented, more comprehensive automated tests will be added to ensure better coverage and reliability in future iterations.

-Documentation: We aim to expand and refine the documentation to provide clear guidance for contributors and users. Stay tuned for updates!
## Code Style 🖋️

Our codebase adheres to clean and consistent coding standards to ensure readability, maintainability, and collaboration across the team. Below are the key practices we follow:

- General Conventions: - Use camelCase, PascalCase as well as writing self-documenting code.
- Linting and Formatting: Format code with Prettier to enforce consistent style (e.g., single quotes, semicolon usage).
## Screenshots


![Screenshot 2024-12-09 044514](https://github.com/user-attachments/assets/bf2daf68-6f97-478e-b482-5705cff1adb2)
![Screenshot 2024-12-09 044414](https://github.com/user-attachments/assets/9a6799f1-1df0-48ff-bd05-8b12ccf663b2)
![Screenshot 2024-12-09 044358](https://github.com/user-attachments/assets/e4b426d1-ef40-4864-8187-7dafc39b51f3)
![Screenshot 2024-12-09 044347](https://github.com/user-attachments/assets/9ba45856-7a4b-46e7-88ac-e9ad378de6c6)
![Screenshot 2024-12-14 094214](https://github.com/user-attachments/assets/4e85064c-ad6e-4f5a-b9c4-ade845707b36)
![Screenshot 2024-12-14 094433](https://github.com/user-attachments/assets/6aeba29b-03bb-453e-bb86-260ab85df3fc)
![Screenshot 2024-12-14 094747](https://github.com/user-attachments/assets/c0866300-5b77-4cfe-a7c8-79cf0dcb41f2)



## Tech and Frameworks Used 🛠️

Our project leverages modern technologies and tools to deliver a robust, scalable, and user-friendly platform. Below is a list of the main tech stack and frameworks used:

- Frontend:
    
    -React.js: For building dynamic, responsive, and reusable UI components.

    -Material-UI: For creating a consistent, visually appealing, and responsive design.
    
    -Axios: For making HTTP requests to the backend API.
- Backend:
    
    -Node.js: For building the server-side logic and handling RESTful API endpoints.
    
    -Express.js: As the web application framework for routing and middleware.
-   Database:
    
    -MongoDB: For storing and managing application data in a NoSQL format.

    -Mongoose: For schema modeling and interacting with the MongoDB database.
-   DevOps and Tools:
    
    -Git: For version control and collaboration.
    
    -GitHub: For repository hosting and issue tracking.
    
    -Prettier: For maintaining code quality and consistency.
    
    -Postman: For API testing and debugging.
-   Other Libraries and Utilities:
    
    -dotenv: For managing environment variables securely.
    
    -Google Maps API: For location-based services like reverse geocoding and displaying maps.
## Features ✨
 
Our Virtual Trip Planner offers a comprehensive suite of features to make travel planning effortless and enjoyable. Key highlights include:

-   Personalized Travel Planning:

    -Customize your trip based on preferences like historic landmarks, beaches, shopping, or budget-friendly options.

-   Seamless Booking:

    -Book flights, accommodations, and transportation directly within the app through trusted third-party services (Amadeus).

-   Discover Local Gems:

    -Explore curated recommendations for local activities, museums, and historical landmarks with ticket prices and navigation options.

-   Real-Time Notifications:

    -Stay updated with instant alerts for upcoming activities, bookings, or changes via app notifications and email.

-   Tour Guide Integration:

    -Access professional guided tours or create your own itinerary with customizable activity breakdowns.

-   In-App Gift Shop:

    -Browse a curated selection of souvenirs and unique local items to commemorate your journey.

-   Comprehensive Itinerary Management:

    -View, modify, and share your itinerary with an intuitive timeline display.

-   Location-Based Services:

    -Use integrated maps for navigation and get detailed location data for activities and landmarks.

-   Accessibility and Tagging:

    -Find activities and destinations tailored to your needs with accessibility filters and categorized tags.
## Code Examples 
<details>
<summary>- Tourist Model</summary>
  
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

</details>
<details>
<summary>-Tourist Controller :</summary>


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
</details>

## Installation

-   Make sure you have Node and Git installed

-   Clone the Repository
        
        #git clone https://github.com/your-username/your-repository.git
cd your-repository

-   Install Dependencies
        
        # Install backend dependencies
            cd backend
            npm install

        # Install frontend dependencies
            cd ../frontend
            npm install

- Set Up Environment Variables 

    -Create a .env file in both the backend and frontend directories and configure the necessary environment variables.

        //Backend .env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        MAP_API_KEY=your_google_maps_api_key

        //Frontend .env
        REACT_APP_API_URL=http://localhost:5000
        REACT_APP_MAP_API_KEY=your_google_maps_api_key

-   Start the Application
        
        npm run dev
    -Visit the application in your browser at http://localhost:5173.

## API Refrences 

Below are some of the API endpoints used in the project. Each endpoint is organized by its related model, functionality and includes details about the request method and URL.

<details>
  <summary>Activity routes</summary>
  <br>
  
     const activityRouter = express.Router();

    activityRouter.post("/createActivity", isAuthenticated, createActivity);

    activityRouter.get("/getActivity/:id", getActivityById);

    activityRouter.get("/getAllActivities", getAllActivities);

    activityRouter.patch("/updateActivity/:id", updateActivity);

    activityRouter.get("/getAdvertiserActivities/", isAuthenticated, getAdvertiserActivities);

    activityRouter.delete("/deleteActivity/:id", deleteActivity);

    activityRouter.get("/getUpcomingActivities", getUpcomingActivities);

    activityRouter.patch("/toggleFlag/:id", toggleFlaggedActivities);
</details>
     
 <details>
  <summary>Admin routes</summary>
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
  <summary>Analytics routes</summary>
  <br>
     
      const analyticsRouter = express.Router();

    analyticsRouter.get("/getAnalytics", isAuthenticated, getAnalytics);
</details>

 <details>
  <summary>Booking routes</summary>
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
  <summary>Categoey routes</summary>
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
  <summary>Comment routes</summary>
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
      <summary>Complaint routes</summary>
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
    <summary>Custom Activity routes</summary>
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
          <summary>General routes</summary>
          <br>
          
          generalRouter.put("/changePassword", changePassword);
        generalRouter.post("/login", login);
        generalRouter.post("/createOTP", createOTPandSendEmail);
        generalRouter.post("/verifyOTP", verifyOTP);
        import { isAuthenticated } from "../routers.middleware/authentication.js";
</details>
  
 <details>
      <summary>Governor routes</summary>
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
        <summary>Itinerary routes</summary>
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
          <summary>Landmark routes</summary>
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
      <summary>Tag routes</summary>
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
      <summary>Order routes</summary>
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
      <summary>Product routes</summary>
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
    <summary>Promo code routes</summary>
    <br>
    
        promoCodeRouter.post("/validatePromoCode", isAuthenticated, validatePromoCode);
        promoCodeRouter.post("/applyPromoCode", isAuthenticated, applyPromoCode);
        promoCodeRouter.post("/createPromoCode", createGeneralPromoCode);
</details>
<details>
    <summary>Rating routes</summary>
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
      <summary>Seller routes</summary>
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
      <summary>Preference  Tag routes</summary>
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
    <summary>Tourguide routes</summary>
    
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
    <summary>Tourist routes</summary>
    
    const touristRouter = express.Router();
    
    touristRouter.get("/getTourists", getTourists);
    
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
    <summary>Tourist Bookmark routes</summary>
    
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
<summary>Tourist Cart routes</summary>

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
    <summary>Tourist Wishlist routes</summary>
    
    const touristWishlistRouter = express.Router();
    
    touristWishlistRouter.post("/wishlist", isAuthenticated, toggleWishlist);
    
    touristWishlistRouter.post("/getProductsStatus", isAuthenticated, getProductsStatus);
    
    touristWishlistRouter.get("/getWishlistProducts", isAuthenticated, getWishlistProducts);
</details>

<details>
    <summary>Username routes</summary>
    
    const usernameRouter = express.Router();

    usernameRouter.post("/createUsername", createUsername);

    usernameRouter.get("/allUsernames", getUsernames);

    usernameRouter.put("/updateUsername", updateUsername);

    usernameRouter.delete("/deleteUsername", deleteUsername);
</details>
## Tests
- We use Postman to manually test all our api references by making sure the response is as expected. We use it as some kind of sanity-check.
- Here are some examples:
![Screenshot 2024-12-09 051853](https://github.com/user-attachments/assets/aab58753-16e8-4763-a431-384c660205a7)
![Screenshot 2024-12-09 052018](https://github.com/user-attachments/assets/971e6bc1-3a52-4fe7-abb8-3b036c1a91e7)


## How to Use 🚀

-   For End Users (Travel Planning)
    
    -Create an Account or Login:

    -   Navigate to the app's login or registration page.

    -   Create a new account or log in using your existing credentials.

    -Plan Your Trip:

    - Use the search bar to discover destinations, activities, and itineraries based on your preferences (e.g., historic landmarks, beaches, budget-friendly options).

    - Browse personalized trip suggestions tailored to your interests.
    -Book Flights and Hotels:

    -   Once you’ve planned your itinerary, book flights, hotels, and transportation directly within the app.
    -   The app will show you available options with prices and descriptions.
    -Join Guided Tours:

    -   Get a detailed breakdown of activities, timings, and costs.

    -View Your Itinerary:

    -   View and your itinerary in real-time, including activities, locations, and accommodation details.
    -   Stay updated with notifications about your upcoming trips.
    -Shop for Souvenirs:

    -   Browse the in-app gift shop for souvenirs, unique items, and local goods to remember your trip by.



-   For Developers (Setting Up Locally)
    
    -follow the Installation steps 
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
    
    -Mongoose docs
    
    -Express docs

    -ReactJs docs

    -NodeJs docs

    -Prettier docs
    
    -MUI docs

-   YouTube Videos

    -Mongoose Crash Course

    -Express Crash Course

    -ReactJs Crash Course

    -NodeJs Crash Course

    -MERN stack Crash Course
## License 📝

The software is open source under the Apache 2.0 License.
