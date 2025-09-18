// lib/sendOtpEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // ✅ fixed variable

export const sendOtpEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>', // ✅ works only in sandbox with verified emails
      to: [email],
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p style="font-size: 18px;">Use the code below to complete your verification:</p>
          <p style="font-size: 24px; font-weight: bold; color: #4F46E5;">${otp}</p>
          <p style="color: #6B7280;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(error.message);
    }

    console.log(`✅ OTP sent to ${email}`, data);
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err);
    throw err;
  }
};
