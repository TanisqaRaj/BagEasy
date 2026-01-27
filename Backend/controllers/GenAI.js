import dotenv from "dotenv";
import Feedback from "../models/Feedback.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export const generatePackingList = async (req, res) => {
  const { location, tripMonth, days } = req.body;

  if (!location || !tripMonth || !days) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // ✅ 1. Fetch relevant user feedback
    const feedbacks = await Feedback.find({
      destination: { $regex: location, $options: "i" },
    }).limit(5);

    const feedbackSummary =
      feedbacks.length > 0
        ? feedbacks.map((f) => `• ${f.experience}`).join("\n")
        : "No user feedback available yet.";

    // ✅ 2. Create prompt for Gemini
    const prompt = `
You are a travel assistant.
Use the following real traveler feedback to create a smarter packing list.

Destination: ${location}
Month: ${tripMonth}
Trip Duration: ${days} days

Traveler feedback:
${feedbackSummary}

Now, generate a plain packing list (just item names, one per line).
If request is not travel-related, reply: "Sorry, I can only assist with travel packing lists."
`;

    // ✅ 3. Send prompt to Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ output: text });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Failed to generate packing list." });
  }
};
