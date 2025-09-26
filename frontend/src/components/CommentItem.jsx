import { useState } from "react";
import { useAddComment, useToggleLike } from "../hooks/useComments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faReply, faHeart } from "@fortawesome/free-solid-svg-icons";

const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Unknown time";
  }
};

const CommentItem = ({ comment, postId }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const { mutate: addComment, isPending: isPosting } = useAddComment();
  const { mutate: toggleLike } = useToggleLike();

  const handleReply = () => {
    if (!replyText.trim()) return;
    addComment(
      { postId, text: replyText, parentId: comment._id },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReply(false);
        },
      }
    );
  };

  const handleLike = () => {
    toggleLike(
      { postId, commentId: comment._id },
      {
        onSuccess: () => setIsLiked(!isLiked),
      }
    );
  };

  return (
    <div className="py-3 hover:bg-gray-100/20 rounded-lg px-2 transition-colors">
      <div className="flex gap-3">
        <img
          src={comment.user?.profilePic || "/default-profile.png"}
          alt="User ProfilePic"
          className="w-10 h-10 rounded-full mt-1 ring-2 ring-gray-300"
          onError={(e) => (e.target.src = "/default-profile.png")}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {comment.user?.fullName || "Anonymous"}
            </span>
            {comment.user?.skills?.length > 0 && (
              <span className="text-xs text-gray-500">
                ({comment.user.skills.join(", ")})
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatTimestamp(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 text-sm mt-1 leading-relaxed">{comment.text}</p>
          <div className="flex gap-6 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all text-sm hover:scale-105 ${isLiked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
                }`}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span className="font-medium">
                {comment.likes?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-all text-sm hover:scale-105"
            >
              <FontAwesomeIcon icon={faReply} />
              <span>Reply</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all text-sm hover:scale-105">
              <FontAwesomeIcon icon={faHeart} />
              <span>Love</span>
            </button>
          </div>

          {showReply && (
            <div className="mt-4 flex gap-3 p-3 rounded-lg">
              <img
                src={comment.user?.profilePic || "/default-profile.png"}
                alt="User ProfilePic"
                className="w-8 h-8 rounded-full mt-1"
                onError={(e) => (e.target.src = "/default-profile.png")}
              />
              <div className="flex-1 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500 p-3 text-sm resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowReply(false)}
                    className="text-gray-600 hover:text-gray-800 text-sm px-4 py-2 rounded-lg hover:bg-gray-100/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={isPosting || !replyText.trim()}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPosting || !replyText.trim()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    {isPosting ? "Replying..." : "Reply"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;