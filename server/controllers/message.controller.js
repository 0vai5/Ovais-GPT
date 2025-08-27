import { streamGeminiResponse } from "../lib/geminiClient.js";

export const answerQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    await streamGeminiResponse(question, (chunk) => {
      res.write(chunk.text);
    });

    res.end();
  } catch (error) {
    console.log("Error Occurred", error);
  }
};
