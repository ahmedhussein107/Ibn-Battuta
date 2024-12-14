import PromoCode from "../models/promocode.model.js";
import Tourist from "../models/tourist.model.js";
import cron from "node-cron";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";

// Create a general promo code
export const createGeneralPromoCode = async (req, res) => {
	try {
		const {
			code,
			discount = 20,
			maxUsage = 1,
			expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		} = req.body;

		const promoCode = new PromoCode({
			_id: code,
			discount,
			maxUsage,
			expiresAt,
		});

		await promoCode.save();

		return res.status(201).json({
			message: "General promo code created successfully",
			promoCode: {
				id: promoCode._id,
				discount: promoCode.discount,
				maxUsage: promoCode.maxUsage,
				expiresAt: promoCode.expiresAt,
			},
		});
	} catch (error) {
		return res.status(400).json({
			message: "Error creating promo code",
			error: error.message,
		});
	}
};

// Create birthday promo codes automatically
export const createBirthdayPromoCodes = async () => {
	try {
		// Find tourists with birthdays today
		const today = new Date();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		const tourists = await Tourist.aggregate([
			{
				$addFields: {
					month: { $month: "$DOB" },
					day: { $dayOfMonth: "$DOB" },
				},
			},
			{
				$match: {
					month: month,
					day: day,
				},
			},
		]);
		const createdPromoCodes = [];

		for (let tourist of tourists) {
			const uniqueId = `BD-${tourist.username}-${
				today.getFullYear() - tourist.DOB.getFullYear()
			}`;

			// Check if promo code already exists
			const existingPromoCode = await PromoCode.findById(uniqueId);
			if (existingPromoCode) {
				console.log(`Birthday promo code already exists for ${tourist.email}`);
				continue;
			}

			const birthdayPromoCode = new PromoCode({
				_id: uniqueId,
				discount: 20,
				maxUsage: 1,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			});

			await birthdayPromoCode.save();
			createdPromoCodes.push(birthdayPromoCode);

			await sendBirthdayPromoCode(tourist, birthdayPromoCode);
		}

		return createdPromoCodes;
	} catch (error) {
		console.error("Error creating birthday promo codes:", error);
		throw error;
	}
};

// Validate promo code
export const validatePromoCode = async (req, res) => {
	try {
		const touristId = req.user.userId;
		const { promoCodeId } = req.body;

		// Find the promo code
		const promoCode = await PromoCode.findById(promoCodeId);

		if (!promoCode) {
			return res.status(404).json({ message: "Promo code not found" });
		}

		// Check if the promo code has expired
		if (new Date() > promoCode.expiresAt) {
			return res.status(400).json({ message: "Promo code has expired" });
		}

		// Check if the promo code usage limit has been reached
		if (promoCode.usedBy.length >= promoCode.maxUsage) {
			return res.status(400).json({ message: "Promo code usage limit exceeded" });
		}

		// Check if the tourist has already used the promo code
		if (promoCode.usedBy.includes(touristId)) {
			return res.status(400).json({ message: "You have already used this promo code" });
		}

		return res.status(200).json({
			message: "Promo code is valid",
			promoCodeDetails: {
				id: promoCode._id,
				discount: promoCode.discount,
			},
		});
	} catch (error) {
		return res.status(400).json({
			message: "Error validating promo code",
			error: error.message,
		});
	}
};

// Apply promo code
export const applyPromoCode = async (req, res) => {
	try {
		const touristId = req.user.userId;
		const { promoCodeId, totalAmount } = req.body;

		// Find the promo code
		const promoCode = await PromoCode.findById(promoCodeId);

		if (!promoCode) {
			return res.status(404).json({ message: "Promo code not found" });
		}

		// Check if the tourist has already used the promo code
		if (promoCode.usedBy.includes(touristId)) {
			return res.status(400).json({ message: "You have already used this promo code" });
		}

		// Use the promo code method to validate and apply
		await promoCode.usePromoCode(touristId);

		// Calculate discount
		const discountAmount = totalAmount * (promoCode.discount / 100);
		const finalAmount = totalAmount - discountAmount;

		return res.status(200).json({
			message: "Promo code applied successfully",
			originalAmount: totalAmount,
			discountAmount,
			finalAmount,
			promoCodeDetails: {
				id: promoCode._id,
				discount: promoCode.discount,
			},
		});
	} catch (error) {
		return res.status(400).json({
			message: "Error applying promo code",
			error: error.message,
		});
	}
};

// Delete expired or max usage promo codes
export const deleteExpiredOrMaxUsagePromoCodes = async () => {
	try {
		const result = await PromoCode.deleteMany({
			$or: [
				{ expiresAt: { $lt: new Date() } },
				{ $expr: { $gte: [{ $size: "$usedBy" }, "$maxUsage"] } },
			],
		});

		console.log(`Deleted ${result.deletedCount} promo codes (expired or max usage reached)`);
		return result.deletedCount;
	} catch (error) {
		console.error("Error deleting promo codes:", error);
		throw error;
	}
};

// Send birthday promo code email
const sendBirthdayPromoCode = async (tourist, promoCode) => {
	try {
		console.log(`Sending birthday promo code to ${tourist.email}`);

		sendNotificationToEmailAndSystem(
			"Happy Birthday Promo Code!",
			`Happy Birthday, ${tourist.name}!
        Here's your special birthday promo code:
        Code: ${promoCode._id}
        Discount: ${promoCode.discount}%
        Valid until: ${promoCode.expiresAt.toDateString()}`,
			tourist._id,
			"Tourist",
			promoCode._id,
			"PromoCode"
		);
	} catch (error) {
		console.error("Error sending birthday promo code email:", error);
	}
};

// Set up scheduled jobs
export const setupPromoCodeScheduledJobs = () => {
	// Create birthday promo codes daily at midnight
	cron.schedule("*/5 * * * *", async () => {
		await createBirthdayPromoCodes();
	});

	// Delete expired promo codes daily at 1 AM
	cron.schedule("0 1 * * *", async () => {
		await deleteExpiredOrMaxUsagePromoCodes();
	});
};
