import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { addComment, getCommentsByPost, toggleCommentLike } from "../controllers/comment.controller.js"

const router = express.Router()

router.use(protectRoute)

router.post('/add-comments/:postId', addComment)
router.get('/get-comments/:postId', getCommentsByPost)
router.put("/like-comment/:postid/:commentid", toggleCommentLike);

export default router;