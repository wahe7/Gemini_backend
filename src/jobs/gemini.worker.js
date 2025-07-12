require("dotenv").config();
const { Worker } = require("bullmq");
const Redis = require("ioredis");
const prisma = require("../config/db");

const {generateReply} = require("../services/gemini.service");
const connection = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null,
});

// const worker = new Worker("gemini-message-queue", async (job) => {
//   try{
//     const { chatroomId, userMessageId, prompt } = job.data;
//     const geminiReply = await generateReply(prompt);

//     await prisma.message.create({
//         data: {
//             content: geminiReply,
//             chatroomId,
//             sender: "gemini",
//         },
//     });

//   }catch(error){
//     console.log(error);
//   }
// }, {
//     connection,
// });

const worker = async function geminiReply({chatroomId, userMessageId, prompt}) {
  try{
    console.log(prompt);
    const geminiReply = await generateReply(prompt);

    // Delay message creation by 4 seconds
    await new Promise(resolve => setTimeout(resolve, 1000));

    await prisma.message.create({
        data: {
            content: geminiReply,
            chatroomId,
            sender: "gemini",
        },
    });
    return geminiReply;
  }catch(error){
    console.log(error);
  }
};

module.exports = worker;

// worker.on("completed", (job) => {
//   console.log("Job completed", job.data);
// });

// worker.on("failed", (job) => {
//   console.log("Job failed", job.data);
// });