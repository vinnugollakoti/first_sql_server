import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,            // REQUIRED on Render
  secure: false,        // MUST be false
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD, // Gmail APP PASSWORD
  },
  connectionTimeout: 10000,
})

transporter.verify((err: String) => {
    if (err) {
        console.log("Error : ", err)
    } else {
        console.log("SMTP READY")
    }
})

async function sendNotificationMail(email: String, title: String, message: String) {
    try {
        await transporter.sendMail({
            from: `"EEE Team" <${process.env.USER_MAIL}>`,
            to: email,
            subject: "Notification from HOD",
            html: `
                <h2>${title}</h2>
                <p><b>${message}</b></p>
                <p>Thanks for using ❤️ from EEE Department.</p
            `,
        })
    } catch (err) {
        console.log("Error : ", err)
        throw err;
    }
}

async function sendOtpMail(email: String, otp: String) {
    try {
        await transporter.sendMail({
            from: `"EEE Team" <${process.env.USER_MAIL}>`,
            to: email,
            subject: "Your OTP for EEE App Verification",
            html: `
                <h2>AutoForm OTP</h2>
                <p><b>${otp}</b></p>
                <p>Valid for 5 minutes.</p>
                <p>Thanks for using ❤️ from EEE Department.</p
            `,
        })
    } catch (err) {
        console.log("Error : ", err)
        throw err;
    }
}

module.exports = {
  sendOtpMail,
  sendNotificationMail,
};