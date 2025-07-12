const { Queue } = require("bullmq");
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL);
const geminiQueue = new Queue("gemini-message-queue", {
    connection,
});

module.exports = geminiQueue;
