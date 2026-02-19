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

// Example sending function remains the same
export const sendBanStatusEmail = async (to, isBanned, reason = "") => {
  try {
    const subject = isBanned ? "🚫 Account Banned" : "✅ Account Unbanned";
    const html = isBanned
      ? `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Account Has Been Banned</h2>
          <p>Unfortunately, your account has been banned by the admin.</p>
          <p><b>Reason:</b> ${reason}</p>
        </div>`
      : `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Account Has Been Unbanned</h2>
          <p>You can now login and use your account again.</p>
        </div>`;

    const info = await transporter.sendMail({
      from: `"MH Digital Edge" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Ban/Unban email sent:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Failed to send Ban/Unban email:", err);
    return { success: false, error: err };
  }
};
