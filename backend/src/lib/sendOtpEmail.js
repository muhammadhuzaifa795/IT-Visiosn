import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: 465,
  secure: true, // true for 465 (SSL)
  auth: {
    user: process.env.SMTP_USER, // your gmail
    pass: process.env.SMTP_PASS, // app password
  },
});

export const sendOtpEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Use the following OTP to verify your account:</p>
          <p style="font-size: 24px; font-weight: bold;">${otp}</p>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });
    console.log("✅ OTP email sent:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Failed to send OTP:", err);
    return { success: false, error: err };
  }
};
