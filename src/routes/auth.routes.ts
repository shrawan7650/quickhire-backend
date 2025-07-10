import express from "express";
import {
  manualSignup,
  googleLoginOrSignup,
  login,
} from "../controllers/auth.controller";


const router = express.Router();

router.post("/signup", manualSignup);
router.post("/google-oauth", googleLoginOrSignup);

router.post("/login", login);
export default router;
