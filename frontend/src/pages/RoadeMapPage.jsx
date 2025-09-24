"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import useRoadMap from "../hooks/useRoadMap"
import useAuthUser from "../hooks/useAuthUser"

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

  const { createRoadmapMutation, getRoadmapQuery, deleteRoadmapMutation, queryClient } = useRoadMap()

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <div className="text-center space-y-4">
          <p className="text-error font-medium">Authentication Required</p>
          <p className="text-base-content/60">You need to be logged in to view this page.</p>
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
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return filtered
  }, [getRoadmapQuery.data, searchQuery, sortBy, levelFilter])

  if (getRoadmapQuery.isLoading || createRoadmapMutation.isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <div className="text-center space-y-6">
          <motion.div
            className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-lg font-medium text-base-content">Processing your request...</p>
        </div>
      </div>
    )
  }

  if (getRoadmapQuery.error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <h3 className="text-xl font-semibold text-error">Something went wrong</h3>
          <p className="text-base-content/60">Error fetching roadmaps: {getRoadmapQuery.error.message}</p>
          <button onClick={() => queryClient.invalidateQueries(["roadmap"])} className="btn btn-primary btn-wide">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const roadmaps = Array.isArray(getRoadmapQuery.data) ? getRoadmapQuery.data.filter((r) => r && typeof r === 'object' && r.goal) : []

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
            <h1 className="text-4xl md:text-5xl font-bold text-base-content">Your Learning Roadmaps</h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Create personalized learning paths and track your progress towards your goals
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-8 border border-base-300/50">
            <h2 className="text-2xl font-semibold text-base-content mb-6 text-center">Create New Roadmap</h2>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Enter your learning goal (e.g., Become a DevOps Pro, Master React Development)"
                    className="input input-bordered w-full h-14 px-6 text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 bg-base-100/80 backdrop-blur-sm border-base-300/50 placeholder-base-content/40"
                    aria-label="Enter your learning goal"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <svg className="w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={createRoadmapMutation.isPending}
                  className="btn btn-primary w-full h-14 text-lg rounded-xl disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {createRoadmapMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creating Your Roadmap...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Roadmap
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {roadmaps.length > 0 && (
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
                  placeholder="Search roadmaps by goal or level..."
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
                <span className="text-sm font-medium text-base-content/70 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select select-bordered h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 bg-base-100/80 backdrop-blur-sm border-base-300/50 min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="level">By Level</option>
                </select>
              </div>

              <div className="text-sm text-base-content/60 whitespace-nowrap">
                {filteredAndSortedRoadmaps.length} of {roadmaps.length} roadmaps
              </div>
            </div>
          </motion.div>
        )}

        {filteredAndSortedRoadmaps.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredAndSortedRoadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap._id}
                className="group bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300/50 overflow-hidden cursor-pointer backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => openModal(roadmap)}>
                      <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors duration-200">
                        Roadmap {roadmaps.length > 1 ? `#${roadmaps.findIndex((r) => r._id === roadmap._id) + 1}` : ""}
                      </h3>
                      <p className="text-sm text-base-content/60 mt-1">
                        Created {new Date(roadmap.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        className="btn btn-sm btn-ghost p-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(roadmap)
                        }}
                        aria-label="Roadmap options"
                      >
                        <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v.01M12 12v.01M12 18v.01"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2" onClick={() => openModal(roadmap)}>
                    <p className="text-base-content/70 font-medium">Goal:</p>
                    <p className="text-base-content line-clamp-2">{roadmap.goal}</p>
                  </div>

                  <div className="flex items-center justify-between" onClick={() => openModal(roadmap)}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-base-content/70">Level:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          roadmap.level?.toLowerCase() === "beginner"
                            ? "bg-success/20 text-success"
                            : roadmap.level?.toLowerCase() === "intermediate"
                              ? "bg-warning/20 text-warning"
                              : roadmap.level?.toLowerCase() === "advanced"
                                ? "bg-error/20 text-error"
                                : "bg-base-300 text-base-content"
                        }`}
                      >
                        {roadmap.level || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
                      View Details
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {roadmap.weeks && roadmap.weeks.length > 0 && (
                    <div className="pt-4 border-t border-base-300/50" onClick={() => openModal(roadmap)}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/70">Duration:</span>
                        <span className="font-medium text-base-content">{roadmap.weeks.length} weeks</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : roadmaps.length > 0 ? (
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
            <h3 className="text-xl font-semibold text-base-content mb-2">No roadmaps found</h3>
            <p className="text-base-content/60 mb-6">
              No roadmaps match your search criteria. Try adjusting your search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSortBy("newest")
              }}
              className="btn btn-outline btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-base-content mb-3">Start Your Learning Journey</h3>
            <p className="text-base-content/60 max-w-md mx-auto mb-8">
              Create your first roadmap to begin your personalized learning experience. Set your goals and let us guide
              you through your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.querySelector('input[type="text"]')?.focus()}
                className="btn btn-primary btn-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Roadmap
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedRoadmap && (
          <motion.div
            className="modal modal-open fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-base-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-8 py-6 border-b border-base-300/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-base-content mb-2">Roadmap Details</h2>
                    <div className="flex items-center gap-4 text-sm text-base-content/70">
                      <span>Created {new Date(selectedRoadmap.createdAt).toLocaleDateString()}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedRoadmap.level?.toLowerCase() === "beginner"
                            ? "bg-success/20 text-success"
                            : selectedRoadmap.level?.toLowerCase() === "intermediate"
                              ? "bg-warning/20 text-warning"
                              : selectedRoadmap.level?.toLowerCase() === "advanced"
                                ? "bg-error/20 text-error"
                                : "bg-base-300 text-base-content"
                        }`}
                      >
                        {selectedRoadmap.level || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-base-content mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Learning Goal
                  </h3>
                  <div className="bg-base-200/50 rounded-xl p-4">
                    <p className="text-base-content leading-relaxed">{selectedRoadmap.goal}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-base-content mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Weekly Learning Plan
                    {selectedRoadmap.weeks && selectedRoadmap.weeks.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-base-content/60">
                        ({selectedRoadmap.weeks.length} weeks)
                      </span>
                    )}
                  </h3>

                  {selectedRoadmap.weeks && selectedRoadmap.weeks.length > 0 ? (
                    <div className="space-y-4">
                      {selectedRoadmap.weeks.map((week, index) => (
                        <motion.div
                          key={week._id}
                          className="bg-base-200/30 rounded-xl border border-base-300/50 overflow-hidden"
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
                              <h4 className="text-lg font-medium text-base-content flex items-center">
                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-sm font-semibold text-primary">{week.week}</span>
                                </div>
                                Week {week.week}
                              </h4>
                              <motion.div
                                animate={{ rotate: expandedWeeks[week._id] ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-base-content/60"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
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
                                className="border-t border-base-300/50"
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
                      <div className="w-16 h-16 mx-auto bg-base-200 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-base-content/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-base-content/60">No weekly plan available for this roadmap.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && roadmapToDelete && (
          <motion.div
            className="modal modal-open fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDeleteModal}
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
                <h2 className="text-xl font-bold text-base-content mb-4">Delete Roadmap</h2>
                <p className="text-base-content/70 mb-6">
                  Are you sure you want to delete the roadmap "<span className="font-medium">{roadmapToDelete.goal}</span>"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={closeDeleteModal}
                    className="btn btn-ghost"
                    disabled={deleteRoadmapMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-error"
                    disabled={deleteRoadmapMutation.isPending}
                  >
                    {deleteRoadmapMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      "Delete"
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