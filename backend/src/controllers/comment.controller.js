import Comment from "../models/Comments.js";
import Post from "../models/Post.js";

export async function addComment(req, res) {
    try {
        const { postId } = req.params
        const userId = req.user?.id
        const { parentId, text } = req.body

        const postExists = await Post.findById(postId);
        if (!postExists) return res.status(404).json({ message: "Post not found" });

        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) return res.status(404).json({ message: "Parent comment not found" });
        }

        const comment = new Comment({
            post: postId,
            user: userId,
            text,
            parent: parentId || null,
        })

        await comment.save()

        res.status(201).json({ message: "Comment added", comment });


    } catch (error) {
        console.error("Add comment/reply error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .populate("user", "fullName")
      .lean();


    const commentMap = {};
    comments.forEach(c => {
      c.replies = [];
      commentMap[c._id.toString()] = c;
    });

    const rootComments = [];

    comments.forEach(c => {
      if (c.parent) {
        const parent = commentMap[c.parent.toString()];
        if (parent) parent.replies.push(c);
      } else {
        rootComments.push(c);
      }
    });

    res.status(200).json(rootComments);
  } catch (err) {
    console.error("Get threaded comments error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const toggleCommentLike = async (req, res) => {
  const { commentid } = req.params;
  const userId = req.user._id; // Ensure user is authenticated

  try {
    const comment = await Comment.findById(commentid);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      message: hasLiked ? "Unliked comment" : "Liked comment",
      likes: comment.likes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};