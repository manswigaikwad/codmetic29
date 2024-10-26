import Banner from "../models/banner.model.js";
import asyncHandler from "express-async-handler";

// CREATE ORDER
const createBanner = asyncHandler(async (req, res) => {
  const newBanner = Banner(req.body);
  const savedBanner = await newBanner.save();
  if (!savedBanner) {
    res.status(400);
    throw new Error("Banner was not created");
  } else {
    res.status(200).json(savedBanner);
  }
});


//DELETE BANNER
const deleteBanner = asyncHandler(async (req,res) => {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (banner) {
      res.status(400);
      throw new Error("Banner was not deleted");
    } else {
      res.status(200).json("Banner is deleted successfully");
    }
  });
  
  // GET ALL Banners
const getAllBanners = asyncHandler(async (req, res) => {
    const banners = await (await Banner.find()).reverse();
    if (!banners) {
      res.status(400);
      throw new Error("No orders found");
    } else {
      res.status(200).json(banners);
    }
  });
 // GET RANDOM BANNER
const getRandomBanner = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  if (!banners || banners.length === 0) {
    res.status(400);
    throw new Error("No banners found");
  } else {
    const randomIndex = Math.floor(Math.random() * banners.length);
    const randomBanner = banners[randomIndex];
    res.status(200).json(randomBanner);
  }
});

export { getAllBanners, createBanner, deleteBanner, getRandomBanner };