import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";

const genAI = new GoogleGenAI(env.GEMINI_API_KEY);

export async function streamGeminiResponse(prompt, chunkFunc) {
  const response = await genAI.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  for await (const chunk of response) {
    chunkFunc(chunk);
  }
}
