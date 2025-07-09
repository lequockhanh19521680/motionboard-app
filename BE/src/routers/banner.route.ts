import { Router } from "express";
import * as bannerController from "../controllers/banner.controller";

const router = Router();

router.get("/", bannerController.getAllBanners);
router.get("/:banner_id", bannerController.getBannerById);
router.post("/", bannerController.createBanner);
router.put("/:banner_id", bannerController.updateBanner);
router.delete("/:banner_id", bannerController.deleteBanner);

export default router;
