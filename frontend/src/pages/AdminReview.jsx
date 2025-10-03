
"use client"

import React, { useState } from "react";
import { useReviews, useDeleteReview } from "../hooks/useReviews";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Star, 
  User, 
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Shield
} from "lucide-react";

// Toast Component
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
        <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// User Avatar Component
const UserAvatar = ({ user, size = "sm" }) => {
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
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-base-300/30`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center`}>
      <User className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
    </div>
  );
};

// Star Rating Display
const StarRating = ({ rating, size = "sm" }) => {
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "fill-warning text-warning"
                : "text-base-content/30"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-base-content/80">{rating}.0</span>
    </div>
  );
};

// Action Dropdown
const ActionDropdown = ({ review, onDelete, onToggleVisibility }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-base-200/50 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-base-content/60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 top-full mt-1 w-48 bg-base-100/90 backdrop-blur-2xl rounded-lg shadow-lg border border-base-300/30 z-10"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  onToggleVisibility(review);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-base-content/80 hover:bg-base-200/50 rounded-md transition-colors"
              >
                {review.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {review.isVisible ? "Hide Review" : "Show Review"}
              </button>
              <button
                onClick={() => {
                  onDelete(review._id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Review
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminReviewsPage = () => {
  const { data: reviews = [], isLoading, error, refetch } = useReviews();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [toast, setToast] = useState(null);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.text?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "visible" && review.isVisible !== false) ||
      (statusFilter === "hidden" && review.isVisible === false);
    
    const matchesRating = ratingFilter === "all" || 
      review.rating === parseInt(ratingFilter);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId, {
        onSuccess: () => {
          showToast("Review deleted successfully", "success");
        },
        onError: (error) => {
          showToast(error.message || "Failed to delete review", "error");
        }
      });
    }
  };

  const handleToggleVisibility = (review) => {
    // Note: The original code references an undefined `updateReview` function.
    // For this optimization, we'll assume a mutation hook is needed (e.g., useUpdateReview).
    // Since it's not provided, we'll log a warning and skip implementation.
    console.warn("updateReview function is not implemented.");
    showToast("Review visibility toggle not implemented", "warning");
  };

  // Stats
  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter(r => r.isVisible !== false).length;
  const hiddenReviews = reviews.filter(r => r.isVisible === false).length;
  const averageRating = reviews.length 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200/20 to-base-300/10">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
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
            <XCircle className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-semibold text-base-content mb-2">Failed to load reviews</h3>
          <p className="text-base-content/70 mb-4">{error.message}</p>
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-[calc(100vh-2rem)] max-w-[100vw]"
      >
        <div className="bg-base-100/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-base-300/30 p-8 flex flex-col h-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Reviews Management
              </h1>
              <p className="text-base-content/70 mt-2">Manage and moderate user reviews</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 border border-base-300/30 text-base-content rounded-xl hover:bg-base-200/50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-success to-success/80 text-white rounded-xl hover:bg-success/90 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-base-100/50 backdrop-blur-2xl rounded-xl p-6 shadow-sm border border-base-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-base-content/70">Total Reviews</p>
                  <p className="text-2xl font-bold text-base-content">{totalReviews}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-base-100/50 backdrop-blur-2xl rounded-xl p-6 shadow-sm border border-base-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-base-content/70">Visible</p>
                  <p className="text-2xl font-bold text-success">{visibleReviews}</p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>

            <div className="bg-base-100/50 backdrop-blur-2xl rounded-xl p-6 shadow-sm border border-base-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-base-content/70">Hidden</p>
                  <p className="text-2xl font-bold text-error">{hiddenReviews}</p>
                </div>
                <div className="w-12 h-12 bg-error/20 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-error" />
                </div>
              </div>
            </div>

            <div className="bg-base-100/50 backdrop-blur-2xl rounded-xl p-6 shadow-sm border border-base-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-base-content/70">Avg Rating</p>
                  <p className="text-2xl font-bold text-warning">{averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-base-100/50 backdrop-blur-2xl rounded-xl p-6 shadow-sm border border-base-300/30 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by user or review text..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-base-300/30 rounded-xl bg-base-100/50 backdrop-blur-sm outline-none transition-all duration-300 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/10 placeholder:text-base-content/40"
                  />
                </div>
              </div>

              <div className="lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-base-300/30 rounded-xl bg-base-100/50 backdrop-blur-sm outline-none transition-all duration-300 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/10"
                >
                  <option value="all">All Status</option>
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div className="lg:w-48">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-base-300/30 rounded-xl bg-base-100/50 backdrop-blur-sm outline-none transition-all duration-300 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/10"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Reviews Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 overflow-y-auto bg-base-100/50 backdrop-blur-2xl rounded-xl shadow-sm border border-base-300/30"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-200/20 border-b border-base-300/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      User & Review
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Status
                    </th>
                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-base-100/50 divide-y divide-base-300/30">
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-base-200/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <UserAvatar user={review.user} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-base-content truncate">
                                {review.user?.fullName || "Anonymous"}
                              </p>
                              {review.isVisible === false && (
                                <span className="px-2 py-1 text-xs bg-error/20 text-error rounded-full">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-base-content/70 line-clamp-2">
                              {review.text}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                          <Calendar className="w-4 h-4" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          review.isVisible === false 
                            ? "bg-error/20 text-error" 
                            : "bg-success/20 text-success"
                        }`}>
                          {review.isVisible === false ? "Hidden" : "Visible"}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4">
                        <ActionDropdown
                          review={review}
                          onDelete={handleDeleteReview}
                          onToggleVisibility={handleToggleVisibility}
                        />
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-base-200/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-base-content/40" />
                </div>
                <h3 className="text-lg font-medium text-base-content mb-2">No reviews found</h3>
                <p className="text-base-content/70">
                  {searchTerm || statusFilter !== "all" || ratingFilter !== "all" 
                    ? "Try adjusting your filters or search term"
                    : "No reviews have been submitted yet"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReviewsPage;
