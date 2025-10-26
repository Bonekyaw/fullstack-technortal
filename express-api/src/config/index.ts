import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
};

export default config;
