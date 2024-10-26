import express from "express";
import cron from "node-cron";
const app = express();
import dotenv from "dotenv";
import dbConnection from "./utils/db.js";
import sendDeliveredOrder from "./Emailservice/sendDeliveredOrder.js";
import sendPromotionEmail from "./Emailservice/sendPromotionemail.js";
import sendWelcomeEmail from "./Emailservice/sendWelcomeEmail.js";
import sendPendingOrderEmail from "./Emailservice/sendPendingOrderEmail.js";

dotenv.config();
const PORT = process.env.PORT;

const run = () => {
  cron.schedule("* * * * * *", async () => {
    sendDeliveredOrder();
    sendPromotionEmail();
    //sendWelcomeEmail();
    //sendPendingOrderEmail();
  });
};

run();

app.listen(PORT, () => {
  console.log(`Backgroundservice is running on port ${PORT}`);
  dbConnection();
});
