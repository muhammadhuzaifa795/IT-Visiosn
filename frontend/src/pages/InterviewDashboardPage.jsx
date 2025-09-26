"use client"

import { useState, useMemo, Fragment } from "react"
import { useNavigate } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useGetInterviews, useDeleteInterview } from "../hooks/useInterview"
import InterviewCard from "../components/InterviewCard"
import { Toaster, toast } from "react-hot-toast"
import { Dialog, Transition } from "@headlessui/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  SortAscIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  TrendingUpIcon,
  PlayIcon,
  FileTextIcon,
  Trash2Icon,
  XIcon,
  EyeIcon,
  AwardIcon,
  BrainIcon,
  ZapIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserIcon,
  LoaderIcon,
  AlertCircleIcon,
  ChevronDownIcon
} from "lucide-react"

const InterviewDashboardPage = () => {
  const navigate = useNavigate()
  const { authUser } = useAuthUser()
  const { data: interviews, isLoading } = useGetInterviews(authUser?._id)
  const { deleteInterviewMutation, isPending: isDeleting } = useDeleteInterview()
  
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(12)
  const [sortBy, setSortBy] = useState("newest")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  const filteredInterviews = useMemo(() => {
    if (!interviews?.data) return []
    
    let filtered = interviews.data.filter(interview =>
      interview.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(interview => interview.status === statusFilter)
    }

    // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter(interview => interview.level === levelFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "topic":
          return a.topic.localeCompare(b.topic)
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return filtered
  }, [interviews, searchTerm, sortBy, statusFilter, levelFilter])

  const openModal = (interview) => {
    setSelectedInterview(interview)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedInterview(null)
    setIsModalOpen(false)
  }

  const handleDeleteInterviewClick = (interview) => {
    setSelectedInterview(interview)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (selectedInterview) {
      deleteInterviewMutation(selectedInterview._id, {
        onSuccess: () => {
          toast.success("Interview deleted successfully!")
          setIsDeleteConfirmOpen(false)
          setSelectedInterview(null)
        },
        onError: (error) => {
          console.error("Error deleting interview:", error)
          toast.error("Failed to delete interview. Please try again.")
          setIsDeleteConfirmOpen(false)
          setSelectedInterview(null)
        },
      })
    }
  }

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 12)
  }

  const handleShowLess = () => {
    setVisibleCount(12)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ended": return "badge-success"
      case "running": return "badge-warning"
      case "pending": return "badge-info"
      default: return "badge-neutral"
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "advanced": return "badge-error"
      case "intermediate": return "badge-warning"
      case "beginner": return "badge-success"
      default: return "badge-neutral"
    }
  }

  const stats = {
    total: interviews?.data?.length || 0,
    completed: interviews?.data?.filter(i => i.status === "ended").length || 0,
    pending: interviews?.data?.filter(i => i.status === "pending").length || 0,
    running: interviews?.data?.filter(i => i.status === "running").length || 0,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto"
          >
            <BrainIcon className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-2">Loading Interviews</h2>
            <p className="text-base-content/60">Preparing your interview dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 border-b border-base-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-6">
              <BrainIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Interview Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              AI-Powered Interview Practice
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Master your technical interview skills with personalized practice sessions and instant feedback
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileTextIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="stat-value text-2xl font-bold text-base-content">{stats.total}</div>
              <div className="stat-title text-base-content/70">Total Interviews</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AwardIcon className="w-6 h-6 text-success" />
              </div>
              <div className="stat-value text-2xl font-bold text-base-content">{stats.completed}</div>
              <div className="stat-title text-base-content/70">Completed</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ClockIcon className="w-6 h-6 text-warning" />
              </div>
              <div className="stat-value text-2xl font-bold text-base-content">{stats.pending}</div>
              <div className="stat-title text-base-content/70">Pending</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUpIcon className="w-6 h-6 text-info" />
              </div>
              <div className="stat-value text-2xl font-bold text-base-content">{stats.running}</div>
              <div className="stat-title text-base-content/70">In Progress</div>
            </div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search interviews by topic or description..."
                  className="input input-bordered w-full pl-12 pr-4 h-12 rounded-xl border-base-300/50 bg-base-100 focus:bg-base-50 transition-all duration-200 placeholder-base-content/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors duration-200"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-outline h-12 gap-2">
                    <FilterIcon className="w-4 h-4" />
                    Status
                    <ChevronDownIcon className="w-4 h-4" />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 z-10">
                    <li><button onClick={() => setStatusFilter("all")} className={statusFilter === "all" ? "active" : ""}>All Status</button></li>
                    <li><button onClick={() => setStatusFilter("pending")} className={statusFilter === "pending" ? "active" : ""}>Pending</button></li>
                    <li><button onClick={() => setStatusFilter("running")} className={statusFilter === "running" ? "active" : ""}>In Progress</button></li>
                    <li><button onClick={() => setStatusFilter("ended")} className={statusFilter === "ended" ? "active" : ""}>Completed</button></li>
                  </ul>
                </div>

                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-outline h-12 gap-2">
                    <SortAscIcon className="w-4 h-4" />
                    Sort
                    <ChevronDownIcon className="w-4 h-4" />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 z-10">
                    <li><button onClick={() => setSortBy("newest")} className={sortBy === "newest" ? "active" : ""}>Newest First</button></li>
                    <li><button onClick={() => setSortBy("oldest")} className={sortBy === "oldest" ? "active" : ""}>Oldest First</button></li>
                    <li><button onClick={() => setSortBy("topic")} className={sortBy === "topic" ? "active" : ""}>By Topic</button></li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/create-interview")}
            >
              <PlusIcon className="w-5 h-5" />
              New Interview
            </button>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-base-content/60">
              Showing {Math.min(visibleCount, filteredInterviews.length)} of {filteredInterviews.length} interviews
            </div>
            {filteredInterviews.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setLevelFilter("all")}
                  className={`btn btn-xs ${levelFilter === "all" ? "btn-primary" : "btn-ghost"}`}
                >
                  All Levels
                </button>
                <button
                  onClick={() => setLevelFilter("beginner")}
                  className={`btn btn-xs ${levelFilter === "beginner" ? "btn-success" : "btn-ghost"}`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setLevelFilter("intermediate")}
                  className={`btn btn-xs ${levelFilter === "intermediate" ? "btn-warning" : "btn-ghost"}`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setLevelFilter("advanced")}
                  className={`btn btn-xs ${levelFilter === "advanced" ? "btn-error" : "btn-ghost"}`}
                >
                  Advanced
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Interviews Grid */}
        {filteredInterviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto bg-base-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <BookOpenIcon className="w-16 h-16 text-base-content/30" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-3">No interviews found</h3>
            <p className="text-base-content/60 max-w-md mx-auto mb-8">
              {searchTerm || statusFilter !== "all" || levelFilter !== "all" 
                ? "No interviews match your current filters. Try adjusting your search criteria."
                : "Start your first AI-powered interview to practice your technical skills and get instant feedback."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn btn-primary gap-3"
                onClick={() => navigate("/create-interview")}
              >
                <ZapIcon className="w-5 h-5" />
                Create Your First Interview
              </button>
              {(searchTerm || statusFilter !== "all" || levelFilter !== "all") && (
                <button 
                  className="btn btn-outline gap-3"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setLevelFilter("all")
                  }}
                >
                  <XIcon className="w-5 h-5" />
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredInterviews.slice(0, visibleCount).map((interview, index) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  onViewDetails={openModal}
                  onDeleteClick={handleDeleteInterviewClick}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Load More Button */}
            {filteredInterviews.length > 12 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-4 mt-12"
              >
                {visibleCount < filteredInterviews.length && (
                  <button className="btn btn-primary gap-3" onClick={handleShowMore}>
                    <PlusIcon className="w-5 h-5" />
                    Load More Interviews
                  </button>
                )}
                {visibleCount > 12 && (
                  <button className="btn btn-outline gap-3" onClick={handleShowLess}>
                    Show Less
                  </button>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Interview Details Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
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
                <Dialog.Panel className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl bg-base-100 transform transition-all">
                  <div className="flex justify-between items-center p-6 border-b border-base-300/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileTextIcon className="w-6 h-6 text-primary" />
                      </div>
                      <Dialog.Title className="text-2xl font-bold text-base-content">
                        Interview Details
                      </Dialog.Title>
                    </div>
                    <button 
                      className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
                      onClick={closeModal}
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {selectedInterview && (
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="card bg-base-200/50 border border-base-300/30">
                            <div className="card-body">
                              <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                                <TargetIcon className="w-5 h-5 text-primary" />
                                Topic
                              </h4>
                              <p className="text-lg font-medium text-base-content">{selectedInterview.topic}</p>
                            </div>
                          </div>

                          <div className="card bg-base-200/50 border border-base-300/30">
                            <div className="card-body">
                              <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5 text-secondary" />
                                Level & Status
                              </h4>
                              <div className="flex gap-2">
                                <span className={`badge badge-lg capitalize ${getLevelColor(selectedInterview.level)}`}>
                                  {selectedInterview.level}
                                </span>
                                <span className={`badge badge-lg capitalize ${getStatusColor(selectedInterview.status)}`}>
                                  {selectedInterview.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="card bg-base-200/50 border border-base-300/30">
                            <div className="card-body text-center p-4">
                              <ClockIcon className="w-8 h-8 text-info mx-auto mb-2" />
                              <div className="text-sm text-base-content/70">Duration</div>
                              <div className="font-semibold text-base-content">{selectedInterview.duration} minutes</div>
                            </div>
                          </div>

                          <div className="card bg-base-200/50 border border-base-300/30">
                            <div className="card-body text-center p-4">
                              <CalendarIcon className="w-8 h-8 text-warning mx-auto mb-2" />
                              <div className="text-sm text-base-content/70">Created</div>
                              <div className="font-semibold text-base-content text-sm">
                                {new Date(selectedInterview.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="card bg-base-200/50 border border-base-300/30">
                            <div className="card-body text-center p-4">
                              <UserIcon className="w-8 h-8 text-success mx-auto mb-2" />
                              <div className="text-sm text-base-content/70">Questions</div>
                              <div className="font-semibold text-base-content">
                                {selectedInterview.questions?.length || 0}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {selectedInterview.description && (
                          <div className="card bg-base-200/50 border border-base-300/30">
                            <div className="card-body">
                              <h4 className="font-semibold text-base-content mb-3">Description</h4>
                              <p className="text-base-content/80 leading-relaxed">{selectedInterview.description}</p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-base-300/30">
                          <button className="btn btn-ghost" onClick={closeModal}>
                            Close
                          </button>
                          {selectedInterview.status === "pending" && (
                            <button
                              className="btn btn-primary gap-3"
                              onClick={() => {
                                closeModal()
                                navigate(`/interview/${selectedInterview._id}`)
                              }}
                            >
                              <PlayIcon className="w-5 h-5" />
                              Start Interview
                            </button>
                          )}
                          {selectedInterview.status === "running" && (
                            <button
                              className="btn btn-warning gap-3"
                              onClick={() => {
                                closeModal()
                                navigate(`/interview/${selectedInterview._id}`)
                              }}
                            >
                              <ZapIcon className="w-5 h-5" />
                              Continue Interview
                            </button>
                          )}
                          {selectedInterview.status === "completed" && (
                            <button
                              className="btn btn-success gap-3"
                              onClick={() => {
                                closeModal()
                                navigate(`/result/${selectedInterview._id}`)
                              }}
                            >
                              <EyeIcon className="w-5 h-5" />
                              View Results
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="card bg-base-100 w-full max-w-md shadow-2xl border border-base-300/30">
                  <div className="card-body p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                        <Trash2Icon className="w-6 h-6 text-error" />
                      </div>
                      <div>
                        <Dialog.Title className="text-lg font-bold text-base-content">
                          Delete Interview
                        </Dialog.Title>
                        <p className="text-base-content/60 text-sm">This action cannot be undone</p>
                      </div>
                    </div>
                    
                    <p className="text-base-content/70 mb-6">
                      Are you sure you want to delete the interview "
                      <strong>{selectedInterview?.topic || "Untitled Interview"}</strong>"?
                    </p>
                    
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="btn btn-ghost"
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmDelete} 
                        className="btn btn-error gap-2"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <LoaderIcon className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2Icon className="w-4 h-4" />
                            Delete Interview
                          </>
                        )}
                      </button>
                    </div>
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

export default InterviewDashboardPage