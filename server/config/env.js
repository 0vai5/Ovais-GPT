import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

export default env;
