
import express from 'express';
import multer from 'multer';
import { addFace, loginWithFace } from '../controllers/face-auth.controller.js';
import checkSubscription  from "../middleware/checkSubscription.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add-face',checkSubscription, upload.single('face'), addFace);
router.post('/login-with-face', upload.single('face'), loginWithFace);

export default router;