import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (res, userId) => {
  // Check if the JWT secret exists
  if (!process.env.JWT_SEC) {
    throw new Error("Missing JWT Secret in environment variables");
  }

  // Generate the JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SEC, {
    expiresIn: "30d",  // Token expiration time (30 days)
  });

  // Set the cookie options
  res.cookie("jwt", token, {
    httpOnly: true,  // Prevent access from JavaScript (security best practice)
    secure: process.env.NODE_ENV !== "development",  // Use HTTPS in production
    sameSite: "strict",  // CSRF protection (Strict for preventing cross-site requests)
    maxAge: 30 * 24 * 60 * 60 * 1000,  // Cookie valid for 30 days (in milliseconds)
  });

  // Optional: Remove this line if response is handled elsewhere
  // res.status(200).json({ message: "Token generated and set in cookie" });
};

export default generateToken;
