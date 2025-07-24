import express from "express";
import { login, logout, onboard, signup, updateProfile, sendOTP, verifyOTPHandler, resetPassword, resendOtp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);
router.put("/update-profile", protectRoute, updateProfile);


router.post("/send-otp", sendOTP);
router.post("/rsend-otp", resendOtp);
router.post("/verify-otp", verifyOTPHandler);
router.post("/reset-password", resetPassword);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
