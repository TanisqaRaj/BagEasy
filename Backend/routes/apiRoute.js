import express from "express";
import { generatePackingList } from '../controllers/GenAI.js';
import { saveFeedback } from '../controllers/FeedbackController.js';
const router = express.Router();

router.get("/getsuggestion", generatePackingList);
router.post("/savefeedback", saveFeedback);
export default router;