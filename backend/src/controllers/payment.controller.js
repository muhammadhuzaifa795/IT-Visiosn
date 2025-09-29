
import User from "../models/User.js";

export const fakePayAndActivate = async (req, res) => {
  try {
    const { plan } = req.body; 
    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({ message: "plan must be 'monthly' or 'yearly'" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const expiresAt = new Date(now);

    if (plan === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // update user
    user.subscription = plan;
    user.subscriptionActivatedAt = now;
    user.subscriptionExpiresAt = expiresAt;
    user.subscriptionProvider = "fake-pay";
    user.subscriptionHistory = user.subscriptionHistory || [];
    user.subscriptionHistory.push({
      plan,
      activatedAt: now,
      expiresAt,
      provider: "fake-pay",
      note: "Activated via fake payment endpoint",
    });

    await user.save();

    return res.json({
      message: "Payment simulated — subscription active",
      subscription: {
        plan: user.subscription,
        activatedAt: user.subscriptionActivatedAt,
        expiresAt: user.subscriptionExpiresAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.subscription = "free";
    user.subscriptionActivatedAt = null;
    user.subscriptionExpiresAt = null;
    user.subscriptionProvider = "manual-cancel";
    user.subscriptionHistory = user.subscriptionHistory || [];
    user.subscriptionHistory.push({
      plan: "free",
      activatedAt: new Date(),
      expiresAt: null,
      provider: "manual-cancel",
      note: "User cancelled subscription",
    });

    await user.save();
    return res.json({ message: "Subscription cancelled, downgraded to free" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// controllers/payment.controller.js
export const adminClearSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.subscription = "free";
    user.subscriptionActivatedAt = null;
    user.subscriptionExpiresAt = null;
    user.subscriptionProvider = "admin-reset";
    user.subscriptionHistory = user.subscriptionHistory || [];
    user.subscriptionHistory.push({
      plan: "free",
      activatedAt: new Date(),
      expiresAt: null,
      provider: "admin-reset",
      note: "Subscription cleared by admin",
    });

    await user.save();
    return res.json({ message: "Subscription cleared successfully", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
