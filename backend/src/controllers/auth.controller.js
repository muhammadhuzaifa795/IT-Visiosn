import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendOtp } from '../lib/sendOtp.js'
import {generateOTP} from "../lib/generateOtp.js"
import { sendOtpEmail } from '../lib/sendOtpEmail.js';

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a different one" });
    }

    // Generate random avatar index 1-100
    const idx = Math.floor(Math.random() * 100) + 1;

    // Avatar URLs
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    // Note: You can use fallback avatar like:
    // const fallbackAvatar = `https://ui-avatars.com/api/?name=User${idx}`;

    // For now, save randomAvatar directly
    const avatarUrl = randomAvatar; // fallback logic can be applied client-side

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: avatarUrl,
    });

    // Create or update Stream user profile for chat
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    // Update Stream user profile after onboarding
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  const userId = req.user.id;

  try {
    const {
      fullName,
      email,
      bio,
      profilePic,
      nativeLanguage,
      location,
      dateOfBirth,
      phone,
      skills,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(bio && { bio }),
        ...(profilePic !== "" && { profilePic }),
        ...(nativeLanguage && { nativeLanguage }),
        ...(location && { location }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(phone && { phone }),
        ...(skills && { skills }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}




export const sendOtp = async (req, res) => {
  const { phone, email } = req.body;

  try {
    const user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    if (email) {
      await sendOtpEmail(email, otp);
    } else if (phone) {
      await sendOtp(phone,otp)
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to resend OTP', error: err.message });
  }
};

export const verifyOTPHandler = async (req, res) => {
  const { phone, email, otp } = req.body;

  try {
    const user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: 'OTP verified. You may now reset your password.' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { phone, email, newPassword } = req.body;

  try {
    const user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // 🔐 Make sure to hash password if not already
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Password change failed', error: err.message });
  }
};
