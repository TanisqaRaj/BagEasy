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

    // Initialize Gemini API
    const genAI = new GoogleGenAI(process.env.GEMINI_API);
    
    // Generate content
    const result = await genAI.models.generateContent({
      model: "gemini-pro",
      prompt: prompt,
    });

    const output = result.text || result.candidates?.[0]?.content || "• Clothes\n• Toiletries\n• Phone charger\n• Documents";

    res.json({ output });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      output: "• Clothes\n• Toiletries\n• Phone charger\n• Documents\n• Medications",
    });
  }
};