const express = require("express");
const router = express.Router();
const { getUser, getUserSubscription } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/me",verifyToken, getUser);
router.get("/subscription",verifyToken, getUserSubscription);

module.exports = router;
