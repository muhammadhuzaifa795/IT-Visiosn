"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { getAllPosts, updatePost, deletePost } from '../lib/api';
import { FiMoreVertical, FiEdit, FiTrash2, FiGrid, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import { useTogglePostLike } from "../hooks/usePostActions";
import { LoaderIcon } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

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
  const [visibleCount, setVisibleCount] = useState(9);
  const [layout, setLayout] = useState("grid");
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
      toast.success('Post updated!');
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
      toast.success('Post deleted!');
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
    return filtered;
  }, [posts, searchQuery]);

  const visiblePosts = filteredAndSortedPosts.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const handleShowLess = () => {
    setVisibleCount(9);
  };

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <div className="text-center space-y-6">
          <motion.div
            className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-lg font-medium text-base-content">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="bg-gradient-to-br from-base-200/50 to-base-300/30 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-base-content">Community Posts</h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Explore and share knowledge with the community
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className={`w-5 h-5 transition-colors duration-200 ${isSearchFocused ? "text-primary" : "text-base-content/40"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search posts by title or description..."
                  className="input input-bordered w-full pl-12 pr-4 h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 bg-base-100/80 backdrop-blur-sm border-base-300/50 placeholder-base-content/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/40 hover:text-base-content transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-base-content/70 whitespace-nowrap">Layout:</span>
                <button
                  onClick={() => setLayout(layout === "grid" ? "row" : "grid")}
                  className="btn btn-sm btn-ghost flex items-center gap-2"
                >
                  {layout === "grid" ? (
                    <>
                      <FiList className="w-5 h-5" /> Row
                    </>
                  ) : (
                    <>
                      <FiGrid className="w-5 h-5" /> Grid
                    </>
                  )}
                </button>
              </div>

              <div className="text-sm text-base-content/60 whitespace-nowrap">
                {filteredAndSortedPosts.length} of {posts.length} posts
              </div>
            </div>
          </motion.div>
        )}

        {filteredAndSortedPosts.length > 0 ? (
          <motion.div
            className={`grid ${layout === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"} gap-6`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {visiblePosts.map((post, index) => {
              const attachment = post.attachments?.url || '';
              const isVideo = attachment.match(/\.(mp4|webm|ogg)$/i);
              const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);

              return (
                <motion.div
                  key={post._id}
                  className={`group relative border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-base-100 cursor-pointer ${layout === "row" ? "flex flex-row" : ""}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => navigate(`/posts/${post._id}`)}
                >
                  {authUser?._id === post.author?._id && (
                    <div
                      className="absolute top-3 right-3 dropdown dropdown-end z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
                        <FiMoreVertical className="text-lg" />
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-36">
                        <li
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(post);
                          }}
                        >
                          <span className="flex items-center gap-2 text-sm cursor-pointer">
                            <FiEdit /> Edit
                          </span>
                        </li>
                        <li
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActivePost(post);
                            setShowConfirm(true);
                          }}
                        >
                          <span className="flex items-center gap-2 text-sm cursor-pointer">
                            <FiTrash2 /> Delete
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {attachment && (
                    <div className={layout === "row" ? "w-1/3 flex-shrink-0" : "w-full"}>
                      {isImage && (
                        <img
                          src={attachment}
                          alt="Attachment"
                          className="rounded-lg w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      {isVideo && (
                        <video controls className="rounded-lg w-full h-48 object-cover">
                          <source src={attachment} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  )}

                  <div className={layout === "row" ? "w-2/3 p-4" : "p-4"}>
                    <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                    <p className="text-sm mb-2 line-clamp-3">{post.description}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike.mutate(post._id);
                      }}
                      className="mt-3 text-sm text-pink-400"
                    >
                      ❤️ Like ({post.likes?.length || 0})
                    </button>

                    <div className="text-xs text-gray-500 flex justify-between items-center mt-3">
                      <span>Author: {post.author?.fullName || 'Unknown'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto bg-base-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-2">No posts found</h3>
            <p className="text-base-content/60 mb-6">
              {searchQuery ? "No posts match your search criteria. Try adjusting your search terms." : "No posts available. Be the first to create one!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-outline btn-primary"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {filteredAndSortedPosts.length > 9 && (
          <motion.div
            className="text-center mt-8 flex gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {visibleCount < filteredAndSortedPosts.length && (
              <button
                onClick={handleShowMore}
                className="btn btn-primary btn-lg"
              >
                Show More
              </button>
            )}
            {visibleCount > 9 && (
              <button
                onClick={handleShowLess}
                className="btn btn-outline btn-lg"
              >
                Show Less
              </button>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal modal-open fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">Edit Post</h3>
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input input-bordered w-full mb-3"
                  />
                  <textarea
                    placeholder="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="textarea textarea-bordered w-full mb-3"
                  />
                  <input
                    type="file"
                    onChange={(e) => setEditFile(e.target.files[0])}
                    className="file-input file-input-bordered w-full mb-4"
                  />
                  <div className="modal-action">
                    <button type="button" className="btn" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-error" onClick={handleEditSubmit} disabled={editLoading}>
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="modal modal-open fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="font-bold text-lg">Are you sure you want to delete this post?</h3>
                <div className="modal-action">
                  <button className="btn" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-error" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
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