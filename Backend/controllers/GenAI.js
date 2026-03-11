import Feedback from "../models/Feedback.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export const generatePackingList = async (req, res) => {
  const { location, tripMonth, days } = req.body;
  const apiKey = process.env.GEMINI_API;
  if (!location || !tripMonth || !days) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if API key exists
    
    if (apiKey==null) {
      console.error("GEMINI_API environment variable is not set");
      return res.status(500).json({
        error: "API configuration error",
        output: "• Clothes\n• Toiletries\n• Phone charger\n• Documents\n• Medications",
      });
    }

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    res.json({ output });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      output: "• Clothes\n• Toiletries\n• Phone charger\n• Documents\n• Medications",
    });
  }
};