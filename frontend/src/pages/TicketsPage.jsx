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
  AlertCircleIcon
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="text-center">
          <LoaderIcon className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-lg text-base-content/60">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="alert alert-error max-w-md shadow-lg">
          <AlertCircleIcon className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Failed to load tickets</h3>
            <div className="text-xs">{fetchError.message}</div>
          </div>
        </div>
      </div>
    );
  }

  // Filter tickets by search, status, and priority
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
      (priorityFilter === "all" || ticket.priority === priorityFilter)
  );

  // Sort tickets
  filteredTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

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

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-base-100 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Tickets</h1>
              <p className="text-base-content/60 mt-1">
                {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'} found
              </p>
            </div>
            <Link 
              to="/ticket/upload" 
              className="btn btn-primary gap-2 hover:scale-105 transition-transform"
            >
              <PlusIcon className="w-5 h-5" />
              Create New Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Box */}
          <div className="flex-1 relative">
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

          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-2">
            {/* View Mode Toggle */}
            <div className="join">
              <button
                onClick={() => setViewMode("grid")}
                className={`join-item btn btn-sm ${viewMode === "grid" ? "btn-active" : ""}`}
                aria-label="Grid view"
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`join-item btn btn-sm ${viewMode === "list" ? "btn-active" : ""}`}
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
              <option value="completed">completedd</option>
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
              const iscompletedd = ticket.status === "completed";
              const isOwner = authUser && ticket.createdBy?._id === authUser._id;

              return (
                <Link
                  to={`/ticket/${ticket._id}`}
                  key={ticket._id}
                  className={
                    viewMode === "grid"
                      ? `card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                          iscompletedd ? "border-l-success" : "border-l-primary"
                        } hover:translate-y-[-2px] group`
                      : `card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                          iscompletedd ? "border-l-success" : "border-l-primary"
                        } flex-row items-stretch group`
                  }
                >
                  {/* Attachment Preview */}
                  {ticket.attachments?.url && (
                    <figure className={
                      viewMode === "grid" 
                        ? "h-48 relative overflow-hidden" 
                        : "w-48 flex-shrink-0 relative"
                    }>
                      <div className="absolute top-2 left-2 z-10">
                        {isImage ? (
                          <div className="badge badge-sm badge-primary">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Image
                          </div>
                        ) : isVideo ? (
                          <div className="badge badge-sm badge-secondary">
                            <VideoIcon className="w-3 h-3 mr-1" />
                            Video
                          </div>
                        ) : (
                          <div className="badge badge-sm badge-accent">
                            <FileIcon className="w-3 h-3 mr-1" />
                            File
                          </div>
                        )}
                      </div>
                      
                      {isImage ? (
                        <img
                          src={ticket.attachments.url}
                          alt={ticket.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : isVideo ? (
                        <div className="w-full h-full bg-base-300 flex items-center justify-center">
                          <VideoIcon className="w-12 h-12 text-base-content/40" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-base-300 flex items-center justify-center">
                          <FileIcon className="w-12 h-12 text-base-content/40" />
                        </div>
                      )}
                    </figure>
                  )}

                  {/* Ticket Content */}
                  <div className={
                    viewMode === "grid" 
                      ? "card-body p-4" 
                      : "card-body p-4 flex-1 min-w-0"
                  }>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="card-title text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {ticket.title}
                      </h3>
                      
                      {isOwner && (
                        <button
                          onClick={(e) => handleDeleteClick(ticket._id, e)}
                          disabled={isDeleting}
                          className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity hover:btn-error"
                          aria-label={`Delete ticket: ${ticket.title}`}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-base-content/70 text-sm line-clamp-2 mb-3">
                      {ticket.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        <div className={`badge badge-sm gap-1 ${iscompletedd ? "badge-success" : "badge-primary"}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </div>
                        {ticket.priority && (
                          <div className={`badge badge-sm gap-1 ${getPriorityColor(ticket.priority)}`}>
                            <TagIcon className="w-3 h-3" />
                            {ticket.priority}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-base-content/50">
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          <span>{ticket.createdBy?.fullName || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {ticket.relatedSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ticket.relatedSkills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="badge badge-outline badge-xs">
                              {skill}
                            </span>
                          ))}
                          {ticket.relatedSkills.length > 3 && (
                            <span className="badge badge-ghost badge-xs">
                              +{ticket.relatedSkills.length - 3}
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
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <FileIcon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content mb-2">No tickets found</h3>
              <p className="text-base-content/60 mb-6">
                {search || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no tickets available. Create the first one!"}
              </p>
              {!search && statusFilter === "all" && priorityFilter === "all" && (
                <Link to="/ticket/upload" className="btn btn-primary gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Create First Ticket
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertCircleIcon className="w-5 h-5 text-error" />
              Confirm Deletion
            </h3>
            <p className="py-4">Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={cancelDelete}>
                Cancel
              </button>
              <button 
                className="btn btn-error gap-2" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
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