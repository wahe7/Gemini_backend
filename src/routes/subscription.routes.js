const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const stripeController = require("../controllers/stripe.controller");

router.post("/pro", verifyToken, stripeController.createCheckoutSession); 
module.exports = router;
