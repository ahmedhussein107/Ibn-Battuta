import express from "express";
import Email from "../models/email.model.js";

const emailRouter = express.Router();

emailRouter.post("/sendEmail", async (req, res) => {
    try {
        const newEmail = await Email.create(req.body);
        res.json(newEmail);
        res.status(201).json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

emailRouter.get("/getEmail/:id", async (req, res) => {
    try {
        const emails = await Email.findById(req.params.id);
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

emailRouter.get("/getEmails", async (req, res) => {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default emailRouter;