import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
dotenv.config();

const sendPromotionEmail = async () => {

  const users = await User.find();
  const products = await Product.aggregate([
    { $sample: { size: 5 } }, // Select 5 random products
  ]);
  
  if (products.length > 0) {
    for (let user of users) {
      ejs.renderFile(
        "templates/promotion.ejs",
        { products },
        async (err, data) => {

          
          let messageoption = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Products for the month.",
            html: data,
          };

          try {
            sendMail(messageoption);
          } catch (error) {
            console.log(err);
          }
        }
      );
    }
  }
};

export default sendPromotionEmail;
