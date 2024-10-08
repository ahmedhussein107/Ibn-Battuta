import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.WEBSITE_EMAIL,
    pass: process.env.WEBSITE_EMAIL_PASSWORD,
  },
});

/*
    How to use:
import { sendEmail } from "./utilities/emailUtils.js";
sendEmail("abdelrahim@gmail.com", "Testing", "this is me testing");
*/
export const sendEmail = async (toEmail, subject, body) => {
  try {
    const mailOptions = {
      from: process.env.WEBSITE_EMAIL,
      to: toEmail,
      subject: subject,
      text: body,
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("error sending email");
    throw err;
  }
};
