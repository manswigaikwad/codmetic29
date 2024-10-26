import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";


// REGISTER USER
// route POST /api/v1/auth/register
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// LOGIN USER
// route POST /api/v1/auth/login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if user exists and passwords match
  if (user && await user.matchPassword(password)) {
    // Generate token and set it as a cookie
    generateToken(res, user._id);

    // Send a single JSON response with user data
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    // Return early on invalid login
    res.status(401).json({ message: "Invalid email or password" });
  }
});



// @desc Logout user
// route POST /api/v1/auth/logout
//@access Public

const logOut = asyncHandler(async (req, res) => {
  console.log('logout')
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logout out successfully' });
});

export { registerUser, loginUser, logOut };
