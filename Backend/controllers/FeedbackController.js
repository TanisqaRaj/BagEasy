import Feedback from "../models/Feedback.js";

export const saveFeedback = async (req, res) => {
  try {
    const { destination, month, experience } = req.body;

    if (!destination || !month || !experience) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const feedback = new Feedback({ destination, month, experience });
    await feedback.save();

    res.status(201).json({ message: "Feedback saved successfully!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Error saving feedback" });
  }
};

// Get all feedbacks (optional)
// export const getAllFeedback = async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//     res.json(feedbacks);
//   } catch (error) {
//     console.error("Error fetching feedbacks:", error);
//     res.status(500).json({ error: "Error fetching feedbacks" });
//   }
// };
