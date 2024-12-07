import nodemailer from "nodemailer";
import { WEBSITE_EMAIL, WEBSITE_EMAIL_PASSWORD } from "../config/config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: WEBSITE_EMAIL,
        pass: WEBSITE_EMAIL_PASSWORD,
    },
});

/*
    How to use:
import { sendEmail } from "./utilities/emailUtils.js";
sendEmail("abdelrahim@gmail.com", "Testing", "this is me testing");
*/
const sendEmail = async (toEmail, subject, body, type = "text") => {
    if (toEmail) {
        try {
            const mailOptions = {
                from: WEBSITE_EMAIL,
                to: toEmail,
                subject: subject,
                text: body,
            };
            if (type === "html") {
                mailOptions.html = body;
                delete mailOptions.text;
            }
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.log("error sending email", err);
        }
    }
};
export default sendEmail;
