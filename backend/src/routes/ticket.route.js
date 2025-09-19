import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js"
import { createTicket,getTickets,deleteTicket,getTicketById,addSolution } from "../controllers/ticket.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protectRoute)


router.post('/create-ticket',upload.single("attachments"),createTicket);
router.get("/tickets", getTickets);
router.delete("/tickets/:id", deleteTicket);
router.get("/tickets/:id", getTicketById);
router.post("/add-solution/:id", addSolution);
// router.post("/create-post", upload.single("attachments"), createPost);
// router.put("/update-post/:postId", upload.single("attachments"), updatePost);
// router.delete("/delete-post/:postId",  deletePost);
// router.post('/:postId/like', toggleLikePost);


export default router;