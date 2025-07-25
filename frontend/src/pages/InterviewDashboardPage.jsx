"use client"
import { useState } from "react"
import { useNavigate } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useGetInterviews } from "../hooks/useInterview"
import InterviewCard from "../components/InterviewCard"

const InterviewDashboardPage = () => {
  const navigate = useNavigate()
  const { authUser } = useAuthUser()
  const { data: interviews, isLoading } = useGetInterviews(authUser?._id)

  const [selectedInterview, setSelectedInterview] = useState(null)

  const openModal = (interview) => {
    setSelectedInterview(interview)
  }

  const closeModal = () => {
    setSelectedInterview(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">🎯 Interview Dashboard</h1>
          <p className="text-base-content/70 mt-2">Manage and track your technical interviews</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/create-interview")}>
          ➕ New Interview
        </button>
      </div>

      {interviews?.data?.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🎤</div>
          <h3 className="text-2xl font-bold mb-4">No interviews yet</h3>
          <p className="text-base-content/70 mb-8 max-w-md mx-auto">
            Start your first AI-powered interview to practice your technical skills and get instant feedback.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/create-interview")}>
            🚀 Create Your First Interview
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews?.data?.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} onViewDetails={openModal} />
          ))}
        </div>
      )}

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl">📋 Interview Details</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold text-lg mb-2">📚 Topic</h4>
                    <p className="text-xl">{selectedInterview.topic}</p>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold text-lg mb-2">📊 Level</h4>
                    <div className="badge badge-lg capitalize">{selectedInterview.level}</div>
                  </div>
                </div>
              </div>

              {/* Status and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold mb-2">🔄 Status</h4>
                    <div
                      className={`badge badge-lg ${
                        selectedInterview.status === "pending"
                          ? "badge-warning"
                          : selectedInterview.status === "running"
                            ? "badge-success"
                            : selectedInterview.status === "ended"
                              ? "badge-neutral"
                              : "badge-ghost"
                      }`}
                    >
                      {selectedInterview.status}
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold mb-2">⏱️ Duration</h4>
                    <p className="text-lg">{selectedInterview.duration} minutes</p>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold mb-2">📅 Created</h4>
                    <p className="text-sm">{new Date(selectedInterview.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs opacity-70">{new Date(selectedInterview.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="font-bold text-lg mb-4">📈 Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-sm opacity-70">{new Date(selectedInterview.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {selectedInterview.startedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <div>
                          <p className="font-medium">Started</p>
                          <p className="text-sm opacity-70">{new Date(selectedInterview.startedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {selectedInterview.endedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-neutral rounded-full"></div>
                        <div>
                          <p className="font-medium">Completed</p>
                          <p className="text-sm opacity-70">{new Date(selectedInterview.endedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedInterview.description && (
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h4 className="font-bold text-lg mb-2">📝 Description</h4>
                    <p>{selectedInterview.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-action">
              <button className="btn btn-outline" onClick={closeModal}>
                Close
              </button>
              {selectedInterview.status === "pending" && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    closeModal()
                    navigate(`/interview/${selectedInterview._id}`)
                  }}
                >
                  🎯 Start Interview
                </button>
              )}
              {selectedInterview.status === "running" && (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    closeModal()
                    navigate(`/interview/${selectedInterview._id}`)
                  }}
                >
                  🔴 Continue Live
                </button>
              )}
              {selectedInterview.status === "ended" && (
                <button
                  className="btn btn-info"
                  onClick={() => {
                    closeModal()
                    navigate(`/result/${selectedInterview._id}`)
                  }}
                >
                  📊 View Results
                </button>
              )}
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
    </div>
  )
}

export default InterviewDashboardPage
