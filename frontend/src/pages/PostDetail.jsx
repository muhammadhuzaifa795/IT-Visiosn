import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAllPosts, togglePostLike } from "../lib/api";
import PostComments from "../components/PostComments";
import socket from "../socket";
import {
  ArrowLeftIcon,
  HeartIcon,
  HeartOffIcon,
  CalendarIcon,
  UserIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  EyeIcon,
  ClockIcon,
} from "lucide-react";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [viewCount, setViewCount] = useState(0);

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
          setViewCount(matchedPost.views || Math.floor(Math.random() * 100) + 50); // Mock view count
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
      
      // Add subtle animation effect
      const likeBtn = document.querySelector('.like-button');
      if (likeBtn) {
        likeBtn.classList.add('animate-pulse');
        setTimeout(() => likeBtn.classList.remove('animate-pulse'), 300);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-base-content/60">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 px-4 text-center">
        <div className="bg-base-100 rounded-2xl p-8 max-w-md shadow-lg">
          <FileIcon className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">Post Not Found</h2>
          <p className="text-base-content/60 mb-6">The post you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const attachment = post.attachments?.url || "";
  const isVideo = attachment.match(/\.(mp4|webm|ogg)$/i);
  const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const hasAttachment = !!attachment;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Navigation */}
      <div className="bg-base-100 border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm flex items-center gap-2 hover:bg-base-200 transition-colors"
              aria-label="Go back to previous page"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
            
            <div className="flex items-center gap-4 text-sm text-base-content/60">
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                <span>{viewCount} views</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{Math.ceil((post.longDesc?.length || 0) / 200)} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-base-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Attachment Section */}
          {hasAttachment && (
            <div className="relative bg-base-300">
              <div className="absolute top-4 left-4 z-10">
                <div className="badge badge-primary badge-lg shadow-md">
                  {isImage ? <ImageIcon className="w-3 h-3 mr-1" /> : 
                   isVideo ? <VideoIcon className="w-3 h-3 mr-1" /> : 
                   <FileIcon className="w-3 h-3 mr-1" />}
                  {isImage ? "Image" : isVideo ? "Video" : "File"}
                </div>
              </div>
              
              <div className="flex justify-center items-center min-h-96 max-h-[600px] p-4">
                {isImage && (
                  <img
                    src={attachment}
                    alt={post.title || "Post attachment"}
                    className="rounded-lg object-contain max-h-full w-auto max-w-full transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                )}
                {isVideo && (
                  <video
                    controls
                    className="rounded-lg w-full max-h-full"
                    aria-label="Post video"
                    poster={post.attachments?.thumbnail}
                  >
                    <source src={attachment} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {!isImage && !isVideo && (
                  <div className="text-center p-8">
                    <FileIcon className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
                    <a
                      href={attachment}
                      download
                      className="btn btn-primary"
                      aria-label="Download attachment"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Post Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium">{post.author?.fullName || "Unknown Author"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-base-content">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-lg text-base-content/80 leading-relaxed border-l-4 border-primary pl-4 py-1">
                  {post.description}
                </p>
              )}
            </header>

            {/* Long Description */}
            {post.longDesc && (
              <div className="prose prose-lg max-w-none">
                <div className="relative">
                  <div
                    className={`text-base-content/80 leading-relaxed transition-all duration-300 ${
                      showFullDesc ? "" : "max-h-32 overflow-hidden"
                    }`}
                    id="post-description"
                  >
                    {post.longDesc.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {post.longDesc.length > 250 && (
                    <div className={`pt-2 ${showFullDesc ? '' : 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-100 to-transparent h-16'}`}>
                      <button
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        className="btn btn-ghost btn-sm text-primary hover:text-primary-focus transition-colors"
                        aria-expanded={showFullDesc}
                        aria-controls="post-description"
                      >
                        {showFullDesc ? "Show less" : "Read more"}
                        <svg 
                          className={`w-4 h-4 transition-transform duration-300 ${showFullDesc ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-base-300">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLikeToggle}
                  className={`like-button flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    liked 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-base-200 text-base-content/70 border border-base-300 hover:border-primary/30'
                  }`}
                  aria-label={liked ? "Unlike post" : "Like post"}
                >
                  {liked ? (
                    <HeartOffIcon className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>{liked ? "Liked" : "Like"}</span>
                  {likeCount > 0 && (
                    <span className="bg-primary text-primary-content rounded-full px-2 py-1 text-xs min-w-[1.5rem]">
                      {likeCount}
                    </span>
                  )}
                </button>
                
                <div className="text-sm text-base-content/60">
                  {likeCount} {likeCount === 1 ? "like" : "likes"}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <EyeIcon className="w-4 h-4" />
                <span>{viewCount} views</span>
              </div>
            </div>

            {/* Comments Section */}
            <section className="pt-6 border-t border-base-300">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-semibold">Comments</h2>
                {comments.length > 0 && (
                  <span className="badge badge-primary badge-sm">
                    {comments.length}
                  </span>
                )}
              </div>
              
              <PostComments
                postId={post._id}
                comments={comments}
                setComments={setComments}
                socket={socket}
              />
            </section>

            {/* Footer */}
            <footer className="pt-6 border-t border-base-300 text-sm text-base-content/60">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span>Posted by {post.author?.fullName || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;