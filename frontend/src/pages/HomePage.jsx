"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { getAllPosts, updatePost, deletePost } from '../lib/api';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import { useTogglePostLike } from "../hooks/usePostActions";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchIcon,
  GridIcon,
  ListIcon,
  MoreVerticalIcon,
  EditIcon,
  Trash2Icon,
  HeartIcon,
  HeartMinusIcon,
  EyeIcon,
  MessageCircleIcon,
  CalendarIcon,
  UserIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  PlusIcon,
  FilterIcon,
  SortAscIcon,
  LoaderIcon,
  XIcon,
  ShareIcon,
  BookmarkIcon
} from 'lucide-react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [layout, setLayout] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();
  const { isLoading: userLoading, authUser } = useAuthUser();
  const toggleLike = useTogglePostLike();

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data.filter(post => post && typeof post === 'object' && post.title));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    setActivePost(post);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setEditFile(null);
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('description', editDescription);
    if (editFile) formData.append('attachments', editFile);

    try {
      await updatePost(activePost._id, formData);
      toast.success('Post updated successfully!');
      setShowModal(false);
      fetchPosts();
    } catch (error) {
      const backendMessage = error?.response?.data?.error;
      const msg = backendMessage || error.message || 'Failed to update post';
      toast.error(msg);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deletePost(activePost._id);
      toast.success('Post deleted successfully!');
      setPosts(posts.filter((p) => p._id !== activePost._id));
      setShowConfirm(false);
    } catch (err) {
      const backendMessage = err?.response?.data?.error;
      toast.error(backendMessage || 'Delete failed');
    } finally {
      setDeleteLoading(false);
      setShowConfirm(false);
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(
      (post) =>
        post &&
        typeof post === 'object' &&
        post.title &&
        typeof post.title === 'string' &&
        (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.description && typeof post.description === 'string' && post.description.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [posts, searchQuery, sortBy]);

  const visiblePosts = filteredAndSortedPosts.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const handleShowLess = () => {
    setVisibleCount(12);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFileTypeIcon = (url) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return ImageIcon;
    if (url.match(/\.(mp4|webm|ogg)$/i)) return VideoIcon;
    return FileIcon;
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="text-center space-y-6">
          <motion.div
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <div>
            <p className="text-lg font-medium text-base-content mb-2">Loading Community Posts</p>
            <p className="text-base-content/60">Discovering amazing content from our community...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 border-b border-base-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center space-y-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-4">
              <MessageCircleIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Community Feed</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-base-content">Explore Community Posts</h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Discover, share, and engage with amazing content from our vibrant community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        {posts.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isSearchFocused ? "text-primary" : "text-base-content/40"}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search posts by title or description..."
                  className="input input-bordered w-full pl-12 pr-10 h-12 rounded-xl border-base-300/50 bg-base-100 focus:bg-base-50 transition-all duration-200 placeholder-base-content/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors duration-200"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-outline h-12 gap-2">
                    <SortAscIcon className="w-4 h-4" />
                    Sort
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 z-10">
                    <li><button onClick={() => setSortBy("newest")} className={sortBy === "newest" ? "active" : ""}>Newest First</button></li>
                    <li><button onClick={() => setSortBy("oldest")} className={sortBy === "oldest" ? "active" : ""}>Oldest First</button></li>
                    <li><button onClick={() => setSortBy("popular")} className={sortBy === "popular" ? "active" : ""}>Most Popular</button></li>
                  </ul>
                </div>

                <div className="join">
                  <button
                    onClick={() => setLayout("grid")}
                    className={`join-item btn ${layout === "grid" ? "btn-active" : ""}`}
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    className={`join-item btn ${layout === "list" ? "btn-active" : ""}`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-base-content/60 bg-base-200/50 rounded-full px-4 py-2">
                {filteredAndSortedPosts.length} of {posts.length} posts
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts Grid/List */}
        {filteredAndSortedPosts.length > 0 ? (
          <>
            <motion.div
              className={`gap-6 ${layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {visiblePosts.map((post, index) => {
                const attachment = post.attachments?.url || '';
                const isVideo = attachment.match(/\.(mp4|webm|ogg)$/i);
                const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                const FileTypeIcon = getFileTypeIcon(attachment);
                const isLiked = post.likes?.includes(authUser?._id);
                const isAuthor = authUser?._id === post.author?._id;

                return (
                  <motion.div
                    key={post._id}
                    className="group bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl border border-base-300/30 hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    {/* Post Header */}
                    <div className="relative">
                      {attachment && (
                        <div className={`relative overflow-hidden ${layout === "list" ? "w-48 flex-shrink-0 h-full" : "w-full h-48"}`}>
                          {isImage ? (
                            <img
                              src={attachment}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : isVideo ? (
                            <div className="w-full h-full bg-base-300 flex items-center justify-center">
                              <VideoIcon className="w-12 h-12 text-base-content/40" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-base-300 flex items-center justify-center">
                              <FileTypeIcon className="w-12 h-12 text-base-content/40" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <div className="badge badge-primary badge-sm">
                              <FileTypeIcon className="w-3 h-3 mr-1" />
                              {isImage ? 'Image' : isVideo ? 'Video' : 'File'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Author Actions */}
                      {isAuthor && (
                        <div className="absolute top-3 right-3 dropdown dropdown-end z-10" onClick={(e) => e.stopPropagation()}>
                          <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVerticalIcon className="w-4 h-4" />
                          </label>
                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-36 z-20">
                            <li>
                              <button onClick={() => handleEdit(post)} className="flex items-center gap-2">
                                <EditIcon className="w-4 h-4" />
                                Edit Post
                              </button>
                            </li>
                            <li>
                              <button onClick={() => { setActivePost(post); setShowConfirm(true); }} className="text-error flex items-center gap-2">
                                <Trash2Icon className="w-4 h-4" />
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-base-content mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-base-content/70 mb-4 line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>

                      {/* Post Stats */}
                      <div className="flex items-center justify-between text-sm text-base-content/60 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{post.author?.fullName || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-base-300/30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike.mutate(post._id);
                          }}
                          className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors"
                        >
                          {isLiked ? (
                            <HeartMinusIcon className="w-5 h-5 text-primary" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                          <span>{post.likes?.length || 0}</span>
                        </button>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-base-content/60">
                            <MessageCircleIcon className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-base-content/60">
                            <EyeIcon className="w-4 h-4" />
                            <span>{post.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Load More Button */}
            {filteredAndSortedPosts.length > 12 && (
              <motion.div
                className="text-center mt-12 flex gap-4 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {visibleCount < filteredAndSortedPosts.length && (
                  <button
                    onClick={handleShowMore}
                    className="btn btn-primary gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Load More Posts
                  </button>
                )}
                {visibleCount > 12 && (
                  <button
                    onClick={handleShowLess}
                    className="btn btn-outline gap-2"
                  >
                    Show Less
                  </button>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 mx-auto bg-base-200 rounded-full flex items-center justify-center mb-6">
              <MessageCircleIcon className="w-12 h-12 text-base-content/40" />
            </div>
            <h3 className="text-2xl font-semibold text-base-content mb-3">No posts found</h3>
            <p className="text-base-content/60 max-w-md mx-auto mb-8">
              {searchQuery 
                ? "No posts match your search criteria. Try adjusting your search terms."
                : "The community hasn't posted anything yet. Be the first to share your knowledge!"
              }
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-primary gap-2"
              >
                <XIcon className="w-4 h-4" />
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => navigate('/create-post')}
                className="btn btn-primary gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Create First Post
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal modal-open fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-box max-w-2xl w-full bg-base-100 rounded-2xl shadow-2xl p-0 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-base-300/30">
                <h3 className="text-xl font-semibold text-base-content">Edit Post</h3>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Post Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter post title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Description</span>
                  </label>
                  <textarea
                    placeholder="Enter post description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="textarea textarea-bordered h-32"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Attachment (Optional)</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setEditFile(e.target.files[0])}
                    className="file-input file-input-bordered"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={editLoading}
                  >
                    {editLoading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <EditIcon className="w-4 h-4" />}
                    Update Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="modal modal-open fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="modal-box max-w-md w-full bg-base-100 rounded-2xl shadow-2xl p-0 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                    <Trash2Icon className="w-6 h-6 text-error" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">Delete Post</h3>
                    <p className="text-base-content/60">This action cannot be undone</p>
                  </div>
                </div>

                <p className="text-base-content/70 mb-6">
                  Are you sure you want to delete the post "<span className="font-semibold">{activePost?.title}</span>"?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowConfirm(false)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-error gap-2"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <Trash2Icon className="w-4 h-4" />}
                    Delete Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;