import express from "express";
import {
  completeProfile
} from "../controllers/user.controller";
import { upload } from "../utils/multerStorage";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = express.Router();

router.post(
  "/complete-profile",
  authenticateJWT,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  completeProfile
);


export default router;
