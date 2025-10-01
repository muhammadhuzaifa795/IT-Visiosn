import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAllPosts, togglePostLike } from "../lib/api";
import PostComments from "../components/PostComments";
import socket from "../socket";
import ReactMarkdown from "react-markdown";
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
  Maximize2Icon,
  Minimize2Icon,
  BookOpenIcon,
  Share2Icon,
  BookmarkIcon,
  MessageCircleIcon,
} from "lucide-react";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
          setViewCount(matchedPost.views || Math.floor(Math.random() * 100) + 50);
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
      
      const likeBtn = document.querySelector('.like-button');
      if (likeBtn) {
        likeBtn.classList.add('animate-pulse');
        setTimeout(() => likeBtn.classList.remove('animate-pulse'), 300);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add to bookmarks logic here
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-base-content/60 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 px-4 text-center">
        <div className="bg-base-100 rounded-3xl p-8 max-w-md shadow-2xl border border-base-300/50">
          <FileIcon className="w-20 h-20 text-base-content/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">Post Not Found</h2>
          <p className="text-base-content/60 mb-6">The post you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary w-full gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
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
  const readTime = calculateReadTime(post.longDesc);

  // Full Screen Modal Component
  const FullScreenModal = () => (
    <div className="fixed inset-0 z-50 bg-base-100 flex flex-col">
      {/* Modal Header */}
      <div className="border-b border-base-300/50 bg-base-100/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFullModal(false)}
              className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 transition-all"
            >
              <Minimize2Icon className="w-4 h-4" />
              Exit Fullscreen
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm text-base-content/60">
                {/* <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{viewCount}</span>
                </div> */}
                <div className="flex items-center gap-1">
                  <BookOpenIcon className="w-4 h-4" />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Post Header */}
          <header className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="badge badge-primary badge-lg gap-2">
                  <UserIcon className="w-3 h-3" />
                  {post.author?.fullName || "Unknown Author"}
                </div>
                <div className="badge badge-outline badge-lg gap-2">
                  <CalendarIcon className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="badge badge-outline badge-lg gap-2">
                  <ClockIcon className="w-3 h-3" />
                  {readTime} min read
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-base-content leading-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-xl text-base-content/70 leading-relaxed max-w-3xl mx-auto">
                {post.description}
              </p>
            )}
          </header>

          {/* Attachment in Modal */}
          {hasAttachment && (
            <div className="mb-12 rounded-2xl overflow-hidden bg-base-300/50 p-4">
              <div className="flex justify-center items-center min-h-96">
                {isImage && (
                  <img
                    src={attachment}
                    alt={post.title || "Post attachment"}
                    className="rounded-xl object-contain max-h-full w-auto max-w-full shadow-2xl"
                  />
                )}
                {isVideo && (
                  <video
                    controls
                    className="rounded-xl w-full max-w-4xl"
                    aria-label="Post video"
                    poster={post.attachments?.thumbnail}
                  >
                    <source src={attachment} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Long Description in Modal */}
          {post.longDesc && (
            <div className="prose prose-lg md:prose-xl max-w-none">
              <div className="bg-base-100 rounded-3xl p-8 md:p-12 border border-base-300/50 shadow-sm">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-8 mb-4 text-base-content border-b border-base-300 pb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-6 mb-3 text-base-content" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-2xl font-semibold mt-5 mb-2 text-base-content" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-xl font-semibold mt-4 mb-2 text-base-content" {...props} />,
                    p: ({node, ...props}) => <p className="mb-6 text-base-content/80 leading-relaxed text-lg" {...props} />,
                    ul: ({node, ...props}) => <ul className="mb-6 list-disc list-inside space-y-2 text-base-content/80" {...props} />,
                    ol: ({node, ...props}) => <ol className="mb-6 list-decimal list-inside space-y-2 text-base-content/80" {...props} />,
                    li: ({node, ...props}) => <li className="text-base-content/80 leading-relaxed" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-base-content/70 bg-base-200/50 py-2 rounded-r-lg" {...props} />,
                    code: ({node, ...props}) => <code className="bg-base-300 px-2 py-1 rounded text-sm font-mono text-base-content/90" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-base-300 p-4 rounded-lg my-6 overflow-x-auto" {...props} />,
                  }}
                >
                  {post.longDesc}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Full Screen Modal */}
      {showFullModal && <FullScreenModal />}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        {/* Header Navigation */}
        <div className="bg-base-100/80 backdrop-blur-sm border-b border-base-300/50 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost btn-sm flex items-center gap-2 hover:bg-base-200 transition-all duration-200 group"
              >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFullModal(true)}
                  className="btn btn-outline btn-sm gap-2 hover:bg-base-200 transition-all"
                >
                  <Maximize2Icon className="w-4 h-4" />
                  Fullscreen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300/50 transition-all duration-300 hover:shadow-3xl">
            {/* Attachment Section */}
            {hasAttachment && (
              <div className="relative bg-gradient-to-br from-base-300 to-base-200">
                <div className="absolute top-6 left-6 z-10">
                  <div className="badge badge-primary badge-lg shadow-lg gap-2 px-3 py-2">
                    {isImage ? <ImageIcon className="w-4 h-4" /> : 
                     isVideo ? <VideoIcon className="w-4 h-4" /> : 
                     <FileIcon className="w-4 h-4" />}
                    {isImage ? "Image" : isVideo ? "Video" : "File"}
                  </div>
                </div>
                
                <div className="flex justify-center items-center min-h-96 max-h-[600px] p-6">
                  {isImage && (
                    <img
                      src={attachment}
                      alt={post.title || "Post attachment"}
                      className="rounded-2xl object-contain max-h-full w-auto max-w-full transition-transform duration-500 hover:scale-105 shadow-2xl"
                      loading="lazy"
                    />
                  )}
                  {isVideo && (
                    <video
                      controls
                      className="rounded-2xl w-full max-h-full shadow-2xl"
                      aria-label="Post video"
                      poster={post.attachments?.thumbnail}
                    >
                      <source src={attachment} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            )}

            {/* Post Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Post Header */}
              <header className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="badge badge-primary badge-lg gap-2">
                    <UserIcon className="w-3 h-3" />
                    {post.author?.fullName || "Unknown Author"}
                  </div>
                  <div className="badge badge-outline badge-lg gap-2">
                    <CalendarIcon className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="badge badge-outline badge-lg gap-2">
                    <BookOpenIcon className="w-3 h-3" />
                    {readTime} min read
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {post.title}
                </h1>

                {post.description && (
                  <p className="text-xl text-base-content/70 leading-relaxed border-l-4 border-primary pl-6 py-2 bg-base-200/50 rounded-r-lg">
                    {post.description}
                  </p>
                )}
              </header>

              {/* Long Description */}
              {post.longDesc && (
                <div className="prose prose-lg max-w-none">
                  <div className="relative">
                    <div
                      className={`transition-all duration-500 ${
                        showFullDesc ? "" : "max-h-96 overflow-hidden"
                      }`}
                      id="post-description"
                    >
                      <div className="bg-base-100 rounded-2xl p-6 border border-base-300/50">
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-base-content border-b border-base-300 pb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-base-content" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-base-content" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 text-base-content/80 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="mb-4 list-disc list-inside space-y-1 text-base-content/80" {...props} />,
                            ol: ({node, ...props}) => <ol className="mb-4 list-decimal list-inside space-y-1 text-base-content/80" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-base-content/70 bg-base-200/30 py-1 rounded-r" {...props} />,
                          }}
                        >
                          {showFullDesc ? post.longDesc : post.longDesc.slice(0, 500) + (post.longDesc.length > 500 ? "..." : "")}
                        </ReactMarkdown>
                      </div>
                    </div>
                    
                    {post.longDesc.length > 500 && (
                      <div className={`pt-4 text-center ${showFullDesc ? '' : 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-100 to-transparent h-20'}`}>
                        <button
                          onClick={() => setShowFullDesc(!showFullDesc)}
                          className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all"
                        >
                          {showFullDesc ? (
                            <>
                              <Minimize2Icon className="w-4 h-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <Maximize2Icon className="w-4 h-4" />
                              Read Full Article
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-base-300/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLikeToggle}
                    className={`like-button flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                      liked 
                        ? 'bg-primary text-primary-content border-2 border-primary' 
                        : 'bg-base-200 text-base-content/80 border-2 border-base-300 hover:border-primary/50'
                    }`}
                  >
                    {liked ? (
                      <HeartOffIcon className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span>{liked ? "Liked" : "Like"}</span>
                    {likeCount > 0 && (
                      <span className="bg-primary text-primary-content rounded-full px-2 py-1 text-sm min-w-[2rem]">
                        {likeCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`btn btn-ghost btn-sm gap-2 ${isBookmarked ? 'text-primary' : ''}`}
                  >
                    <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <Share2Icon className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-base-content/60">
                  {/* <div className="flex items-center gap-2">
                    <EyeIcon className="w-4 h-4" />
                    <span>{viewCount} views</span>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <MessageCircleIcon className="w-4 h-4" />
                    <span>{comments.length} comments</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <section className="pt-8 border-t border-base-300/50">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Discussion
                  </h2>
                  {comments.length > 0 && (
                    <span className="badge badge-primary badge-lg px-3 py-2">
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
              <footer className="pt-6 border-t border-base-300/50 text-sm text-base-content/60">
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-xs">
                          {post.author?.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-base-content">
                        {post.author?.fullName || "Unknown Author"}
                      </div>
                      <div className="text-xs">Posted on {new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowFullModal(true)}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <Maximize2Icon className="w-4 h-4" />
                    Full Article
                  </button>
                </div>
              </footer>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default PostDetail;