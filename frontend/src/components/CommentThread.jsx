import { useState } from "react";
import CommentItem from "./CommentItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const CommentThread = ({ comment, postId, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(depth < 2); // Auto-expand first 2 levels
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div
      className="mt-1"
      style={{ marginLeft: `${depth * 32}px` }} // Increased indentation for clarity
    >
      <CommentItem comment={comment} postId={postId} />

      {hasReplies && (
        <>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm ml-14 mt-2 mb-2 transition-colors"
          >
            <FontAwesomeIcon icon={showReplies ? faChevronUp : faChevronDown} />
            <span>
              {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </button>

          {showReplies && (
            <div className="border-l-2 border-gray-700 ml-6 pl-2">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentThread;
