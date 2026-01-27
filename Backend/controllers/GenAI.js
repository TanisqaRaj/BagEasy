import Feedback from "../models/Feedback.js";
import dotenv from "dotenv";

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

    // Prompt
    const prompt = `
Create a packing list for a trip.

Destination: ${location}
Month: ${tripMonth}
Duration: ${days} days

Traveler feedback:
${feedbackSummary}

Return ONLY item names, one per line.
`;

    const response = await fetch(
      "https://router.huggingface.co/api/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      },
    );

    const result = await response.json();
    console.log("HF result:", result);

    if (result.error) {
      throw new Error(result.error);
    }

    const output = result[0]?.generated_text || "No response generated.";

    res.json({ output });
  } catch (error) {
    console.error("HF API error:", error.message);
    res.status(500).json({
      output: "• Clothes\n• Toiletries\n• Phone charger\n• Documents",
    });
  }
};
