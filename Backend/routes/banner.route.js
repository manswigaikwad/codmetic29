import express from "express";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getRandomBanner,
} from "../controllers/banner.controller.js";
const router = express.Router();

// CREATE BANNER ROUTE
router.post("/", createBanner);

//GET ALL BANNERs ROUTE
router.get("/", getAllBanners);

//DELETE BANNERS ROUTE
router.delete("/:id", deleteBanner);

//GET RANDOM BANNER
router.get("/random", getRandomBanner);

export default router;
