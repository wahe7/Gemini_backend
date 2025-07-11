const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { sendOtp, verifyOtp, signUp, forgotPassword, changePassword } = require("../controllers/auth.controller");

router.post("/signup", signUp);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/change-password",verifyToken, changePassword);

module.exports = router;