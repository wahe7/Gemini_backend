const express = require("express");
const router = express.Router();
const {createChatroom, getChatrooms, getChatroomById, sendMessage} = require("../controllers/chatroom.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, createChatroom); 
router.get("/", verifyToken, getChatrooms); 
router.get("/:id", verifyToken, getChatroomById); 
router.post("/:id/message", verifyToken, sendMessage);
module.exports = router;
