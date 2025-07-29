// import React, { useState, Fragment } from "react";
// import {
//   useGetCV,
//   useGenerateCV,
//   useUpdateCV,
//   useDeleteCV,
// } from "../hooks/useCV";
// import useAuthUser from "../hooks/useAuthUser";
// import CVPreview from "../components/CVPreview";
// import { Plus, Filter, Search, FileText, Calendar, Grid3X3, List, SortAsc, SortDesc } from "lucide-react";
// import { Dialog, Transition } from "@headlessui/react";
// import CVForm from "../pages/CVForm";
// import PageLoader from "../components/PageLoader";
// import { motion, AnimatePresence } from "framer-motion";

// const CVList = () => {
//   const { authUser, isLoading: isAuthLoading } = useAuthUser();
//   const userId = authUser?.userId || authUser?._id;

//   const { cv, isLoading: isCVLoading } = useGetCV(userId);
//   const { generateCVMutation } = useGenerateCV();
//   const { updateCVMutation } = useUpdateCV();
//   const { deleteCVMutation } = useDeleteCV();

//   const [isOpen, setIsOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [sortOrder, setSortOrder] = useState("newest");
//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   const openModal = () => {
//     setEditData(null);
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setEditData(null);
//   };

//   const handleEdit = (cvData) => {
//     setEditData(cvData);
//     setIsOpen(true);
//   };

//   const handleDelete = (cvData) => {
//     if (window.confirm("Are you sure you want to delete this CV?")) {
//       deleteCVMutation({ cvId: cvData._id });
//     }
//   };

//   if (isAuthLoading || isCVLoading) {
//     return <PageLoader />;
//   }

//   const cvList = Array.isArray(cv) ? cv : cv ? [cv] : [];

//   // Filter CVs based on search term
//   const filteredCVs = cvList.filter((item) =>
//     item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const sortedCVs = [...filteredCVs].sort((a, b) => {
//     if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
//     if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
//     if (sortOrder === "name") return (a.name || "").localeCompare(b.name || "");
//     return 0;
//   });

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div className="space-y-2">
//             <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
//               <FileText className="w-8 h-8 text-primary" />
//               Your Professional CVs
//             </h1>
//             <p className="text-base-content/70">
//               Manage and customize your professional resumes with AI-powered generation
//             </p>
//             <div className="stats stats-horizontal shadow-sm bg-base-200">
//               <div className="stat py-4 px-6">
//                 <div className="stat-title text-xs">Total CVs</div>
//                 <div className="stat-value text-2xl text-primary">{cvList.length}</div>
//               </div>
//               <div className="stat py-4 px-6">
//                 <div className="stat-title text-xs">Last Updated</div>
//                 <div className="stat-value text-sm">
//                   {cvList.length > 0 ? formatDate(cvList[0]?.updatedAt || cvList[0]?.createdAt) : 'N/A'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={openModal}
//               className="btn btn-primary gap-2 shadow-lg"
//             >
//               <Plus className="w-5 h-5" />
//               Generate New CV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="card bg-base-100 shadow-sm mb-6">
//         <div className="card-body p-6">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="form-control flex-1">
//               <div className="input-group">
//                 <span className="bg-base-200">
//                   <Search className="w-5 h-5" />
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="Search CVs by name, email, or skills..."
//                   className="input input-bordered flex-1"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="flex gap-2">
//               {/* Sort Dropdown */}
//               <div className="dropdown dropdown-end">
//                 <label tabIndex={0} className="btn btn-outline gap-2">
//                   {sortOrder === "newest" && <SortDesc className="w-4 h-4" />}
//                   {sortOrder === "oldest" && <SortAsc className="w-4 h-4" />}
//                   {sortOrder === "name" && <Calendar className="w-4 h-4" />}
//                   Sort
//                 </label>
//                 <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
//                   <li>
//                     <button onClick={() => setSortOrder("newest")} className={sortOrder === "newest" ? "active" : ""}>
//                       <SortDesc className="w-4 h-4" />
//                       Newest First
//                     </button>
//                   </li>
//                   <li>
//                     <button onClick={() => setSortOrder("oldest")} className={sortOrder === "oldest" ? "active" : ""}>
//                       <SortAsc className="w-4 h-4" />
//                       Oldest First
//                     </button>
//                   </li>
//                   <li>
//                     <button onClick={() => setSortOrder("name")} className={sortOrder === "name" ? "active" : ""}>
//                       <Calendar className="w-4 h-4" />
//                       By Name
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               {/* View Mode Toggle */}
//               <div className="btn-group">
//                 <button
//                   className={`btn btn-sm ${viewMode === "grid" ? "btn-active" : "btn-outline"}`}
//                   onClick={() => setViewMode("grid")}
//                 >
//                   <Grid3X3 className="w-4 h-4" />
//                 </button>
//                 <button
//                   className={`btn btn-sm ${viewMode === "list" ? "btn-active" : "btn-outline"}`}
//                   onClick={() => setViewMode("list")}
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Active Filters */}
//           {searchTerm && (
//             <div className="flex flex-wrap gap-2 mt-4">
//               <div className="badge badge-primary gap-2">
//                 <Search className="w-3 h-3" />
//                 Search: "{searchTerm}"
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="btn btn-ghost btn-xs btn-circle"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Results Section */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between">
//           <p className="text-base-content/70">
//             {searchTerm ? `Found ${sortedCVs.length} of ${cvList.length} CVs` : `Showing ${sortedCVs.length} CVs`}
//           </p>
//         </div>
//       </div>

//       {/* CV Grid/List */}
//       <AnimatePresence mode="wait">
//         {sortedCVs.length > 0 ? (
//           <motion.div
//             key={viewMode}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//             className={
//               viewMode === "grid"
//                 ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
//                 : "space-y-4"
//             }
//           >
//             {sortedCVs.map((item, index) => (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 {viewMode === "grid" ? (
//                   <CVPreview
//                     cv={item}
//                     onEdit={handleEdit}
//                     onDelete={handleDelete}
//                   />
//                 ) : (
//                   <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
//                     <div className="card-body p-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <h3 className="card-title text-lg">{item.name || "Untitled CV"}</h3>
//                           <p className="text-base-content/70 text-sm">{item.email}</p>
//                           <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
//                             <span>Created: {formatDate(item.createdAt)}</span>
//                             {item.updatedAt !== item.createdAt && (
//                               <span>Updated: {formatDate(item.updatedAt)}</span>
//                             )}
//                           </div>
//                           {item.skills && item.skills.length > 0 && (
//                             <div className="flex flex-wrap gap-1 mt-3">
//                               {item.skills.slice(0, 3).map((skill, i) => (
//                                 <span key={i} className="badge badge-outline badge-sm">
//                                   {skill}
//                                 </span>
//                               ))}
//                               {item.skills.length > 3 && (
//                                 <span className="badge badge-ghost badge-sm">
//                                   +{item.skills.length - 3} more
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="btn btn-sm btn-outline"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item)}
//                             className="btn btn-sm btn-error btn-outline"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="card bg-base-100 shadow-sm"
//           >
//             <div className="card-body text-center py-16">
//               <FileText className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">
//                 {searchTerm ? "No CVs found" : "No CVs yet"}
//               </h3>
//               <p className="text-base-content/70 mb-6 max-w-md mx-auto">
//                 {searchTerm
//                   ? `No CVs match your search "${searchTerm}". Try adjusting your search terms.`
//                   : "Get started by creating your first professional CV with our AI-powered generator."}
//               </p>
//               {searchTerm ? (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="btn btn-outline"
//                 >
//                   Clear Search
//                 </button>
//               ) : (
//                 <button
//                   onClick={openModal}
//                   className="btn btn-primary gap-2"
//                 >
//                   <Plus className="w-5 h-5" />
//                   Create Your First CV
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* CV Form Modal */}
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={closeModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-6xl rounded-2xl bg-base-100 shadow-2xl">
//                   <CVForm
//                     initialData={editData}
//                     onClose={closeModal}
//                     onSuccess={closeModal}
//                   />
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// };

// export default CVList;


// CVList.jsx
"use client"

import { useState, Fragment } from "react"
import { useGetCV, useGenerateCV, useUpdateCV, useDeleteCV } from "../hooks/useCV"
import useAuthUser from "../hooks/useAuthUser"
import CVPreview from "../components/CVPreview"
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  X,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import CVForm from "../pages/CVForm"
import PageLoader from "../components/PageLoader"
import { motion, AnimatePresence } from "framer-motion"
import { useQueryClient } from '@tanstack/react-query';

const CVList = () => {
  const queryClient = useQueryClient();

  const { authUser, isLoading: isAuthLoading } = useAuthUser()
  const userId = authUser?.userId || authUser?._id
  const { cv, isLoading: isCVLoading } = useGetCV(userId)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);

  const { mutate: generateCV } = useGenerateCV();
  const { mutate: updateCV } = useUpdateCV();
  const { deleteCVMutation: deleteCV } = useDeleteCV();

  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")

  const openModal = () => {
    setEditData(null)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setEditData(null)
  }

  const handleEdit = (cvData) => {
    setEditData(cvData)
    setIsOpen(true)
  }

  const handleDelete = (cvData) => {
    if (!cvData || !cvData._id) {
      console.error("CV data or _id is missing for deletion.", cvData);
      // Removed alert here
      return;
    }
    setSelectedCV(cvData);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCV || !selectedCV._id) {
      console.error("No CV selected for deletion.");
      // Removed alert here
      return;
    }

    deleteCV(
      { cvId: selectedCV._id },
      {
        onSuccess: () => {
          console.log("CV deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ['cv'] });
          setDeleteConfirmOpen(false);
          setSelectedCV(null);
        },
        onError: (error) => {
          console.error("Error deleting CV from CVList.jsx:", error);
          // Removed alert here
          setDeleteConfirmOpen(false);
          setSelectedCV(null);
        },
      }
    );
  };


  if (isAuthLoading || isCVLoading) {
    return <PageLoader />
  }

  const cvList = Array.isArray(cv) ? cv : cv ? [cv] : []

  const filteredCVs = cvList.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedCVs = [...filteredCVs].sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
    if (sortOrder === "name") return (a.name || "").localeCompare(b.name || "")
    return 0
  })

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getSortIcon = () => {
    switch (sortOrder) {
      case "newest":
        return <SortDesc className="w-4 h-4" />
      case "oldest":
        return <SortAsc className="w-4 h-4" />
      case "name":
        return <Calendar className="w-4 h-4" />
      default:
        return <SortDesc className="w-4 h-4" />
    }
  }

  const getSortLabel = () => {
    switch (sortOrder) {
      case "newest":
        return "Newest First"
      case "oldest":
        return "Oldest First"
      case "name":
        return "By Name"
      default:
        return "Sort"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <motion.h1
              className="text-3xl lg:text-4xl font-bold flex items-center gap-3 text-base-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <FileText className="w-8 h-8 text-primary" />
              Your Professional CVs
            </motion.h1>
            <motion.p
              className="text-base-content/70 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Manage and customize your professional resumes with AI-powered generation
            </motion.p>
            <motion.div
              className="stats stats-horizontal shadow-lg bg-base-200/50 backdrop-blur-sm border border-base-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="stat py-4 px-6">
                <div className="stat-title text-xs text-base-content/60">Total CVs</div>
                <div className="stat-value text-2xl text-primary font-bold">{cvList.length}</div>
              </div>
              <div className="stat py-4 px-6">
                <div className="stat-title text-xs text-base-content/60">Last Updated</div>
                <div className="stat-value text-sm text-base-content">
                  {cvList.length > 0 ? formatDate(cvList[0]?.updatedAt || cvList[0]?.createdAt) : "N/A"}
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={openModal}
              className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:btn-primary-focus"
            >
              <Plus className="w-5 h-5" />
              Generate New CV
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="card-body p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="form-control flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  placeholder="Search CVs by name, email, or skills..."
                  className="input input-bordered w-full pl-10 pr-4 bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-100 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-error transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 items-center">
              {/* Sort Dropdown */}
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-outline gap-2 hover:btn-primary hover:border-primary transition-all duration-300 min-w-fit"
                >
                  {getSortIcon()}
                  <span className="hidden sm:inline">{getSortLabel()}</span>
                  <ChevronDown className="w-4 h-4" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-52 mt-2 border border-base-300"
                >
                  <li>
                    <button
                      onClick={() => setSortOrder("newest")}
                      className={`${sortOrder === "newest" ? "active bg-primary text-primary-content" : "hover:bg-base-200"} transition-colors duration-200`}
                    >
                      <SortDesc className="w-4 h-4" />
                      Newest First
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortOrder("oldest")}
                      className={`${sortOrder === "oldest" ? "active bg-primary text-primary-content" : "hover:bg-base-200"} transition-colors duration-200`}
                    >
                      <SortAsc className="w-4 h-4" />
                      Oldest First
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortOrder("name")}
                      className={`${sortOrder === "name" ? "active bg-primary text-primary-content" : "hover:bg-base-200"} transition-colors duration-200`}
                    >
                      <Calendar className="w-4 h-4" />
                      By Name
                    </button>
                  </li>
                </ul>
              </div>

              {/* View Mode Toggle */}
              <div className="btn-group">
                <button
                  className={`btn btn-sm transition-all duration-300 ${
                    viewMode === "grid" ? "btn-primary shadow-md" : "btn-outline hover:btn-primary hover:border-primary"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  className={`btn btn-sm transition-all duration-300 ${
                    viewMode === "list" ? "btn-primary shadow-md" : "btn-outline hover:btn-primary hover:border-primary"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {searchTerm && (
              <motion.div
                className="flex flex-wrap gap-2 mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="badge badge-primary gap-2 p-3">
                  <Search className="w-3 h-3" />
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="btn btn-ghost btn-xs btn-circle hover:bg-primary-focus transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <p className="text-base-content/70">
            {searchTerm ? `Found ${sortedCVs.length} of ${cvList.length} CVs` : `Showing ${sortedCVs.length} CVs`}
          </p>
        </div>
      </motion.div>

      {/* CV Grid/List */}
      <AnimatePresence mode="wait">
        {sortedCVs.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
          >
            {sortedCVs.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                {viewMode === "grid" ? (
                  <div className="card bg-base-100 shadow-lg hover:shadow-xl border border-base-300 transition-all duration-300 group-hover:border-primary/30">
                    <CVPreview cv={item} onEdit={handleEdit} onDelete={handleDelete} />
                  </div>
                ) : (
                  <div className="card bg-base-100 shadow-lg hover:shadow-xl border border-base-300 transition-all duration-300 group-hover:border-primary/30">
                    <div className="card-body p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="card-title text-lg text-base-content group-hover:text-primary transition-colors duration-300">
                            {item.name || "Untitled CV"}
                          </h3>
                          <p className="text-base-content/70 text-sm">{item.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
                            <span>Created: {formatDate(item.createdAt)}</span>
                            {item.updatedAt !== item.createdAt && <span>Updated: {formatDate(item.updatedAt)}</span>}
                          </div>
                          {item.skills && item.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.skills.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="badge badge-outline badge-sm hover:badge-primary transition-colors duration-200"
                                >
                                  {skill}
                                </span>
                              ))}
                              {item.skills.length > 3 && (
                                <span className="badge badge-ghost badge-sm">+{item.skills.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn btn-sm btn-outline hover:btn-primary hover:border-primary hover:scale-105 transition-all duration-300 gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="btn btn-sm btn-outline btn-error hover:btn-error hover:scale-105 transition-all duration-300 gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
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
            transition={{ duration: 0.4 }}
            className="card bg-base-100 shadow-lg border border-base-300"
          >
            <div className="card-body text-center py-16">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <FileText className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-base-content">
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
                  className="btn btn-outline hover:btn-primary hover:border-primary transition-all duration-300"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={openModal}
                  className="btn btn-primary gap-2 hover:btn-primary-focus hover:scale-105 transition-all duration-300"
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
                <Dialog.Panel className="w-full max-w-6xl rounded-2xl bg-base-100 shadow-2xl border border-base-300 relative">
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 btn btn-sm btn-circle btn-ghost hover:btn-error hover:text-error-content transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <CVForm initialData={editData} onClose={closeModal} onSuccess={closeModal} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setDeleteConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-2xl border border-base-300">
                  <Dialog.Title className="text-lg font-semibold text-error mb-4">
                    Delete CV Confirmation
                  </Dialog.Title>
                  <p className="text-base-content mb-6">
                    Kya aap waqai is CV ko delete karna chahte hain:{" "}
                    <strong>{selectedCV?.name || "Untitled CV"}</strong>? Yeh action wapas nahi liya ja sakta.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setDeleteConfirmOpen(false);
                        setSelectedCV(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default CVList
