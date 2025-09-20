



import { useState } from "react";
import { useAddComment, useComments } from "../hooks/useComments";
import CommentThread from "./CommentThread";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faComment, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const PostComment = ({ postId, user }) => {
  const [text, setText] = useState("");
  const [sortBy, setSortBy] = useState("top"); // top or newest
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);
  // Auto comments state remove kar diya
  const { mutate: addComment, isPending } = useAddComment();
  const { data: comments = [], isLoading } = useComments(postId);

  // generateRandomComment function remove kar diya - ab need nahi

  // Auto-generate comments wala useEffect remove kar diya

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addComment({ postId, commentData: { text } });
    setText("");
  };

  const handleToggleComments = () => {
    setIsExpanded(!isExpanded);
    // Initial auto comments generation remove kar diya
  };

  const handleLoadMore = () => {
    setVisibleComments(prev => prev + 5);
  };

  // Sirf real comments use karenge, auto comments nahi
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "top") {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  const displayedComments = sortedComments.slice(0, visibleComments);
  const hasMoreComments = sortedComments.length > visibleComments;

  return (
    <div className="font-roboto text-white">
      {/* Comment Toggle Button */}
      <button
        onClick={handleToggleComments}
        className="flex items-center gap-3 p-4 w-full hover:bg-gray-800/50 transition-colors border-t border-gray-700"
      >
        <FontAwesomeIcon icon={faComment} className="text-gray-400" />
        <span className="text-gray-300">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
        <FontAwesomeIcon 
          icon={isExpanded ? faChevronUp : faChevronDown} 
          className="text-gray-400 ml-auto" 
        />
      </button>

      {/* Expanded Comment Section */}
      {isExpanded && (
        <div className="space-y-6 p-4 bg-gray-900/30">
          {/* Comment Count and Sort Dropdown */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </h3>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSort} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white border-gray-700 border rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="top">Top Comments</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <img
                src={user?.profilePic || "https://as2.ftcdn.net/jpg/05/49/98/39/1000_f_549983970_brckyfk0p6pp5fkbmhzmib07mcj6esxl.webp"}
                alt="User ProfilePic"
                className="w-10 h-10 rounded-full"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 py-2 resize-none text-sm"
                placeholder="Add a comment..."
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setText("")}
                className="text-gray-400 hover:text-gray-200 text-sm px-4 py-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !text.trim()}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  isPending || !text.trim()
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isPending ? "Posting..." : "Comment"}
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-400">Loading comments...</span>
              </div>
            ) : (
              <>
                {displayedComments.map((comment) => (
                  <div key={comment._id} className="relative">
                    <CommentThread comment={comment} postId={postId} />
                    {/* Auto generated badge remove kar diya */}
                  </div>
                ))}
                
                {hasMoreComments && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full py-3 text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium"
                  >
                    Load more comments ({sortedComments.length - visibleComments} remaining)
                  </button>
                )}
                
                {sortedComments.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FontAwesomeIcon icon={faComment} className="text-4xl mb-3 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComment;