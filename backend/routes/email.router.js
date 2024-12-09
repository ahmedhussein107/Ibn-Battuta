import express from "express";
import Email from "../models/email.model.js";
import sendEmail from "../utilities/emailUtils.js";

const emailRouter = express.Router();

emailRouter.post("/createEmail", async (req, res) => {
    try {
        console.log(req.body);
        const email = await Email.create(req.body);
        res.json(email);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

emailRouter.get("/allEmails", async (req, res) => {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

emailRouter.put("/updateEmail", async (req, res) => {
    const { email } = req.body;
    try {
        const emails = await Email.updateOne({}, { email });
        res.json(emails);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

emailRouter.delete("/deleteEmail", async (req, res) => {
    const { email } = req.body;
    try {
        const emails = await Email.deleteOne({ email });
        res.json(emails);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

emailRouter.post("/sendMeEmail", async (req, res) => {
    const { email, amount } = req.body;
    try {
        const emailBody = `<h1>Hi, ${email}</h1><p>you have paid an amount of ${amount} </p>`;
        sendEmail(email, "Payment for your order", emailBody, "html");
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

export default emailRouter;
