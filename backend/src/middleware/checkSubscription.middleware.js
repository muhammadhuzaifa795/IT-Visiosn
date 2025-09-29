
export default function checkSubscription(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "User missing" });

    const now = new Date();
    if (
      (user.subscription === "monthly" || user.subscription === "yearly") &&
      user.subscriptionExpiresAt &&
      new Date(user.subscriptionExpiresAt) > now
    ) {
      return next();
    }

    return res.status(403).json({
      message: "Active subscription required (monthly/yearly).",
      subscription: user.subscription,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
