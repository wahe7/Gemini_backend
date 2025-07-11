const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/me",verifyToken, getUser);

module.exports = router;
