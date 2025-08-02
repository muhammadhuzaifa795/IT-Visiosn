// "use client"

// import { useNavigate } from "react-router"

// const InterviewCard = ({ interview, onViewDetails }) => {
//   const navigate = useNavigate()

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: { class: "badge-warning", emoji: "⏳", text: "Pending" },
//       running: { class: "badge-success", emoji: "🔴", text: "Live" },
//       ended: { class: "badge-neutral", emoji: "✅", text: "Completed" },
//     }
//     return badges[status] || badges.pending
//   }

//   const getLevelColor = (level) => {
//     const colors = {
//       beginner: "border-l-success",
//       intermediate: "border-l-warning",
//       advanced: "border-l-error",
//     }
//     return colors[level] || "border-l-neutral"
//   }

//   const statusInfo = getStatusBadge(interview.status)

//   return (
//     <div
//       className={`card bg-base-100 shadow-xl border-l-4 ${getLevelColor(interview.level)} hover:shadow-2xl transition-shadow`}
//     >
//       <div className="card-body">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="card-title text-lg">{interview.topic}</h2>
//           <div className={`badge ${statusInfo.class}`}>
//             {statusInfo.emoji} {statusInfo.text}
//           </div>
//         </div>

//         <div className="space-y-3 mb-4">
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-base-content/70">📊 Level:</span>
//             <span className="badge badge-outline capitalize">{interview.level}</span>
//           </div>

//           <div className="flex justify-between items-center">
//             <span className="text-sm text-base-content/70">⏱️ Duration:</span>
//             <span className="text-sm font-medium">{interview.duration} minutes</span>
//           </div>

//           <div className="flex justify-between items-center">
//             <span className="text-sm text-base-content/70">📅 Created:</span>
//             <span className="text-sm">{new Date(interview.createdAt).toLocaleDateString()}</span>
//           </div>

//           {interview.startedAt && (
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-base-content/70">🚀 Started:</span>
//               <span className="text-sm">{new Date(interview.startedAt).toLocaleDateString()}</span>
//             </div>
//           )}
//         </div>

//         <div className="card-actions justify-end">
//           <button className="btn btn-outline btn-sm" onClick={() => onViewDetails(interview)}>
//             👁️ Details
//           </button>
//           {interview.status === "pending" && (
//             <button className="btn btn-primary btn-sm" onClick={() => navigate(`/interview/${interview._id}`)}>
//               🎯 Start Interview
//             </button>
//           )}
//           {interview.status === "running" && (
//             <button className="btn btn-success btn-sm" onClick={() => navigate(`/interview/${interview._id}`)}>
//               🔴 Continue Live
//             </button>
//           )}
//           {interview.status === "ended" && (
//             <button className="btn btn-outline btn-sm" onClick={() => navigate(`/result/${interview._id}`)}>
//               📊 View Results
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default InterviewCard






"use client"

import { useNavigate } from "react-router" // Import useNavigate
import { MoreVertical, Trash2 } from "lucide-react" // Import icons
import { motion } from "framer-motion" // Keep motion for animations
import { useState, useRef, useEffect } from "react" // Import useState, useRef, useEffect for custom dropdown

const InterviewCard = ({ interview, onViewDetails, onDeleteClick }) => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "badge-warning", emoji: "⏳", text: "Pending" },
      running: { class: "badge-success", emoji: "🔴", text: "Live" },
      ended: { class: "badge-neutral", emoji: "✅", text: "Completed" },
    }
    return badges[status] || badges.pending
  }

  const getLevelColor = (level) => {
    const colors = {
      beginner: "border-l-success",
      intermediate: "border-l-warning",
      advanced: "border-l-error",
    }
    return colors[level] || "border-l-neutral"
  }

  const statusInfo = getStatusBadge(interview.status)

  return (
    <motion.div
      className={`card bg-base-100 shadow-xl border-l-4 ${getLevelColor(interview.level)} hover:shadow-2xl transition-shadow relative group`}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="card-body py-8 px-6">
        {/* Custom Dropdown Menu for Actions */}
        <div className="absolute top-2 right-4 z-10" ref={dropdownRef}>
          <button
            tabIndex={0}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Interview options"
            onClick={(e) => {
              e.stopPropagation() // Crucial: Stop propagation for the dropdown button click
              setIsDropdownOpen(!isDropdownOpen)
            }}
          >
            <MoreVertical className="w-5 h-5 text-base-content/60 group-hover:text-primary transition-colors" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-box bg-base-100 shadow-lg border border-base-300 z-20 py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation() // Crucial: Stop propagation for the delete button click
                  onDeleteClick(interview)
                  setIsDropdownOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-error cursor-pointer hover:bg-base-200 transition-colors duration-200"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
        {/* Content area - now with its own click handler and whileTap animation */}
        <motion.div
          onClick={() => onViewDetails(interview)}
          className="cursor-pointer" // Add cursor-pointer to indicate clickability
          whileTap={{ scale: 0.98 }} // Apply whileTap here
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="card-title text-lg">{interview.topic}</h2>
            <div className={`badge ${statusInfo.class}`}>
              {statusInfo.emoji} {statusInfo.text}
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">📊 Level:</span>
              <span className="badge badge-outline capitalize">{interview.level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">⏱️ Duration:</span>
              <span className="text-sm font-medium">{interview.duration} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">📅 Created:</span>
              <span className="text-sm">{new Date(interview.createdAt).toLocaleDateString()}</span>
            </div>
            {interview.startedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-base-content/70">🚀 Started:</span>
                <span className="text-sm">{new Date(interview.startedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </motion.div>
        <div className="card-actions justify-end">
          {/* Removed the explicit "Details" button as the entire card body now opens details */}
          {interview.status === "pending" && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/interview/${interview._id}`)}>
              🎯 Start Interview
            </button>
          )}
          {interview.status === "running" && (
            <button className="btn btn-success btn-sm" onClick={() => navigate(`/interview/${interview._id}`)}>
              🔴 Continue Live
            </button>
          )}
          {interview.status === "ended" && (
            <>
           <div className="flex items-center gap-x-2">
  <button
    className="btn btn-outline btn-sm"
    onClick={() => navigate(`/result/${interview._id}`)}
  >
    📊 View Results
  </button>
  
  <button
    className="btn btn-outline btn-sm"
    onClick={(e) => {
      e.stopPropagation(); // Prevent the card's click handler from also firing
      onViewDetails(interview); // Call the prop to open the modal
    }}
  >
    👁️ View Detail
  </button>
</div>

            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default InterviewCard



