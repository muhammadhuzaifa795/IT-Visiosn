export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user info" });
    }

    if (req.user.role === "guest") {
      return res.status(403).json({ message: "Forbidden - Guest access denied" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    // ✅ Passed all checks
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
