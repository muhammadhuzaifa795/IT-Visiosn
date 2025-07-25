"use client"

import { useNavigate } from "react-router"

const InterviewCard = ({ interview, onViewDetails }) => {
  const navigate = useNavigate()

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
    <div
      className={`card bg-base-100 shadow-xl border-l-4 ${getLevelColor(interview.level)} hover:shadow-2xl transition-shadow`}
    >
      <div className="card-body">
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

        <div className="card-actions justify-end">
          <button className="btn btn-outline btn-sm" onClick={() => onViewDetails(interview)}>
            👁️ Details
          </button>
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
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/result/${interview._id}`)}>
              📊 View Results
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterviewCard
