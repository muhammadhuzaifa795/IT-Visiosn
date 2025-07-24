import React, { useEffect, useState } from 'react';
import { getAllPosts, updatePost, deletePost } from '../lib/api';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser'; // adjust path if needed
import { useTogglePostLike } from "../hooks/usePostActions";
import { LoaderIcon } from 'lucide-react';

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
  const navigate = useNavigate();

  const { isLoading: userLoading, authUser } = useAuthUser();

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
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
    } catch (err) {
      const backendMessage = err?.response?.data?.error;
      toast.error(backendMessage || 'Delete failed');
    } finally {
      setDeleteLoading(false);
      setShowConfirm(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading posts

  </div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">All Posts</h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const attachment = post.attachments?.url || '';
            const isVideo = attachment.match(/\.(mp4|webm|ogg)$/i);
            const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);

            return (
              <div
                key={post._id}
                className="group relative border rounded-xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-base-100 cursor-pointer"
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


                {attachment && isImage && (
                  <img
                    src={attachment}
                    alt="Attachment"
                    className="rounded-lg mb-3 w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {attachment && isVideo && (
                  <video controls className="rounded-lg mb-3 w-full h-80 object-cover">
                    <source src={attachment} type="video/mp4" />
                  </video>
                )}

                <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                <p className="text-sm mb-2 line-clamp-3">{post.description}</p>
                <p className="text-sm mb-2 line-clamp-3">{post.longDesc}</p>
                <button
                  onClick={() => toggleLike.mutate()}
                  className="mt-3 text-sm text-pink-400"
                >
                  ❤️ Like ({post.likes?.length || 0})
                </button>

                <div className="text-xs text-gray-500 flex justify-between items-center mt-3">
                  <span>Author: {post.author?.fullName || 'Unknown'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-base-100">
            <h3 className="font-bold text-lg mb-4">Edit Post</h3>
            <form onSubmit={handleEditSubmit}>
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
                <button type="submit" className="btn btn-error" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {/* Delete Confirmation */}
      {showConfirm && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-base-100">
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
        </dialog>
      )}
    </div>
  );
};

export default HomePage;
