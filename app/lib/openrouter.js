import OpenAI from "openai";

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // optional
    "X-Title": "AI Interview Platform"
  }
});

export const MODEL = "openai/gpt-4o-mini"; 
// BEST model for your use case