import React, { useState } from "react";
import { Link } from "react-router";
import { 
  LoaderIcon, 
  PlusIcon, 
  TrashIcon, 
  SearchIcon, 
  GridIcon, 
  ListIcon,
  FilterIcon,
  SortAscIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  EyeIcon,
  CrownIcon,
  UsersIcon,
  UserCheckIcon
} from "lucide-react";
import useTickets from "../hooks/useTicket";
import useAuthUser from "../hooks/useAuthUser";

const TicketsPage = () => {
  const { tickets, isFetching, fetchError, deleteTicket, isDeleting } = useTickets();
  const { authUser } = useAuthUser();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all"); // New filter for user tickets

  const handleDeleteClick = (ticketId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setTicketToDelete(ticketId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      deleteTicket(ticketToDelete);
      setShowDeleteModal(false);
      setTicketToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTicketToDelete(null);
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
        <div className="text-center">
          <LoaderIcon className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-lg text-base-content/60">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 px-4">
        <div className="card bg-base-100 shadow-xl border border-base-300/30 max-w-md">
          <div className="card-body text-center">
            <div className="text-error text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-error mb-2">Failed to Load Tickets</h3>
            <p className="text-base-content/60 mb-4">{fetchError.message}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter tickets by search, status, priority, and user
  let filteredTickets = tickets.filter(
    (ticket) =>
      (ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase()) ||
        ticket.relatedSkills?.some(skill => 
          skill.toLowerCase().includes(search.toLowerCase())
        )) &&
      (statusFilter === "all" ||
        (statusFilter === "completed" && ticket.status === "completed") ||
        (statusFilter === "incompleted" && ticket.status !== "completed")) &&
      (priorityFilter === "all" || ticket.priority === priorityFilter) &&
      (userFilter === "all" || 
       (userFilter === "my-tickets" && authUser && ticket.createdBy?._id === authUser._id) ||
       (userFilter === "other-tickets" && authUser && ticket.createdBy?._id !== authUser._id))
  );

  // Sort tickets
  filteredTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Calculate statistics
  const stats = {
    total: tickets.length,
    myTickets: tickets.filter(t => authUser && t.createdBy?._id === authUser._id).length,
    completed: tickets.filter(t => t.status === "completed").length,
    highPriority: tickets.filter(t => t.priority === "high").length,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "badge-error";
      case "medium": return "badge-warning";
      case "low": return "badge-success";
      default: return "badge-neutral";
    }
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? 
      <CheckCircleIcon className="w-4 h-4" /> : 
      <ClockIcon className="w-4 h-4" />;
  };

  const getAttachmentIcon = (attachmentUrl) => {
    if (!attachmentUrl) return null;
    if (attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <ImageIcon className="w-4 h-4" />;
    if (attachmentUrl.match(/\.(mp4|webm|ogg)$/i)) return <VideoIcon className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
      {/* Header Section */}
      <div className="bg-base-100/80 backdrop-blur-sm border-b border-base-300/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Tickets
              </h1>
              <p className="text-base-content/60 mt-1">
                Manage and track all support requests
              </p>
            </div>
            <Link 
              to="/ticket/upload" 
              className="btn btn-primary gap-2 hover:scale-105 transition-all shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              Create New Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all">
            <div className="card-body p-4 text-center">
              <FileIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.total}</div>
              <div className="text-sm text-base-content/60">Total Tickets</div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all">
            <div className="card-body p-4 text-center">
              <UserCheckIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.myTickets}</div>
              <div className="text-sm text-base-content/60">My Tickets</div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all">
            <div className="card-body p-4 text-center">
              <CheckCircleIcon className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.completed}</div>
              <div className="text-sm text-base-content/60">Completed</div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all">
            <div className="card-body p-4 text-center">
              <AlertCircleIcon className="w-8 h-8 text-error mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.highPriority}</div>
              <div className="text-sm text-base-content/60">High Priority</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="card bg-base-100 shadow-lg border border-base-300/30 mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Box */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Search tickets by title, description, or skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full pl-10 pr-4 py-2"
                    aria-label="Search tickets"
                  />
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-wrap gap-2">
                {/* View Mode Toggle */}
                <div className="join">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`join-item btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
                    aria-label="Grid view"
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`join-item btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
                    aria-label="List view"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Order */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="select select-bordered select-sm"
                  aria-label="Sort tickets"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select select-bordered select-sm"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="incompleted">In Progress</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="select select-bordered select-sm"
                  aria-label="Filter by priority"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* User Filter - Only show if user is logged in */}
                {authUser && (
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="select select-bordered select-sm"
                    aria-label="Filter by user"
                  >
                    <option value="all">All Tickets</option>
                    <option value="my-tickets">My Tickets</option>
                    <option value="other-tickets">Others Tickets</option>
                  </select>
                )}

                {/* Reset Filters */}
                {(search || statusFilter !== "all" || priorityFilter !== "all" || userFilter !== "all") && (
                  <button 
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setUserFilter("all");
                    }}
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <FilterIcon className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-sm text-base-content/60">
                Showing {filteredTickets.length} of {tickets.length} tickets
                {userFilter === "my-tickets" && " (My Tickets)"}
                {userFilter === "other-tickets" && " (Others Tickets)"}
              </p>
              {search && (
                <p className="text-sm text-base-content/60">
                  Search: "{search}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tickets Grid/List */}
        {filteredTickets.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" 
              : "flex flex-col gap-4"
          }>
            {filteredTickets.map((ticket) => {
              const isImage = ticket.attachments?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              const isVideo = ticket.attachments?.url?.match(/\.(mp4|webm|ogg)$/i);
              const isCompleted = ticket.status === "completed";
              const isOwner = authUser && ticket.createdBy?._id === authUser._id;
              const hasAttachment = !!ticket.attachments?.url;

              return (
                <Link
                  to={`/ticket/${ticket._id}`}
                  key={ticket._id}
                  className={
                    viewMode === "grid"
                      ? `card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300/30 hover:border-primary/30 hover:translate-y-[-4px] group overflow-hidden ${
                          isCompleted ? "ring-1 ring-success/20" : ""
                        }`
                      : `card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300/30 hover:border-primary/30 group flex-row items-stretch overflow-hidden ${
                          isCompleted ? "ring-1 ring-success/20" : ""
                        }`
                  }
                >
                  {/* Attachment Preview */}
                  {hasAttachment && (
                    <figure className={
                      viewMode === "grid" 
                        ? "h-48 relative overflow-hidden" 
                        : "w-48 flex-shrink-0 relative"
                    }>
                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                        {isOwner && (
                          <div className="badge badge-primary badge-sm gap-1">
                            <CrownIcon className="w-3 h-3" />
                            My Ticket
                          </div>
                        )}
                        <div className="badge badge-accent badge-sm gap-1">
                          {getAttachmentIcon(ticket.attachments.url)}
                          {isImage ? "Image" : isVideo ? "Video" : "File"}
                        </div>
                      </div>
                      
                      {isImage ? (
                        <img
                          src={ticket.attachments.url}
                          alt={ticket.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : isVideo ? (
                        <div className="w-full h-full bg-gradient-to-br from-base-300 to-base-400 flex items-center justify-center">
                          <VideoIcon className="w-16 h-16 text-base-content/40" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-base-300 to-base-400 flex items-center justify-center">
                          <FileIcon className="w-16 h-16 text-base-content/40" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    </figure>
                  )}

                  {/* Ticket Content */}
                  <div className={
                    viewMode === "grid" 
                      ? "card-body p-6" 
                      : "card-body p-6 flex-1 min-w-0"
                  }>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="card-title text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors flex-1 mr-2">
                        {ticket.title}
                      </h3>
                      
                      <div className="flex gap-1">
                        {isOwner && (
                          <button
                            onClick={(e) => handleDeleteClick(ticket._id, e)}
                            disabled={isDeleting}
                            className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-all hover:btn-error hover:scale-110"
                            aria-label={`Delete ticket: ${ticket.title}`}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                        <div className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-all">
                          <EyeIcon className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <p className="text-base-content/70 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {ticket.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-3 mt-auto">
                      {/* Status and Priority */}
                      <div className="flex flex-wrap gap-2">
                        <div className={`badge gap-1 ${isCompleted ? "badge-success" : "badge-primary"}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </div>
                        {ticket.priority && (
                          <div className={`badge gap-1 ${getPriorityColor(ticket.priority)}`}>
                            <TagIcon className="w-3 h-3" />
                            {ticket.priority}
                          </div>
                        )}
                        {!hasAttachment && isOwner && (
                          <div className="badge badge-outline badge-sm gap-1">
                            <CrownIcon className="w-3 h-3" />
                            My Ticket
                          </div>
                        )}
                      </div>

                      {/* User and Date */}
                      <div className="flex items-center justify-between text-sm text-base-content/60">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            <span className="font-medium">{ticket.createdBy?.fullName || "Unknown"}</span>
                          </div>
                          {isOwner && (
                            <span className="badge badge-ghost badge-xs">You</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      {ticket.relatedSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ticket.relatedSkills.slice(0, 4).map((skill, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {skill}
                            </span>
                          ))}
                          {ticket.relatedSkills.length > 4 && (
                            <span className="badge badge-ghost badge-sm">
                              +{ticket.relatedSkills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="card bg-base-100 shadow-xl border border-base-300/30">
            <div className="card-body">
              <div className="text-center py-12">
                <FileIcon className="w-20 h-20 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                  {search || statusFilter !== "all" || priorityFilter !== "all" || userFilter !== "all" 
                    ? "No Matching Tickets Found"
                    : "No Tickets Available"
                  }
                </h3>
                <p className="text-base-content/50 mb-6 max-w-md mx-auto">
                  {search || statusFilter !== "all" || priorityFilter !== "all" || userFilter !== "all" 
                    ? "Try adjusting your search criteria or filters to find what you're looking for."
                    : "Get started by creating your first support ticket to receive help from the community."
                  }
                </p>
                {(!search && statusFilter === "all" && priorityFilter === "all" && userFilter === "all") && (
                  <Link to="/ticket/upload" className="btn btn-primary gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Create First Ticket
                  </Link>
                )}
                {(search || statusFilter !== "all" || priorityFilter !== "all" || userFilter !== "all") && (
                  <button 
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setUserFilter("all");
                    }}
                    className="btn btn-ghost gap-2"
                  >
                    <FilterIcon className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircleIcon className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Ticket</h3>
              <p className="text-base-content/60">
                Are you sure you want to delete this ticket? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                className="btn btn-ghost flex-1" 
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error flex-1 gap-2" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <TrashIcon className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;