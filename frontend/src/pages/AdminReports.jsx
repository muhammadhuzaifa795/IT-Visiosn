"use client"

import { useState, useCallback } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Trash, Search, Ticket, X } from "lucide-react"
import { Link } from "react-router"
import useTickets from "../hooks/useTicket"

const AdminReports = () => {
  const { tickets, isFetching, fetchError, deleteTicket, isDeleting } = useTickets()
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Debounced search handler
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  // Handle view ticket
  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket)
    setShowViewModal(true)
  }

  // Handle delete ticket
  const handleDeleteClick = (ticketId) => {
    setTicketToDelete(ticketId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (ticketToDelete) {
      try {
        await deleteTicket(ticketToDelete)
        toast.success("Ticket deleted successfully!")
        setShowDeleteModal(false)
        setTicketToDelete(null)
      } catch (err) {
        console.error("Delete Error:", err)
        toast.error("Failed to delete ticket.")
      }
    }
  }

  // Filter tickets by search and status
  let filteredTickets = tickets.filter(
    (ticket) =>
      ((ticket.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (ticket.description || "").toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" ||
        (statusFilter === "complete" && ticket.status === "completed") ||
        (statusFilter === "incomplete" && ticket.status !== "completed"))
  )

  // Sort tickets by createdAt
  filteredTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt || Date.now())
    const dateB = new Date(b.createdAt || Date.now())
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen p-8 bg-base-100">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Manage Tickets
        </h1>
      </div>

      <div className="bg-base-200 p-6 rounded-xl shadow-lg mb-8 border border-base-300/30">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={handleSearchChange}
              className="input input-bordered w-full pl-10 bg-base-100"
              aria-label="Search tickets"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="select select-bordered bg-base-100"
              aria-label="Sort tickets"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered bg-base-100"
              aria-label="Filter by status"
            >
              <option value="all">All Tickets</option>
              <option value="complete">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>
      </div>

      {isFetching ? (
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-2 text-base-content/80">Loading tickets...</p>
        </div>
      ) : fetchError ? (
        <div className="text-center py-12">
          <h4 className="text-lg font-semibold text-error mb-2">Error</h4>
          <p className="text-base-content/60">Failed to load tickets.</p>
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="bg-base-200 shadow rounded-xl overflow-x-auto border border-base-300/30">
          <table className="table table-auto w-full min-w-[700px]">
            <thead className="bg-base-300/50">
              <tr>
                <th className="px-4 py-3 text-left text-base-content/80">Title</th>
                <th className="px-4 py-3 text-left text-base-content/80">Description</th>
                <th className="px-4 py-3 text-left text-base-content/80">Status</th>
                <th className="px-4 py-3 text-left text-base-content/80">Created By</th>
                <th className="px-4 py-3 text-left text-base-content/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const shortDesc = ticket.description
                  ? ticket.description.split(" ").slice(0, 10).join(" ") + (ticket.description.split(" ").length > 10 ? "..." : "")
                  : "No description"
                return (
                  <tr key={ticket._id} className="hover:bg-base-300/30 transition-colors duration-200">
                    <td className="px-4 py-3 text-base-content font-medium">{ticket.title || "N/A"}</td>
                    <td className="px-4 py-3 text-base-content">
                      <span title={ticket.description}>{shortDesc}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${ticket.status === "complete" ? "badge-success" : "badge-primary"}`}>
                        {ticket.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-base-content">{ticket.createdBy?.fullName || "Unknown"}</td>
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleViewClick(ticket)}
                        className="btn btn-info btn-sm hover:scale-105 transition-transform duration-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteClick(ticket._id)}
                        disabled={isDeleting}
                        className="btn btn-error btn-sm hover:scale-105 transition-transform duration-200"
                      >
                        <Trash size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Ticket size={48} className="mx-auto mb-4 text-base-content/50" />
          <h4 className="text-lg font-semibold text-base-content mb-2">No Tickets Found</h4>
          <p className="text-base-content/60">Try adjusting your search or filter to find tickets.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-200 p-6 rounded-xl shadow-lg border border-base-300/30 max-w-sm w-full animate-fade-in">
            <h3 className="font-bold text-lg text-base-content">Are you sure?</h3>
            <p className="py-4 text-base-content/80">Do you really want to delete this ticket? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                className="btn btn-ghost flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error flex-1 hover:scale-105 transition-transform duration-200"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {showViewModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-200 p-6 rounded-xl shadow-lg border border-base-300/30 max-w-lg w-full animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-base-content">Ticket Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="btn btn-ghost btn-sm"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-base-content/80">Title</h4>
                <p className="text-base-content">{selectedTicket.title || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-base-content/80">Description</h4>
                <p className="text-base-content whitespace-pre-wrap">{selectedTicket.description || "No description"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-base-content/80">Status</h4>
                <span
                  className={`badge ${selectedTicket.status === "complete" ? "badge-success" : "badge-primary"
                    }`}
                >
                  {selectedTicket.status || "N/A"}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-base-content/80">Created By</h4>
                <p className="text-base-content">{selectedTicket.createdBy?.fullName || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-base-content/80">Created At</h4>
                <p className="text-base-content">{formatDate(selectedTicket.createdAt)}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                className="btn btn-ghost w-full"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReports