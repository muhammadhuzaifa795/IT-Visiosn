"use client"

import { useState, useCallback } from "react"
import { Toaster, toast } from "react-hot-toast"
import { 
  Trash, 
  Search, 
  Ticket, 
  X, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  BarChart3,
  MoreVertical,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react"
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
        toast.success("Ticket deleted successfully!", {
          icon: '🗑️',
          style: { background: '#10b981', color: 'white' }
        })
        setShowDeleteModal(false)
        setTicketToDelete(null)
      } catch (err) {
        console.error("Delete Error:", err)
        toast.error("Failed to delete ticket.", {
          icon: '❌',
          style: { background: '#ef4444', color: 'white' }
        })
      }
    }
  }

  // Filter tickets by search and status
  let filteredTickets = tickets.filter(
    (ticket) =>
      ((ticket.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (ticket.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (ticket.createdBy?.fullName || "").toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" ||
        (statusFilter === "completed" && ticket.status === "completed") ||
        (statusFilter === "pending" && ticket.status !== "completed"))
  )

  // Sort tickets by createdAt
  filteredTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt || Date.now())
    const dateB = new Date(b.createdAt || Date.now())
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  // Calculate statistics
  const stats = {
    total: tickets.length,
    completed: tickets.filter(t => t.status === "completed").length,
    pending: tickets.filter(t => t.status !== "completed").length,
    completionRate: tickets.length ? Math.round((tickets.filter(t => t.status === "completed").length / tickets.length) * 100) : 0
  }

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

  const getTimeAgo = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return formatDate(dateString)
  }

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return "badge-success"
    } else if (status === "in progress") {
      return "badge-warning"
    } else {
      return "badge-primary"
    }
  }

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle className="w-4 h-4" />
    } else if (status === "in progress") {
      return <RefreshCw className="w-4 h-4" />
    } else {
      return <Clock className="w-4 h-4" />
    }
  }

  const exportTickets = () => {
    const data = filteredTickets.map(ticket => ({
      Title: ticket.title,
      Description: ticket.description,
      Status: ticket.status,
      'Created By': ticket.createdBy?.fullName || 'Unknown',
      'Created At': new Date(ticket.createdAt).toLocaleDateString(),
      'Last Updated': new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()
    }))
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Tickets exported successfully!', {
      icon: '📥',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Ticket Management
          </h1>
          <p className="text-base-content/60 mt-2">Manage and monitor all support tickets</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportTickets}
            className="btn btn-outline gap-2"
            disabled={filteredTickets.length === 0}
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <Ticket className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.total}</div>
            <div className="text-sm text-base-content/60">Total Tickets</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.completed}</div>
            <div className="text-sm text-base-content/60">Completed</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.pending}</div>
            <div className="text-sm text-base-content/60">Pending</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.completionRate}%</div>
            <div className="text-sm text-base-content/60">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-lg border border-base-300/30 mb-8">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tickets by title, description, or creator..."
                  value={search}
                  onChange={handleSearchChange}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              
              <button 
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setSortOrder("newest");
                }}
                className="btn btn-ghost btn-sm gap-2"
              >
                <Filter size={16} />
                Reset
              </button>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-base-content/60">
              Showing {filteredTickets.length} of {stats.total} tickets
            </p>
            {search && (
              <p className="text-sm text-base-content/60">
                Search: "{search}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      {isFetching ? (
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body">
            <div className="flex justify-center items-center py-16">
              <RefreshCw className="animate-spin w-8 h-8 text-primary" />
              <span className="ml-3 text-base-content/60">Loading tickets...</span>
            </div>
          </div>
        </div>
      ) : fetchError ? (
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body">
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-error mb-2">Failed to Load Tickets</h3>
              <p className="text-base-content/60">Please try again later</p>
            </div>
          </div>
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="card bg-base-100 shadow-xl border border-base-300/30">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Ticket</th>
                    <th className="px-6 py-4 text-left font-semibold">Creator</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Created</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-base-200/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-base-content line-clamp-1">
                            {ticket.title || "Untitled Ticket"}
                          </div>
                          <div className="text-sm text-base-content/60 line-clamp-2 max-w-md">
                            {ticket.description || "No description provided"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-base-content/60" />
                          <span className="text-base-content">
                            {ticket.createdBy?.fullName || "Unknown User"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge gap-2 ${getStatusBadge(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-base-content/60 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {getTimeAgo(ticket.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleViewClick(ticket)}
                            className="btn btn-ghost btn-sm btn-square"
                            title="View Ticket"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ticket._id)}
                            disabled={isDeleting}
                            className="btn btn-ghost btn-sm btn-square text-error"
                            title="Delete Ticket"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body">
            <div className="text-center py-16">
              <Ticket className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content/70 mb-2">
                {stats.total === 0 ? "No Tickets Yet" : "No Matching Tickets"}
              </h3>
              <p className="text-base-content/50">
                {stats.total === 0 
                  ? "Tickets will appear here when users submit support requests." 
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Ticket</h3>
              <p className="text-base-content/60">
                Are you sure you want to delete this ticket? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error flex-1 gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <RefreshCw className="animate-spin w-4 h-4" />
                ) : (
                  <Trash className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {showViewModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Ticket Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-base-content/80 mb-2">Title</h4>
                  <p className="text-base-content text-lg font-medium">{selectedTicket.title || "Untitled Ticket"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-base-content/80 mb-2">Status</h4>
                  <span className={`badge badge-lg gap-2 ${getStatusBadge(selectedTicket.status)}`}>
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status || "Pending"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-base-content/80 mb-2">Description</h4>
                <div className="bg-base-200 rounded-lg p-4">
                  <p className="text-base-content whitespace-pre-wrap">
                    {selectedTicket.description || "No description provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-base-content/80 mb-2">Created By</h4>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-base-content/60" />
                    <span className="text-base-content">{selectedTicket.createdBy?.fullName || "Unknown User"}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-base-content/80 mb-2">Created At</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-base-content/60" />
                    <span className="text-base-content">{formatDate(selectedTicket.createdAt)}</span>
                  </div>
                </div>
              </div>

              {selectedTicket.updatedAt && selectedTicket.updatedAt !== selectedTicket.createdAt && (
                <div>
                  <h4 className="text-sm font-semibold text-base-content/80 mb-2">Last Updated</h4>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-base-content/60" />
                    <span className="text-base-content">{formatDate(selectedTicket.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8">
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