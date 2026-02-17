import dotenv from "dotenv";
dotenv.config();

const MAIL_API =
  "https://7feej0sxm3.execute-api.eu-north-1.amazonaws.com/default/mail_sender";

async function sendMail(to: string, subject: string, html: string) {
  try {
    const response = await fetch(MAIL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        config: {
          email: process.env.USER_MAIL,
          pass: process.env.USER_PASSWORD,
          from: `'EEE Team' <${process.env.USER_MAIL}>`,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    return await response.json();
  } catch (err) {
    console.log("Mail Error:", err);
    throw err;
  }
}

export async function sendNotificationMail(
  email: string,
  title: string,
  message: string
) {
  return sendMail(
    email,
    "Notification from HOD",
    `
      <h2>${title}</h2>
      <p><b>${message}</b></p>
      <p>Thanks for using ❤️ from EEE Department.</p>
    `
  );
}

export async function sendOtpMail(email: string, otp: string) {
  return sendMail(
    email,
    "Your OTP for EEE App Verification",
    `
      <h2>AutoForm OTP</h2>
      <p><b>${otp}</b></p>
      <p>Valid for 5 minutes.</p>
      <p>Thanks for using ❤️ from EEE Department.</p>
    `
  );
}


module.exports = {
  sendOtpMail,
  sendNotificationMail,
};