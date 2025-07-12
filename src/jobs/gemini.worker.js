require("dotenv").config();
const { Worker } = require("bullmq");
const Redis = require("ioredis");
const prisma = require("../config/db");

const {generateReply} = require("../services/gemini.service");
const connection = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null,
});

const worker = new Worker("gemini-message-queue", async (job) => {
  try{
    const { chatroomId, userMessageId, prompt } = job.data;
    const geminiReply = await generateReply(prompt);

    await prisma.message.create({
        data: {
            content: geminiReply,
            chatroomId,
            sender: "gemini",
        },
    });

  }catch(error){
    console.log(error);
  }
}, {
    connection,
});

worker.on("completed", (job) => {
  console.log("Job completed", job.data);
});

worker.on("failed", (job) => {
  console.log("Job failed", job.data);
});