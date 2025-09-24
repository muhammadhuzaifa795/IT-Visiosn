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
          setLiked(matchedPost.likes?.includes("currentUserId")); // Replace with real userId
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-4"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Post not found
      </div>
    );
  }

  const attachment = post.attachments?.url || "";
  const isVideo = attachment.match(/\.(mp4|webm|ogg)$/i);
  const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium underline hover:no-underline transition-all duration-200"
        aria-label="Go back to previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <article className="rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 transition-all duration-300">
        {/* Attachment */}
        <div className="w-full flex justify-center items-center">
          {attachment && isImage && (
            <img
              src={attachment}
              alt={post.title || "Post attachment"}
              className="rounded-xl object-contain max-h-[600px] w-full transition-transform duration-300 hover:scale-[1.02]"
              loading="lazy"
            />
          )}
          {attachment && isVideo && (
            <video
              controls
              className="rounded-xl w-full max-h-[600px]"
              aria-label="Post video"
            >
              <source src={attachment} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {!attachment && (
            <div className="text-center italic py-12 rounded-xl border">
              No attachment available
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {post.title}
          </h1>
          <p className="text-base leading-relaxed">
            {post.description}
          </p>

          <div className="relative text-sm leading-relaxed">
            <p
              className={`transition-all duration-300 ${
                showFullDesc ? "" : "line-clamp-4"
              }`}
              id="post-description"
            >
              {post.longDesc}
            </p>
            {post.longDesc?.length > 250 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-sm font-medium mt-2 underline hover:no-underline transition-all duration-200"
                aria-expanded={showFullDesc}
                aria-controls="post-description"
              >
                {showFullDesc ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleLikeToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border hover:shadow-sm"
              aria-label={liked ? "Unlike post" : "Like post"}
            >
              {liked ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              {liked ? "Liked" : "Like"}
            </button>
            <span className="text-sm">
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
          </div>

          {/* Comments Section */}
          <section className="pt-6">
            <h2 className="text-lg font-semibold mb-4">
              Comments
            </h2>
            <PostComments
              postId={post._id}
              comments={comments}
              setComments={setComments}
              socket={socket}
            />
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t text-xs flex flex-col sm:flex-row justify-between gap-2">
            <span>Posted by {post.author?.fullName || "Unknown"}</span>
            <span>{new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;