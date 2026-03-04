import Feedback from "../models/Feedback.js";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

export const generatePackingList = async (req, res) => {
  const { location, tripMonth, days } = req.body;

  if (!location || !tripMonth || !days) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const feedbacks = await Feedback.find({
      destination: { $regex: location, $options: "i" },
    }).limit(5);

    const feedbackSummary =
      feedbacks.length > 0
        ? feedbacks.map((f) => `- ${f.experience}`).join("\n")
        : "No traveler feedback available.";

    const prompt = `
Create a packing list for a trip.

Destination: ${location}
Month: ${tripMonth}
Duration: ${days} days

Traveler feedback:
${feedbackSummary}

Return ONLY item names, one per line.
`;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API,
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const output = response.text;

    res.json({ output });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      output: "• Clothes\n• Toiletries\n• Phone charger\n• Documents\n• Medications",
    });
  }
};