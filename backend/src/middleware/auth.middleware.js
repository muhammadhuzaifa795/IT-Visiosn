// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized - No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized - Invalid token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized - User not found" });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };






import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes by verifying JWT token.
 * It checks for token in cookies or Authorization header.
 * Attaches the authenticated user object (without password) to `req.user`.
 */
export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Unauthorized: Token expired. Please log in again." });
      }
      return res.status(401).json({ message: "Unauthorized: Token verification failed." });
    }

    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload (missing user ID)." });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User associated with token not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(500).json({ message: "Internal server error during authentication." });
  }
};