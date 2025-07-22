import express from 'express';
import {checkTokenExpiry, loginUser, registerUser} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
// import auth from "./middleware/auth.js";
const router = express.Router();
router.post('/register/user', registerUser);
router.post('/login', loginUser);
router.post('/token-verification', verifyToken);
router.post('/token-expiry', checkTokenExpiry);

export default router;