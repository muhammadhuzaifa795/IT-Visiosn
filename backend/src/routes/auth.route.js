// import express from "express";
// import { login, logout, onboard, signup, updateProfile, sendOTP, verifyOTPHandler, resetPassword, resendOtp } from "../controllers/auth.controller.js";
// import { protectRoute } from "../middleware/auth.middleware.js";


// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout);

// router.post("/onboarding", protectRoute, onboard);
// router.put("/update-profile", protectRoute, updateProfile);


// router.post("/send-otp", sendOTP);
// router.post("/rsend-otp", resendOtp);
// router.post("/verify-otp", verifyOTPHandler);
// router.post("/reset-password", resetPassword);

// // add 
// // router.get("/me", authenticateToken, getMe);


// router.get("/me", protectRoute, (req, res) => {
//   res.status(200).json({ success: true, user: req.user });
// });

// export default router;










// admin 


import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
  updateProfile,
  sendOTP,
  verifyOTPHandler,
  resetPassword,
  resendOtp
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js"; // ✅ NEW: Admin middleware import

const router = express.Router();

// 🔓 Public Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/send-otp", sendOTP);
router.post("/rsend-otp", resendOtp);
router.post("/verify-otp", verifyOTPHandler);
router.post("/reset-password", resetPassword);

// 🛡️ Protected Routes
router.post("/onboarding", protectRoute, onboard);
router.put("/update-profile", protectRoute, updateProfile);

// ✅ Get Current Authenticated User
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// ✅ (Don't use yet unless needed later)
router.get("/admin-data", protectRoute, isAdmin, (req, res) => {
  res.json({ message: "Admin only data" });
});

export default router;
