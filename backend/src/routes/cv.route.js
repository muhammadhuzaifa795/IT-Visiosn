

// routes/cv.js
import express from 'express';

import { generateCV, getCV, updateCV, deleteCV } from '../controllers/cv.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import checkSubscription  from "../middleware/checkSubscription.middleware.js";

const router = express.Router();



router.post('/generate',checkSubscription, protectRoute, generateCV); // generateCV ko bhi protect kar diya, kyunki isme userId check ho raha hai
router.get('/get-cv/:userId', getCV); // Ek hi baar kaafi hai
router.put('/update/:id', protectRoute, updateCV);
router.delete('/delete/:id', protectRoute, deleteCV);



export default router;