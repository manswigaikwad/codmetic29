import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token exists in cookies
  token = req.cookies.jwt;

  if (!token) {
    // No token found in cookies
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SEC);

    // Fetch the user by ID, excluding password
    req.user = await User.findById(decoded.userId).select("-password");

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle JWT verification errors (invalid token, expired, etc.)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    res.status(401).json({ message: "Not authorized, invalid token" });
  }
});

export { protect };
