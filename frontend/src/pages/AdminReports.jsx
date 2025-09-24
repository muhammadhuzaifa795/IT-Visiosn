"use client"

import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Plus, Trash, Loader } from "lucide-react"
import { Link } from "react-router"
import useTickets from "../hooks/useTicket"

const AdminReports = () => {
  const { tickets, isFetching, fetchError, deleteTicket, isDeleting } = useTickets()
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState(null)

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
      (ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" ||
        (statusFilter === "complete" && ticket.status === "complete") ||
        (statusFilter === "incomplete" && ticket.status !== "complete"))
  )

  // Sort tickets by createdAt
  filteredTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Tickets</h1>
        <Link to="/ticket/upload" className="btn btn-primary">
          <Plus size={20} />
          Create New Ticket
        </Link>
      </div>

      <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-6 border border-base-300/30">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full max-w-md"
            aria-label="Search tickets"
          />
          <div className="flex gap-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="select select-bordered"
              aria-label="Sort tickets"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered"
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
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading tickets...</p>
        </div>
      ) : fetchError ? (
        <p className="text-center text-error">Failed to load tickets</p>
      ) : (
        <div className="bg-base-100 shadow rounded-lg overflow-x-auto">
          <table className="table table-auto w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-base-200">
                    <td className="px-4 py-2 truncate max-w-xs">{ticket.title}</td>
                    <td className="px-4 py-2 truncate max-w-md">{ticket.description}</td>
                    <td className="px-4 py-2">
                      <span className={`badge ${ticket.status === "complete" ? "badge-success" : "badge-primary"}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{ticket.createdBy?.fullName || "Unknown"}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Link to={`/ticket/${ticket._id}`} className="btn btn-info btn-sm">
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(ticket._id)}
                          disabled={isDeleting}
                          className="btn btn-error btn-sm"
                        >
                          <Trash size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-base-content/60">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="py-4">Do you really want to delete this ticket? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReports