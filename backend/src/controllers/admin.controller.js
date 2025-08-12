




import User from "../models/User.js";
import bcrypt from "bcrypt";

// ✅ Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Create a new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    // Validate input
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Return user without password
    const userResponse = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({ success: true, user: userResponse, message: "User created successfully" });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};