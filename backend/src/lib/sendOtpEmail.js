import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
