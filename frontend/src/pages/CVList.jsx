import React, { useState, Fragment } from "react";
import {
  useGetCV,
  useGenerateCV,
  useUpdateCV,
  useDeleteCV,
} from "../hooks/useCV";
import useAuthUser from "../hooks/useAuthUser";
import CVPreview from "../components/CVPreview";
import { Plus, Filter, Search, FileText, Calendar, Grid3X3, List, SortAsc, SortDesc } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import CVForm from "../pages/CVForm";
import PageLoader from "../components/PageLoader";
import { motion, AnimatePresence } from "framer-motion";

const CVList = () => {
  const { authUser, isLoading: isAuthLoading } = useAuthUser();
  const userId = authUser?.userId || authUser?._id;

  const { cv, isLoading: isCVLoading } = useGetCV(userId);
  const { generateCVMutation } = useGenerateCV();
  const { updateCVMutation } = useUpdateCV();
  const { deleteCVMutation } = useDeleteCV();

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const openModal = () => {
    setEditData(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditData(null);
  };

  const handleEdit = (cvData) => {
    setEditData(cvData);
    setIsOpen(true);
  };

  const handleDelete = (cvData) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      deleteCVMutation({ cvId: cvData._id });
    }
  };

  if (isAuthLoading || isCVLoading) {
    return <PageLoader />;
  }

  const cvList = Array.isArray(cv) ? cv : cv ? [cv] : [];

  // Filter CVs based on search term
  const filteredCVs = cvList.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedCVs = [...filteredCVs].sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Your Professional CVs
            </h1>
            <p className="text-base-content/70">
              Manage and customize your professional resumes with AI-powered generation
            </p>
            <div className="stats stats-horizontal shadow-sm bg-base-200">
              <div className="stat py-4 px-6">
                <div className="stat-title text-xs">Total CVs</div>
                <div className="stat-value text-2xl text-primary">{cvList.length}</div>
              </div>
              <div className="stat py-4 px-6">
                <div className="stat-title text-xs">Last Updated</div>
                <div className="stat-value text-sm">
                  {cvList.length > 0 ? formatDate(cvList[0]?.updatedAt || cvList[0]?.createdAt) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openModal}
              className="btn btn-primary gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Generate New CV
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="form-control flex-1">
              <div className="input-group">
                <span className="bg-base-200">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search CVs by name, email, or skills..."
                  className="input input-bordered flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Sort Dropdown */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline gap-2">
                  {sortOrder === "newest" && <SortDesc className="w-4 h-4" />}
                  {sortOrder === "oldest" && <SortAsc className="w-4 h-4" />}
                  {sortOrder === "name" && <Calendar className="w-4 h-4" />}
                  Sort
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                  <li>
                    <button onClick={() => setSortOrder("newest")} className={sortOrder === "newest" ? "active" : ""}>
                      <SortDesc className="w-4 h-4" />
                      Newest First
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setSortOrder("oldest")} className={sortOrder === "oldest" ? "active" : ""}>
                      <SortAsc className="w-4 h-4" />
                      Oldest First
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setSortOrder("name")} className={sortOrder === "name" ? "active" : ""}>
                      <Calendar className="w-4 h-4" />
                      By Name
                    </button>
                  </li>
                </ul>
              </div>

              {/* View Mode Toggle */}
              <div className="btn-group">
                <button
                  className={`btn btn-sm ${viewMode === "grid" ? "btn-active" : "btn-outline"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  className={`btn btn-sm ${viewMode === "list" ? "btn-active" : "btn-outline"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {searchTerm && (
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="badge badge-primary gap-2">
                <Search className="w-3 h-3" />
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn btn-ghost btn-xs btn-circle"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-base-content/70">
            {searchTerm ? `Found ${sortedCVs.length} of ${cvList.length} CVs` : `Showing ${sortedCVs.length} CVs`}
          </p>
        </div>
      </div>

      {/* CV Grid/List */}
      <AnimatePresence mode="wait">
        {sortedCVs.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {sortedCVs.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {viewMode === "grid" ? (
                  <CVPreview
                    cv={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="card-title text-lg">{item.name || "Untitled CV"}</h3>
                          <p className="text-base-content/70 text-sm">{item.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
                            <span>Created: {formatDate(item.createdAt)}</span>
                            {item.updatedAt !== item.createdAt && (
                              <span>Updated: {formatDate(item.updatedAt)}</span>
                            )}
                          </div>
                          {item.skills && item.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="badge badge-outline badge-sm">
                                  {skill}
                                </span>
                              ))}
                              {item.skills.length > 3 && (
                                <span className="badge badge-ghost badge-sm">
                                  +{item.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn btn-sm btn-outline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="btn btn-sm btn-error btn-outline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-base-100 shadow-sm"
          >
            <div className="card-body text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? "No CVs found" : "No CVs yet"}
              </h3>
              <p className="text-base-content/70 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? `No CVs match your search "${searchTerm}". Try adjusting your search terms.`
                  : "Get started by creating your first professional CV with our AI-powered generator."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn btn-outline"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={openModal}
                  className="btn btn-primary gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First CV
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV Form Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl rounded-2xl bg-base-100 shadow-2xl">
                  <CVForm
                    initialData={editData}
                    onClose={closeModal}
                    onSuccess={closeModal}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CVList;