import Feedback from "../models/Feedback.js";
import dotenv from "dotenv";
import fetch from "node-fetch"; 

dotenv.config();

export const generatePackingList = async (req, res) => {
  const { location, tripMonth, days } = req.body;

  if (!location || !tripMonth || !days) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Fetch feedback from database
    const feedbacks = await Feedback.find({
      destination: { $regex: location, $options: "i" },
    }).limit(5);

    const feedbackSummary =
      feedbacks.length > 0
        ? feedbacks.map((f) => `- ${f.experience}`).join("\n")
        : "No traveler feedback available.";

    // Create prompt
    const prompt = `
Create a packing list for a trip.

Destination: ${location}
Month: ${tripMonth}
Duration: ${days} days

Traveler feedback:
${feedbackSummary}

Return ONLY item names, one per line.
`;

    // Call Hugging Face Router API
    const response = await fetch("https://router.huggingface.co/models/google/flan-t5-base", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { use_cache: false }, // optional
      }),
    });

    const result = await response.json();
    console.log("HF API Response:", JSON.stringify(result));

    let output;
    if (Array.isArray(result) && result.length > 0) {
      output = result[0].generated_text;
    } else if (result.generated_text) {
      output = result.generated_text;
    } else if (result.error) {
      console.error("HF API Error:", result.error);
      output = "• Clothes\n• Toiletries\n• Phone charger\n• Documents\n• Medications";
    } else {
      output = "• Clothes\n• Toiletries\n• Phone charger\n• Documents\n• Medications";
    }

    res.json({ output });

  } catch (error) {
    console.error("HF API error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      output: "• Clothes\n• Toiletries\n• Phone charger\n• Documents",
    });
  }
};
