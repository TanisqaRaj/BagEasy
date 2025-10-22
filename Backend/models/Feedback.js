import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  month: { type: String, required: true },
  experience: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);