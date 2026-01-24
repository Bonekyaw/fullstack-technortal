import { Queue } from "bullmq";

const ImageQueue = new Queue("imageQueue", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    // password: process.env.REDIS_PASSWORD,
    // maxRetriesPerRequest: null, // for bullMQ
  },
});

export default ImageQueue;
