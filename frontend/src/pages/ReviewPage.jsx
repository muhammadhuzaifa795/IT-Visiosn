"use client"

import React, { useState } from "react";
import { useReviews, useAddReview, useDeleteReview } from "../hooks/useReviews";
import useAuthUser from "../hooks/useAuthUser";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MessageCircle, Trash2, User, Send, Loader2, Image } from "lucide-react";

// Toast component
const Toast = ({ message, type = "success", onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
        ${type === "success" ? "bg-success text-white" : ""}
        ${type === "error" ? "bg-error text-white" : ""}
        ${type === "warning" ? "bg-warning text-white" : ""}
        ${type === "info" ? "bg-info text-white" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={`transition-transform duration-200 ${
            !readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"
          }`}
        >
          <Star
            className={`
              w-6 h-6
              ${star <= (hoverRating || rating)
                ? "fill-warning text-warning"
                : "text-base-content/30"
              }
              transition-colors duration-200
            `}
          />
        </button>
      ))}
    </div>
  );
};

// User Avatar Component
const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  if (user?.profilePic) {
    return (
      <img
        src={user.profilePic}
        alt={user.fullName}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary/20`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center`}>
      <User className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
    </div>
  );
};

// Review Modal Component
const ReviewModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && rating) {
      onSubmit({ text: text.trim(), rating });
    }
  };

  const handleClose = () => {
    setText("");
    setRating(5);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-base-100/90 backdrop-blur-2xl rounded-3xl max-w-md w-full shadow-2xl border border-base-300/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-base-300/30">
              <h3 className="text-xl font-bold text-base-content">Write a Review</h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-base-200/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-base-content/60" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-3">
                  Your Rating
                </label>
                <StarRating rating={rating} onRatingChange={setRating} />
                <div className="text-xs text-base-content/60 mt-2">
                  {rating === 5 && "Excellent - Love it! ⭐⭐⭐⭐⭐"}
                  {rating === 4 && "Very Good - Great experience! ⭐⭐⭐⭐"}
                  {rating === 3 && "Good - Pretty good ⭐⭐⭐"}
                  {rating === 2 && "Fair - Could be better ⭐⭐"}
                  {rating === 1 && "Poor - Not satisfied ⭐"}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Your Review
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your experience... What did you like? What could be improved?"
                  className="w-full h-32 p-4 border-2 border-base-300/30 rounded-xl bg-base-100/50 backdrop-blur-sm outline-none transition-all duration-300 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/10 placeholder:text-base-content/40 resize-none"
                  required
                  minLength={10}
                  maxLength={500}
                />
                <div className="text-xs text-base-content/60 mt-1 text-right">
                  {text.length}/500 characters
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-base-300/30 text-base-content rounded-xl hover:bg-base-200/20 transition-colors font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !text.trim() || text.length < 10}
                  whileHover={{ scale: isSubmitting || !text.trim() ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting || !text.trim() ? 1 : 0.95 }}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ReviewPage = () => {
  const { data: reviews = [], isLoading, error, refetch } = useReviews();
  const { mutate: addReview, isPending: isAdding } = useAddReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { authUser, isLoading: authLoading, isAuthenticated } = useAuthUser();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Find user's existing review
  const userReview = reviews?.find(review => 
    authUser && review.user?._id === authUser._id
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmitReview = (reviewData) => {
    addReview(reviewData, {
      onSuccess: (data) => {
        setShowReviewModal(false);
        showToast("Review submitted successfully!", "success");
      },
      onError: (error) => {
        showToast(error.message || "Failed to submit review", "error");
      },
    });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      deleteReview(reviewId, {
        onSuccess: () => {
          showToast("Review deleted successfully!", "success");
        },
        onError: (error) => {
          showToast(error.message || "Failed to delete review", "error");
        },
      });
    }
  };

  // Calculate average rating
  const averageRating = reviews?.length
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
    : 0;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200/20 to-base-300/10">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-base-content/70">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200/20 to-base-300/10">
        <div className="text-center">
          <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-semibold text-base-content mb-2">Failed to load reviews</h3>
          <p className="text-base-content/70 mb-4">{error.message || "Please try again later"}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/20 to-base-300/10 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={isAdding}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-6xl"
      >
        <div className="bg-base-100/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-base-300/30 p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              User Reviews
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              See what our community is saying about their experience
            </p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100/50 backdrop-blur-2xl rounded-2xl shadow-lg p-6 mb-8 border border-base-300/30"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-4 mb-2">
                  <div className="text-4xl font-bold text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {averageRating}
                  </div>
                  <div>
                    <StarRating rating={Math.round(averageRating)} readonly />
                    <p className="text-base-content/70 text-sm mt-1">
                      Based on {reviews?.length || 0} review{reviews?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isAuthenticated && !userReview && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReviewModal(true)}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg flex items-center justify-center gap-2 font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Write a Review
                  </motion.button>
                )}

                {isAuthenticated && userReview && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteReview(userReview._id)}
                    disabled={isDeleting}
                    className="px-6 py-3 bg-error text-white rounded-xl hover:bg-error/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete Your Review
                  </motion.button>
                )}

                {!isAuthenticated && !authLoading && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg font-medium"
                  >
                    Login to Review
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Reviews List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-h-[600px] overflow-y-auto p-4"
          >
            {reviews?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-base-200/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-base-content/40" />
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-base-content/70 mb-6">
                  Be the first to share your experience!
                </p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg font-medium"
                  >
                    Write First Review
                  </button>
                )}
              </div>
            ) : (
              reviews?.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-base-100/50 backdrop-blur-2xl rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-base-300/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <UserAvatar user={review.user} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-base-content">
                              {review.user?.fullName || "Anonymous User"}
                            </h4>
                            <span className="text-sm text-base-content/50">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} readonly />
                            <span className="text-sm font-medium text-warning">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                        {review.text}
                      </p>
                    </div>

                    {/* Delete Button - Only show for user's own review */}
                    {authUser && review.user?._id === authUser._id && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteReview(review._id)}
                        disabled={isDeleting}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors ml-4 flex-shrink-0"
                        title="Delete your review"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewPage;