import  express from "express";
import { google, sendOtp, sendOtp1, signin, signup, verifyOtp, verifyOtp1 } from "../controllers/authController.js";

const router=express.Router();
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.post('/google',google);
router.post('/send-otp',sendOtp);
router.post('/send-otp1',sendOtp1);

router.post('/verify-otp',verifyOtp);
router.post('/verify-otp1',verifyOtp1);

export default router;
