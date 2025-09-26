"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import useRoadMap from "../hooks/useRoadMap"
import useAuthUser from "../hooks/useAuthUser"
import {
  SearchIcon,
  FilterIcon,
  SortAscIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
  CalendarIcon,
  TargetIcon,
  ClockIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  TrendingUpIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SettingsIcon,
  DownloadIcon,
  ShareIcon
} from "lucide-react"

const RoadmapPage = () => {
  const { authUser } = useAuthUser()
  const [goal, setGoal] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [selectedRoadmap, setSelectedRoadmap] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedWeeks, setExpandedWeeks] = useState({})
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [roadmapToDelete, setRoadmapToDelete] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { createRoadmapMutation, getRoadmapQuery, deleteRoadmapMutation, queryClient } = useRoadMap()

  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-error/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircleIcon className="w-10 h-10 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-3">Authentication Required</h2>
          <p className="text-base-content/60 mb-6">
            You need to be logged in to access your learning roadmaps.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="btn btn-primary gap-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!goal.trim()) {
      toast.error("Please enter a valid goal.")
      return
    }
    if (!authUser?._id) {
      toast.error("User authentication failed. Please log in again.")
      return
    }

    const payload = {
      data: {
        text: goal,
        userId: authUser._id,
      },
    }

    createRoadmapMutation.mutate(payload, {
      onSuccess: (newRoadmap) => {
        setSubmitted(true)
        setGoal("")
        toast.success("Roadmap created successfully!")
        queryClient.setQueryData(["roadmap"], (oldData) => {
          if (!newRoadmap || !newRoadmap.goal) {
            return Array.isArray(oldData) ? oldData : []
          }
          const updatedData = Array.isArray(oldData) ? [...oldData, newRoadmap] : [newRoadmap]
          return updatedData
        })
      },
      onError: (error) => {
        toast.error(`Failed to create roadmap: ${error.response?.data?.message || "Please try again."}`)
      },
    })
  }

  const handleDelete = (roadmap) => {
    setRoadmapToDelete(roadmap)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!roadmapToDelete?._id) return
    deleteRoadmapMutation.mutate(roadmapToDelete._id, {
      onSuccess: () => {
        toast.success("Roadmap deleted successfully!")
        queryClient.setQueryData(["roadmap"], (oldData) => {
          if (!Array.isArray(oldData)) return []
          return oldData.filter((r) => r && r._id !== roadmapToDelete._id)
        })
        setIsDeleteModalOpen(false)
        setRoadmapToDelete(null)
      },
      onError: (error) => {
        toast.error(`Failed to delete roadmap: ${error.response?.data?.message || "Please try again."}`)
      },
    })
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  const toggleWeek = (weekId) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekId]: !prev[weekId],
    }))
  }

  const openModal = (roadmap) => {
    setSelectedRoadmap(roadmap)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRoadmap(null)
    setExpandedWeeks({})
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setRoadmapToDelete(null)
  }

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-success/20 text-success border-success/20"
      case "intermediate": return "bg-warning/20 text-warning border-warning/20"
      case "advanced": return "bg-error/20 text-error border-error/20"
      default: return "bg-base-300 text-base-content border-base-300"
    }
  }

  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "🌱"
      case "intermediate": return "🚀"
      case "advanced": return "🏆"
      default: return "📚"
    }
  }

  const calculateProgress = (roadmap) => {
    if (!roadmap.weeks || roadmap.weeks.length === 0) return 0
    const completedWeeks = roadmap.weeks.filter(week => week.completed).length
    return Math.round((completedWeeks / roadmap.weeks.length) * 100)
  }

  const filteredAndSortedRoadmaps = useMemo(() => {
    const roadmaps = Array.isArray(getRoadmapQuery.data) ? getRoadmapQuery.data : []

    let filtered = roadmaps.filter(
      (roadmap) =>
        roadmap &&
        typeof roadmap === 'object' &&
        roadmap.goal &&
        typeof roadmap.goal === 'string' &&
        (roadmap.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (roadmap.level && typeof roadmap.level === 'string' && roadmap.level.toLowerCase().includes(searchQuery.toLowerCase()))),
    )

    if (levelFilter !== "all") {
      filtered = filtered.filter((roadmap) => roadmap.level?.toLowerCase() === levelFilter)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "level":
          const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
          return (levelOrder[a.level?.toLowerCase()] || 0) - (levelOrder[b.level?.toLowerCase()] || 0)
        case "progress":
          return calculateProgress(b) - calculateProgress(a)
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return filtered
  }, [getRoadmapQuery.data, searchQuery, sortBy, levelFilter])

  if (getRoadmapQuery.isLoading || createRoadmapMutation.isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="text-center space-y-6">
          <div className="relative">
            <motion.div
              className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpenIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-lg font-medium text-base-content mb-2">Loading your roadmaps</p>
            <p className="text-base-content/60">Preparing your learning journey...</p>
          </div>
        </div>
      </div>
    )
  }

  if (getRoadmapQuery.error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 mx-auto bg-error/10 rounded-full flex items-center justify-center">
            <AlertCircleIcon className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-xl font-semibold text-error">Something went wrong</h3>
          <p className="text-base-content/60">We couldn't load your roadmaps. Please try again.</p>
          <button 
            onClick={() => queryClient.invalidateQueries(["roadmap"])} 
            className="btn btn-primary gap-2"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const roadmaps = Array.isArray(getRoadmapQuery.data) ? getRoadmapQuery.data.filter((r) => r && typeof r === 'object' && r.goal) : []

  return (
    <div className="min-h-screen bg-base-200">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 border-b border-base-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center space-y-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-4">
              <SparklesIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Learning Paths</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-base-content bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
              Your Learning Roadmaps
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Create personalized learning paths, track your progress, and achieve your goals with structured weekly plans
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Roadmap Card */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300/30 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PlusIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-base-content">Create New Roadmap</h2>
                  <p className="text-base-content/60">Start your learning journey with a clear goal</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content">What do you want to learn?</span>
                  </label>
                  <div className="relative">
                    <TargetIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g., Master React Development, Learn Data Science, Become a DevOps Engineer"
                      className="input input-bordered w-full h-14 pl-12 pr-4 text-lg rounded-xl border-base-300/50 bg-base-200/50 focus:bg-base-100 transition-all duration-200 placeholder-base-content/40"
                      aria-label="Enter your learning goal"
                    />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={createRoadmapMutation.isPending || !goal.trim()}
                  className="btn btn-primary w-full h-14 text-lg rounded-xl disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 gap-3"
                  whileHover={{ scale: goal.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: goal.trim() ? 0.98 : 1 }}
                >
                  {createRoadmapMutation.isPending ? (
                    <>
                      <div className="loading loading-spinner loading-sm"></div>
                      Creating Roadmap...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      Create Learning Roadmap
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        {roadmaps.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <SearchIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isSearchFocused ? "text-primary" : "text-base-content/40"}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search roadmaps..."
                    className="input input-bordered w-full pl-12 pr-10 h-12 rounded-xl border-base-300/50 bg-base-200/50 focus:bg-base-100 transition-all duration-200 placeholder-base-content/40"
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

                {/* Filters */}
                <div className="flex gap-3">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-outline h-12 gap-2 rounded-xl">
                      <FilterIcon className="w-4 h-4" />
                      Level
                      <ChevronDownIcon className="w-4 h-4" />
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 z-10">
                      <li><button onClick={() => setLevelFilter("all")} className={levelFilter === "all" ? "active" : ""}>All Levels</button></li>
                      <li><button onClick={() => setLevelFilter("beginner")} className={levelFilter === "beginner" ? "active" : ""}>Beginner</button></li>
                      <li><button onClick={() => setLevelFilter("intermediate")} className={levelFilter === "intermediate" ? "active" : ""}>Intermediate</button></li>
                      <li><button onClick={() => setLevelFilter("advanced")} className={levelFilter === "advanced" ? "active" : ""}>Advanced</button></li>
                    </ul>
                  </div>

                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-outline h-12 gap-2 rounded-xl">
                      <SortAscIcon className="w-4 h-4" />
                      Sort
                      <ChevronDownIcon className="w-4 h-4" />
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 z-10">
                      <li><button onClick={() => setSortBy("newest")} className={sortBy === "newest" ? "active" : ""}>Newest First</button></li>
                      <li><button onClick={() => setSortBy("oldest")} className={sortBy === "oldest" ? "active" : ""}>Oldest First</button></li>
                      <li><button onClick={() => setSortBy("level")} className={sortBy === "level" ? "active" : ""}>By Level</button></li>
                      <li><button onClick={() => setSortBy("progress")} className={sortBy === "progress" ? "active" : ""}>By Progress</button></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-sm text-base-content/60 bg-base-200/50 rounded-full px-4 py-2">
                {filteredAndSortedRoadmaps.length} of {roadmaps.length} roadmaps
              </div>
            </div>
          </motion.div>
        )}

        {/* Roadmaps Grid */}
        {filteredAndSortedRoadmaps.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredAndSortedRoadmaps.map((roadmap, index) => {
              const progress = calculateProgress(roadmap)
              return (
                <motion.div
                  key={roadmap._id}
                  className="group bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300/30 overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getLevelColor(roadmap.level)}`}>
                          <span className="text-lg">{getLevelIcon(roadmap.level)}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">Roadmap</span>
                          <h3 className="text-lg font-semibold text-base-content line-clamp-1">
                            {roadmap.goal}
                          </h3>
                        </div>
                      </div>
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                          <SettingsIcon className="w-4 h-4" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 z-10">
                          <li><button onClick={() => openModal(roadmap)}><FileTextIcon className="w-4 h-4" />View Details</button></li>
                          <li><button><ShareIcon className="w-4 h-4" />Share</button></li>
                          <li><button><DownloadIcon className="w-4 h-4" />Export</button></li>
                          <li><button onClick={(e) => { e.stopPropagation(); handleDelete(roadmap); }} className="text-error"><Trash2Icon className="w-4 h-4" />Delete</button></li>
                        </ul>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-base-content/60">Progress</span>
                        <span className="font-medium text-base-content">{progress}%</span>
                      </div>
                      <div className="w-full bg-base-300/30 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-base-content/60">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{roadmap.weeks?.length || 0} weeks</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(roadmap.level)}`}>
                        {roadmap.level || "Not specified"}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => openModal(roadmap)}
                      className="btn btn-outline btn-sm w-full gap-2 hover:btn-primary transition-all duration-200"
                    >
                      <BookOpenIcon className="w-4 h-4" />
                      View Learning Plan
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : roadmaps.length > 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 mx-auto bg-base-200 rounded-full flex items-center justify-center mb-6">
              <SearchIcon className="w-10 h-10 text-base-content/40" />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-2">No roadmaps found</h3>
            <p className="text-base-content/60 mb-6 max-w-md mx-auto">
              No roadmaps match your search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setLevelFilter("all")
                setSortBy("newest")
              }}
              className="btn btn-outline btn-primary gap-2"
            >
              <FilterIcon className="w-4 h-4" />
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-8">
              <TrendingUpIcon className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-3">Start Your Learning Journey</h3>
            <p className="text-base-content/60 max-w-md mx-auto mb-8 leading-relaxed">
              Create your first roadmap to begin your personalized learning experience. Set clear goals and follow structured weekly plans to achieve success.
            </p>
            <button
              onClick={() => document.querySelector('input[type="text"]')?.focus()}
              className="btn btn-primary btn-lg gap-3"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Roadmap
            </button>
          </motion.div>
        )}
      </div>

      {/* Roadmap Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedRoadmap && (
          <motion.div
            className="modal modal-open fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-box max-w-4xl w-full max-h-[90vh] overflow-hidden p-0 bg-base-100 rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-base-300/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getLevelColor(selectedRoadmap.level)}`}>
                        <span className="text-xl">{getLevelIcon(selectedRoadmap.level)}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">{selectedRoadmap.goal}</h2>
                        <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
                          <span>Created {new Date(selectedRoadmap.createdAt).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedRoadmap.level)}`}>
                            {selectedRoadmap.level || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress in Header */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-base-content/60">Overall Progress</span>
                          <span className="font-semibold text-base-content">{calculateProgress(selectedRoadmap)}%</span>
                        </div>
                        <div className="w-full bg-base-300/30 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(selectedRoadmap)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors duration-200 ml-4"
                    aria-label="Close modal"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                {/* Weekly Plan */}
                <div>
                  <h3 className="text-lg font-semibold text-base-content mb-6 flex items-center gap-2">
                    <BookOpenIcon className="w-5 h-5 text-primary" />
                    Weekly Learning Plan
                    {selectedRoadmap.weeks && selectedRoadmap.weeks.length > 0 && (
                      <span className="text-sm font-normal text-base-content/60 ml-2">
                        ({selectedRoadmap.weeks.length} weeks total)
                      </span>
                    )}
                  </h3>

                  {selectedRoadmap.weeks && selectedRoadmap.weeks.length > 0 ? (
                    <div className="space-y-4">
                      {selectedRoadmap.weeks.map((week, index) => (
                        <motion.div
                          key={week._id}
                          className="bg-base-200/30 rounded-xl border border-base-300/30 overflow-hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <button
                            className="w-full px-6 py-4 text-left hover:bg-base-200/50 transition-colors duration-200 focus:outline-none focus:bg-base-200/50"
                            onClick={() => toggleWeek(week._id)}
                            aria-expanded={expandedWeeks[week._id]}
                            aria-controls={`week-${week._id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">{week.week}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-base-content">Week {week.week}</h4>
                                    {week.completed && (
                                      <span className="text-xs text-success flex items-center gap-1 mt-1">
                                        <CheckCircleIcon className="w-3 h-3" />
                                        Completed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <motion.div
                                animate={{ rotate: expandedWeeks[week._id] ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-base-content/60"
                              >
                                <ChevronDownIcon className="w-5 h-5" />
                              </motion.div>
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedWeeks[week._id] && (
                              <motion.div
                                id={`week-${week._id}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-base-300/30"
                              >
                                <div className="px-6 py-4">
                                  <ul className="space-y-3">
                                    {week.topics.map((topic, topicIndex) => (
                                      <motion.li
                                        key={topicIndex}
                                        className="flex items-start text-base-content/80"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: topicIndex * 0.05 }}
                                      >
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span className="leading-relaxed">{topic}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileTextIcon className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
                      <p className="text-base-content/60">No weekly plan available for this roadmap.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && roadmapToDelete && (
          <motion.div
            className="modal modal-open fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDeleteModal}
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
                    <AlertCircleIcon className="w-6 h-6 text-error" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">Delete Roadmap</h3>
                    <p className="text-base-content/60 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-base-content/70 mb-6">
                  Are you sure you want to delete the roadmap "<span className="font-medium text-base-content">{roadmapToDelete.goal}</span>"? All progress and data will be permanently removed.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeDeleteModal}
                    className="btn btn-ghost"
                    disabled={deleteRoadmapMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-error gap-2"
                    disabled={deleteRoadmapMutation.isPending}
                  >
                    {deleteRoadmapMutation.isPending ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2Icon className="w-4 h-4" />
                        Delete Roadmap
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RoadmapPage