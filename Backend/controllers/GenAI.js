import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export const generatePackingList = async (req, res) => {
  const { location, tripMonth, days } = req.body;

  if (!location || !tripMonth || !days) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
 You are a travel assistant. 
Only answer if the input is related to travel packing.
The user is traveling to ${location} in ${tripMonth} for ${days} days. 
Return only a plain list of packing item names with no explanations, no extra text, no headings, and no formatting. 
If the request is unrelated to travel, respond with: "Sorry, I can only assist with packing lists for travel.`;

  try {
    console.log("Prompt being sent to Gemini:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log("Generated Text:", text);

    res.json({ output: text });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    console.error(error);
    res.status(500).json({ error: "Failed to generate packing list." });
  }
};
