
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAllPosts, togglePostLike } from "../lib/api";
import PostComments from "../components/PostComments";
import socket from "../socket";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getAllPosts();
        const matchedPost = posts.find((p) => p._id === id);
        if (matchedPost) {
          setPost(matchedPost);
          setLikeCount(matchedPost.likes?.length || 0);
          setLiked(matchedPost.likes?.includes("currentUserId")); // Replace this with real userId
          setComments(matchedPost.comments || []);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Setup sockets
  useEffect(() => {
    socket.emit("join_post", id);

    socket.on("new_comment", (newComment) => {
      setComments((prev) => [...prev, newComment]);
    });

    socket.on("new_reply", ({ commentId, reply }) => {
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        )
      );
    });

    socket.on("like_updated", ({ commentId, likes }) => {
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, likes } : c
        )
      );
    });

    return () => {
      socket.emit("leave_post", id);
      socket.off("new_comment");
      socket.off("new_reply");
      socket.off("like_updated");
    };
  }, [id]);

  const handleLikeToggle = async () => {
    try {
      await togglePostLike(post._id);
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading post...</div>;
  if (!post) return <div className="text-center py-10 text-lg">Post not found</div>;

  const attachment = post.attachments?.url || "";
  const isVideo = attachment.match(/\.(mp4|webm|ogg)$/i);
  const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-sm text-blue-600 hover:underline">
        ← Go Back
      </button>

      <div className="w-full p-6 rounded-xl shadow-2xl space-y-8 transition-all duration-500">
        {/* Attachment */}
        <div className="w-full flex justify-center items-center">
          {attachment && isImage && (
            <img src={attachment} alt="Attachment" className="rounded-xl object-contain max-h-[500px] w-full" />
          )}
          {attachment && isVideo && (
            <video controls className="rounded-xl w-full max-h-[500px]">
              <source src={attachment} type="video/mp4" />
            </video>
          )}
          {!attachment && (
            <div className="text-gray-400 text-center italic py-12">
              No attachment available for this post.
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold dark:text-white">{post.title}</h1>
          <p className="text-gray-700 text-base">{post.description}</p>

          <div className="relative text-sm text-gray-600 dark:text-gray-400">
            <p className={`${showFullDesc ? "" : "line-clamp-5"} transition-all duration-300`}>
              {post.longDesc}
            </p>
            {post.longDesc?.length > 300 && (
              <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-500 text-sm mt-1 hover:underline">
                {showFullDesc ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Like Button */}
          <div className="flex items-center gap-2 pt-4">
            <button
              onClick={handleLikeToggle}
              className={`px-4 py-2 rounded-lg transition duration-200 ${liked
                ? "bg-red-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
            >
              {liked ? "❤️ Liked" : "🤍 Like"}
            </button>
            <span className="text-gray-600 text-sm">{likeCount} likes</span>
          </div>

          {/* 💬 Comments Section */}
          <PostComments
            postId={post._id}
            comments={comments}
            setComments={setComments}
            socket={socket}
          />

          {/* Footer */}
          <div className="pt-4 border-t text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Author: {post.author?.fullName || "Unknown"}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

