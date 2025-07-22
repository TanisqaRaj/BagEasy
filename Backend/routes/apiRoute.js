import express from "express";
import { generatePackingList } from '../controllers/GenAI.js';
const router = express.Router();

router.post("/getsuggestion", generatePackingList);

export default router;
