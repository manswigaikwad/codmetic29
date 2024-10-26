import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Order from "../models/order.model.js";
import crypto from "crypto"; // Moved import here for clarity

dotenv.config();

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Create an order for Razorpay
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, email, name, cart } = req.body;

    // Shipping charge in INR
    const shippingCharge = 10; // ₹10

    // Calculate total amount (product total + shipping) in INR and convert to paisa for Razorpay
    const totalAmount = (cart.total + shippingCharge) * 100; // Convert to paisa

    // Create Razorpay order
    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_order_${userId}`,
    };

    const order = await razorpay.orders.create(options);

    // Send order details back to the client
    res.send({
      orderId: order.id,
      amount: totalAmount, // Total amount in paisa
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY, // Razorpay key for frontend
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Payment success callback
router.post("/payment-success", async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId, email, cart } = req.body;

    // Verify the Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Save the order to the database
      const newOrder = new Order({
        userId,
        products: cart.products,
        total: cart.total,
        email,
        paymentId: razorpay_payment_id, // Store Razorpay payment ID
      });

      await newOrder.save();
      return res.status(200).send({ message: "Payment successful, order created!" });
    } else {
      return res.status(400).send({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error during payment processing:", error); // Log the error for debugging
    return res.status(500).send({ error: error.message });
  }
});

export default router;
