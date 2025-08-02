// "use client"
// import { useState } from "react"
// import { useNavigate } from "react-router"
// import useAuthUser from "../hooks/useAuthUser"
// import { useGetInterviews } from "../hooks/useInterview"
// import InterviewCard from "../components/InterviewCard"

// const InterviewDashboardPage = () => {
//   const navigate = useNavigate()
//   const { authUser } = useAuthUser()
//   const { data: interviews, isLoading } = useGetInterviews(authUser?._id)

//   const [selectedInterview, setSelectedInterview] = useState(null)

//   const openModal = (interview) => {
//     setSelectedInterview(interview)
//   }

//   const closeModal = () => {
//     setSelectedInterview(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">🎯 Interview Dashboard</h1>
//           <p className="text-base-content/70 mt-2">Manage and track your technical interviews</p>
//         </div>
//         <button className="btn btn-primary btn-lg" onClick={() => navigate("/create-interview")}>
//           ➕ New Interview
//         </button>
//       </div>

//       {interviews?.data?.length === 0 ? (
//         <div className="text-center py-16">
//           <div className="text-8xl mb-6">🎤</div>
//           <h3 className="text-2xl font-bold mb-4">No interviews yet</h3>
//           <p className="text-base-content/70 mb-8 max-w-md mx-auto">
//             Start your first AI-powered interview to practice your technical skills and get instant feedback.
//           </p>
//           <button className="btn btn-primary btn-lg" onClick={() => navigate("/create-interview")}>
//             🚀 Create Your First Interview
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {interviews?.data?.map((interview) => (
//             <InterviewCard key={interview._id} interview={interview} onViewDetails={openModal} />
//           ))}
//         </div>
//       )}

//       {/* Interview Details Modal */}
//       {selectedInterview && (
//         <div className="modal modal-open">
//           <div className="modal-box max-w-4xl">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-2xl">📋 Interview Details</h3>
//               <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-6">
//               {/* Basic Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="card bg-base-200">
//                   <div className="card-body p-4">
//                     <h4 className="font-bold text-lg mb-2">📚 Topic</h4>
//                     <p className="text-xl">{selectedInterview.topic}</p>
//                   </div>
//                 </div>

//                 <div className="card bg-base-200">
//                   <div className="card-body p-4">
//                     <h4 className="font-bold text-lg mb-2">📊 Level</h4>
//                     <div className="badge badge-lg capitalize">{selectedInterview.level}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Status and Duration */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="card bg-base-200">
//                   <div className="card-body p-4">
//                     <h4 className="font-bold mb-2">🔄 Status</h4>
//                     <div
//                       className={`badge badge-lg ${
//                         selectedInterview.status === "pending"
//                           ? "badge-warning"
//                           : selectedInterview.status === "running"
//                             ? "badge-success"
//                             : selectedInterview.status === "ended"
//                               ? "badge-neutral"
//                               : "badge-ghost"
//                       }`}
//                     >
//                       {selectedInterview.status}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="card bg-base-200">
//                   <div className="card-body p-4">
//                     <h4 className="font-bold mb-2">⏱️ Duration</h4>
//                     <p className="text-lg">{selectedInterview.duration} minutes</p>
//                   </div>
//                 </div>

//                 <div className="card bg-base-200">
//                   <div className="card-body p-4">
//                     <h4 className="font-bold mb-2">📅 Created</h4>
//                     <p className="text-sm">{new Date(selectedInterview.createdAt).toLocaleDateString()}</p>
//                     <p className="text-xs opacity-70">{new Date(selectedInterview.createdAt).toLocaleTimeString()}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Timeline */}
//               <div className="card bg-base-200">
//                 <div className="card-body">
//                   <h4 className="font-bold text-lg mb-4">📈 Timeline</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-3 h-3 bg-primary rounded-full"></div>
//                       <div>
//                         <p className="font-medium">Created</p>
//                         <p className="text-sm opacity-70">{new Date(selectedInterview.createdAt).toLocaleString()}</p>
//                       </div>
//                     </div>

//                     {selectedInterview.startedAt && (
//                       <div className="flex items-center gap-3">
//                         <div className="w-3 h-3 bg-success rounded-full"></div>
//                         <div>
//                           <p className="font-medium">Started</p>
//                           <p className="text-sm opacity-70">{new Date(selectedInterview.startedAt).toLocaleString()}</p>
//                         </div>
//                       </div>
//                     )}

//                     {selectedInterview.endedAt && (
//                       <div className="flex items-center gap-3">
//                         <div className="w-3 h-3 bg-neutral rounded-full"></div>
//                         <div>
//                           <p className="font-medium">Completed</p>
//                           <p className="text-sm opacity-70">{new Date(selectedInterview.endedAt).toLocaleString()}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Additional Info */}
//               {selectedInterview.description && (
//                 <div className="card bg-base-200">
//                   <div className="card-body">
//                     <h4 className="font-bold text-lg mb-2">📝 Description</h4>
//                     <p>{selectedInterview.description}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="modal-action">
//               <button className="btn btn-outline" onClick={closeModal}>
//                 Close
//               </button>
//               {selectedInterview.status === "pending" && (
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => {
//                     closeModal()
//                     navigate(`/interview/${selectedInterview._id}`)
//                   }}
//                 >
//                   🎯 Start Interview
//                 </button>
//               )}
//               {selectedInterview.status === "running" && (
//                 <button
//                   className="btn btn-success"
//                   onClick={() => {
//                     closeModal()
//                     navigate(`/interview/${selectedInterview._id}`)
//                   }}
//                 >
//                   🔴 Continue Live
//                 </button>
//               )}
//               {selectedInterview.status === "ended" && (
//                 <button
//                   className="btn btn-info"
//                   onClick={() => {
//                     closeModal()
//                     navigate(`/result/${selectedInterview._id}`)
//                   }}
//                 >
//                   📊 View Results
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="modal-backdrop" onClick={closeModal}></div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default InterviewDashboardPage





"use client"

import { useState, Fragment } from "react"
import { useNavigate } from "react-router" // Changed from 'react-router' to 'react-router-dom'
import useAuthUser from "../hooks/useAuthUser"
import { useGetInterviews, useDeleteInterview } from "../hooks/useInterview"
import InterviewCard from "../components/InterviewCard"
import { Toaster, toast } from "react-hot-toast"
import { Dialog, Transition } from "@headlessui/react"

const InterviewDashboardPage = () => {
  const navigate = useNavigate() // Changed from useNavigate.push to direct navigate function
  const { authUser } = useAuthUser()
  const { data: interviews, isLoading } = useGetInterviews(authUser?._id)
  const { deleteInterviewMutation, isPending: isDeleting } = useDeleteInterview()

  const [selectedInterview, setSelectedInterview] = useState(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const openModal = (interview) => {
    setSelectedInterview(interview)
    setIsModalOpen(true) // Ensure modal state is set to true
  }

  const closeModal = () => {
    setSelectedInterview(null)
    setIsModalOpen(false) // Ensure modal state is set to false
  }

  const handleDeleteInterviewClick = (interview) => {
    setSelectedInterview(interview)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (selectedInterview) {
      // CORRECTED: Call deleteInterviewMutation directly
      deleteInterviewMutation(selectedInterview._id, {
        onSuccess: () => {
          toast.success("Interview deleted successfully!", {
            duration: 3000,
            position: "top-right",
            style: { background: "hsl(var(--su))", color: "hsl(var(--suc))", borderRadius: "8px", padding: "12px" },
          })
          setIsDeleteConfirmOpen(false)
          setSelectedInterview(null)
        },
        onError: (error) => {
          console.error("Error deleting interview:", error.response?.data || error.message)
          toast.error(`Failed to delete interview: ${error.response?.data?.message || "Please try again."}`, {
            duration: 3000,
            position: "top-right",
            style: { background: "hsl(var(--er))", color: "hsl(var(--erc))", borderRadius: "8px", padding: "12px" },
          })
          setIsDeleteConfirmOpen(false)
          setSelectedInterview(null)
        },
      })
    }
  }

  // Added state for the details modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" />
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
            <InterviewCard
              key={interview._id}
              interview={interview}
              onViewDetails={openModal}
              onDeleteClick={handleDeleteInterviewClick}
            />
          ))}
        </div>
      )}
      {/* Interview Details Modal */}
      <Transition appear show={isModalOpen} as={Fragment} >
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                <Dialog.Panel className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-xl shadow-2xl bg-base-100">
                  <div className="flex justify-between items-center mb-6 p-6 border-b">
                    <h3 className="font-bold text-2xl">📋 Interview Details</h3>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                      ✕
                    </button>
                  </div>
                  {selectedInterview && (
                    <div className="space-y-6 p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
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
                            <p className="text-xs opacity-70">
                              {new Date(selectedInterview.createdAt).toLocaleTimeString()}
                            </p>
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
                                <p className="text-sm opacity-70">
                                  {new Date(selectedInterview.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {selectedInterview.startedAt && (
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-success rounded-full"></div>
                                <div>
                                  <p className="font-medium">Started</p>
                                  <p className="text-sm opacity-70">
                                    {new Date(selectedInterview.startedAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedInterview.endedAt && (
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-neutral rounded-full"></div>
                                <div>
                                  <p className="font-medium">Completed</p>
                                  <p className="text-sm opacity-70">
                                    {new Date(selectedInterview.endedAt).toLocaleString()}
                                  </p>
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
                <Dialog.Panel className="card bg-base-100 w-full max-w-md shadow-xl">
                  <div className="card-body">
                    <Dialog.Title className="card-title text-error">Delete Interview Confirmation</Dialog.Title>
                    <p>
                      Are you sure you want to delete the interview for topic:{" "}
                      <strong>{selectedInterview?.topic || "Untitled Interview"}</strong>? This action cannot be undone.
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="btn btn-ghost"
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button onClick={confirmDelete} className="btn btn-error" disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete Interview"
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


