// routes/cv.js
import express from 'express';

import { generateCV, getCV, updateCV,deleteCV } from '../controllers/cv.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// router.use(protectRoute);

router.post('/generate', generateCV);
router.get('/get-cv/:userId', getCV);
router.get('/get-cv/:userId', getCV);
router.put('/update/:id', protectRoute, updateCV);
router.delete('/delete/:id', protectRoute, deleteCV);


export default router;