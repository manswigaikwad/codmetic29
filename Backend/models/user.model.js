import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Normalize email to lowercase
    },
    password: {
      type: String,
      required: true, // Fixed "require" to "required"
    },
    address: {
      type: String,
    },
    phone: {
      type: String, // Changed to String to handle different formats
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Use return here to avoid executing next() unnecessarily
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Call next() only after hashing
});

// Method to match passwords
userSchema.methods.matchPassword = async function (enteredPassword) { // Fixed typo "Pasword"
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);
export default User;
