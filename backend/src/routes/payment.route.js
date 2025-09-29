import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js"
import { fakePayAndActivate, cancelSubscription,adminClearSubscription  } from "../controllers/payment.controller.js";

const router = express.Router();

router.use(protectRoute)


router.post('/subscribe',fakePayAndActivate)
router.post("/cancel-payment",cancelSubscription );
router.post("/admin/clear/:userId", adminClearSubscription);


export default router;