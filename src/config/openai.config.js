import dotenv from 'dotenv';
dotenv.config();

export const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
  models: {
    embedding: "text-embedding-ada-002",
    completion: "gpt-3.5-turbo"
  },
  maxRetries: 3,
  timeout: 30000
};
