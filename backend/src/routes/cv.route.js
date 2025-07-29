// // routes/cv.js
// import express from 'express';

// import { generateCV, getCV, updateCV,deleteCV } from '../controllers/cv.controller.js';
// import { protectRoute } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // router.use(protectRoute);

// router.post('/generate', generateCV);
// router.get('/get-cv/:userId', getCV);
// router.get('/get-cv/:userId', getCV);
// router.put('/update/:id', protectRoute, updateCV);
// router.delete('/delete/:id', protectRoute, deleteCV);


// export default router;



// routes/cv.js
import express from 'express';

import { generateCV, getCV, updateCV, deleteCV } from '../controllers/cv.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Agar har route ko protect karna hai, toh isko uncomment karein.
// Agar nahi, toh har individual route par protectRoute lagana hoga.
// Abhi ke liye, main isko commented hi rakh raha hoon jaisa tumne diya hai,
// aur individual routes par protectRoute laga hua hai jahan zaroorat hai.

router.post('/generate', protectRoute, generateCV); // generateCV ko bhi protect kar diya, kyunki isme userId check ho raha hai
router.get('/get-cv/:userId', getCV); // Ek hi baar kaafi hai
router.put('/update/:id', protectRoute, updateCV);
router.delete('/delete/:id', protectRoute, deleteCV);


export default router;