const prisma  = require("../config/db");
const redis = require("../config/redis.js")
// const geminiQueue = require("../config/geminiQueue");
const geminiReply = require("../jobs/gemini.worker");

exports.createChatroom = async (req, res) => {
    const {name} = req.body;
    const userId = req.user.id;
    if(!name){
      return res.status(400).json({message:"Name is required"})
    } 
    try{
      const chatroom = await prisma.chatroom.create({
          data: {
            name,
            userId
          }
      })
      return res.status(201).json({message:"Chatroom created successfully", chatroom})
    }catch(error){
      return res.status(500).json({message:"Internal server error"})
    }
}

exports.getChatrooms = async (req, res) => {
    const userId = req.user.id;
    const cacheKey = `chatrooms:user:${userId}`;

    if(!userId){
      return res.status(400).json({message:"User id is required"})
    }
    try{
      const cachedChatrooms = await redis.get(cacheKey);

      if(cachedChatrooms){
        return res.status(200).json({message: "from cache", chatrooms: JSON.parse(cachedChatrooms)})
      }

      const chatrooms = await prisma.chatroom.findMany({
        where: {
          userId
        }
      })

      await redis.set(cacheKey, JSON.stringify(chatrooms), "EX", 60 * 60)
      return res.status(200).json({message: "not from cache",chatrooms})
    }catch(error){
      return res.status(500).json({message:"Internal server error"})
    }
}

exports.getChatroomById = async (req, res) => {
    const userId = parseInt(req.user.id);
    const chatroomId = parseInt(req.params.id);
    try{
      if(!chatroomId){
        return res.status(400).json({message:"Chatroom id is required"})
      }

      const chatroom = await prisma.chatroom.findFirst({
          where: {
            id: chatroomId,
            userId: userId
          }
      })

      if(!chatroom){
        return res.status(404).json({message:"Chatroom not found"})
      }

      return res.status(200).json(chatroom)
    }catch(error){
      return res.status(500).json({message:"Internal server error"})
    }
}

exports.sendMessage = async (req, res) => {
    const chatroomId = parseInt(req.params.id);
    const {content} = req.body;
    const userId = req.user.id;

    if(!content || !chatroomId){
      return res.status(400).json({message:"Content and chatroom id are required"})
    }
    try{
      const userMessage = await prisma.message.create({
          data: {
            content,
            chatroomId,
            sender: "user"
          }
      })
      //commnented as we not using queue on production
      // await geminiQueue.add("generateReply", {
      //   chatroomId,
      //   userMessageId: userMessage.id,
      //   prompt: content
      // })

      const reply = await geminiReply({
        chatroomId,
        userMessageId: userMessage.id,
        prompt: content
      });
      return res.status(201).json({message:"Message sent successfully", userMessage, reply})
    }catch(error){
      return res.status(500).json({message:"Internal server error"})
    }
}