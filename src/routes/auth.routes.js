const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, signUp, forgotPassword } = require("../controllers/auth.controller");

router.post("/signup", signUp);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);

module.exports = router;