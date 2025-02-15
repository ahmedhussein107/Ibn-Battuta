import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import Notification from "../models/notification.model.js";
import Booking from "../models/booking.model.js";
import sendEmail from "../utilities/emailUtils.js";
import { incrementnotificationCount } from "../routes/ws.router.js";

const secretKey =
    process.env.JWT_SECRET || "any key to cipher the password and decipher ";
export const changePassword = async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        const userName = await mongoose.model("Username").findById(username);
        if (!userName) {
            return res.status(404).json({ message: "User not found" });
        }

        const userType = userName.userType;

        const UserModel = mongoose.model(userType);
        if (!UserModel) {
            return res.status(400).json({ message: "Invalid user type" });
        }
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createOTPandSendEmail = async (req, res) => {
    try {
        const { username } = req.body;

        const userName = await mongoose.model("Username").findById(username);
        if (!userName) {
            return res
                .status(404)
                .json({ message: "The username you entered is incorrect" });
        }

        const userType = userName.userType;
        const UserModel = mongoose.model(userType);
        if (!UserModel) {
            return res.status(400).json({ message: "Invalid user type" });
        }
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const hashedOTP = await bcrypt.hash(otp.toString(), 10);

        await mongoose.model("Username").findByIdAndUpdate(username, {
            otp: hashedOTP,
        });

        const email = user.email;
        const subject = "OTP for password reset";
        const message = `Your OTP for password reset is: ${otp}`;
        try {
            await sendEmail(email, subject, message);
        } catch (e) {
            return res.status(404).json({ message: e.message || "Error sending email" });
        }

        res.status(200).json({ message: "OTP created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyOTP = async (req, res) => {
    const { username, otp } = req.body;

    try {
        const userName = await mongoose.model("Username").findById(username);

        if (!userName) {
            return res.status(404).json({ message: "User not found" });
        }

        const fiveMinutesInMs = 5 * 60 * 1000;
        console.log("time passed", Date.now() - new Date(userName.updatedAt).getTime());
        if (
            Date.now() - new Date(userName.updatedAt).getTime() > fiveMinutesInMs ||
            !userName.otp
        ) {
            userName.otp = null;
            await userName.save();
            return res.status(400).json({ message: "Your OTP has expired" });
        }

        const otpMatch = await bcrypt.compare(otp, userName.otp);

        if (!otpMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        userName.otp = null;
        await userName.save();
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.id;
    console.log("updating notification is read");
    try {
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userRecord = await mongoose.model("Username").findById({ _id: username });
        if (!userRecord) {
            return res.status(404).json({ message: "Username not found" });
        }

        const user = await mongoose.model(userRecord.userType).findOne({ username });
        if (!user) {
            return res
                .status(404)
                .json({ message: `No user found with the username: ${username}` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // for test with no encryption
        // if (password !== user.password) {
        //     return res.status(401).json({ message: "Invalid credentials" });
        // }

        if (
            userRecord.userType === "TourGuide" ||
            userRecord.userType === "Advertiser" ||
            userRecord.userType === "Seller"
        ) {
            if (!user.isAccepted) {
                res.status(400).json({ message: "User is not accepted" });
                return;
            }
        }

        assignCookies(
            res,
            userRecord.userType,
            user._id.toString(),
            user.picture,
            user.currency,
            user.email,
            user?.wallet
        )
            .status(200)
            .json({ message: "Login successful", user });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const assignCookies = (
    res,
    userType,
    userId,
    profileImage,
    currency = "EGP",
    email = "",
    wallet = 0
) => {
    const maxAge = 5 * 60 * 60 * 1000; // 5 hours
    const token = jwt.sign({ userId, userType }, secretKey, {
        expiresIn: "5h",
    });

    res.cookie("jwt", token, { maxAge });
    res.cookie("userType", userType, { maxAge });
    if (profileImage) res.cookie("profileImage", profileImage, { maxAge });
    if (userType === "Tourist") {
        res.cookie("currency", currency || "EGP", { maxAge });
        res.cookie("email", email, { maxAge });
        res.cookie("balance", wallet, { maxAge });
    }

    return res;
};

export const sendNotificationToEmailAndSystem = async (
    subject,
    message,
    userId,
    userType,
    relatedId,
    relatedType,
    type = "info"
) => {
    console.log("making notification");
    const notification = new Notification({
        message: message,
        type: type,
        relatedType: relatedType,
        relatedId: relatedId,
    });
    await notification.save();

    const user = await mongoose.model(userType).findByIdAndUpdate(
        userId,
        {
            $push: { notifications: notification._id },
        },
        { new: true }
    );

    incrementnotificationCount(userId, userType, notification);
    sendEmail(user?.email, subject, notification?.message);
    console.log("email sent ");
};

export const notifyAdminsAboutComplaint = async (
    complaintTitle,
    complaintId,
    isComment = false
) => {
    const admins = await mongoose.model("Admin").find();
    for (const admin of admins) {
        if (!admin.email) continue;
        sendNotificationToEmailAndSystem(
            "New Complaint",
            isComment
                ? `Tourist posted a new comment under Complaint ${complaintTitle}`
                : `A tourist has a complaint about ${complaintTitle}.\nPlease review it.`,
            admin._id,
            "Admin",
            complaintId,
            "Complaint"
        );
    }
};
// scheduling notification about upcoming events, taks runs every 1 hour
// minute hour day month weekday(1-7)
cron.schedule("0 * * * *", async () => {
    // starting next day
    const startWindow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const upcomingBookings = await Booking.find({
        eventStartDate: {
            $gte: startWindow,
            $lte: new Date(startWindow.getTime() + 60 * 60 * 1000),
        }, // 1 hour window
    });
    console.log("upcomingBookings", upcomingBookings);
    for (const booking of upcomingBookings) {
        sendNotificationToEmailAndSystem(
            `Reminder: Upcoming ${booking.bookingType}`,
            `This is a reminder about the upcoming ${booking.bookingType}.\nIt will start in ${booking.eventStartDate}, looking forward to seeing you there!\nFor more details visit our website at https://ibn-battuta.com`,
            booking.touristID,
            "Tourist",
            booking.typeId,
            booking.bookingType
        );
    }
});
