import express from "express";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/config.js";
import sendEmail from "../utilities/emailUtils.js";

const stripeRouter = express.Router();
const stripe = new Stripe(STRIPE_SECRET_KEY);

// Create a payment intent
stripeRouter.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Create a PaymentIntent with the specified amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            metadata: { integration_check: "accept_a_payment" },
        });

        console.log("payment Intent created: ", paymentIntent);

        // Send the client secret to the client
        res.json({
            clientSecret: paymentIntent.client_secret,
            message: "Payment Intent Created Successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Error creating payment intent",
        });
    }
});

// IMPORTANT: This endpoint needs to be registered BEFORE app.use(express.json())
// in your server.js file because Stripe needs the raw body
stripeRouter.post("/webhook", async (req, res) => {
    // Since you're using app.use(express.json()), you need to get the raw body differently
    const sig = req.headers["stripe-signature"];
    const payload = req.body; // This will be empty if express.json() processed it first!
    let event;
    try {
        // This will fail if express.json() has already processed the body
        event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle successful payment
    if (event.type === "charge.updated") {
        const paymentIntent = event.data.object;
        // Here you can update your database, send confirmation emails, etc.
        sendEmail(
            paymentIntent.billing_details.email,
            "Testing",
            paymentIntent.receipt_url
        );
    }

    res.json({ received: true });
});

export default stripeRouter;
