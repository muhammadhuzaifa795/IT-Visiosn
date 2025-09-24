import React, { useState } from "react";
import { Link } from "react-router"; // Updated import
import { LoaderIcon, PlusIcon, TrashIcon } from "lucide-react";
import useTickets from "../hooks/useTicket";
import useAuthUser from "../hooks/useAuthUser";

const TicketsPage = () => {
  const { tickets, isFetching, fetchError, deleteTicket, isDeleting } = useTickets();
  const { authUser } = useAuthUser();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // Newest, oldest
  const [statusFilter, setStatusFilter] = useState("all"); // all, complete, incomplete

  const handleDeleteClick = (ticketId) => {
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

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderIcon className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (fetchError) {
    return <p className="text-center">Failed to load tickets</p>;
  }

  // Filter tickets by search and status
  let filteredTickets = tickets.filter(
    (ticket) =>
      (ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" ||
        (statusFilter === "complete" && ticket.status === "completed") ||
        (statusFilter === "incomplete" && ticket.status !== "completed"))
  );

  // Sort tickets by createdAt
  filteredTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Tickets</h2>
          <Link to="/ticket/upload" className="btn btn-primary">
            <PlusIcon className="w-5 h-5 mr-2" /> Create Ticket
          </Link>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
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
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="select select-bordered"
              aria-label="Select view mode"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
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

        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {filteredTickets.map((ticket) => {
            const isImage = ticket.attachments?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            const isVideo = ticket.attachments?.url?.match(/\.(mp4|webm|ogg)$/i);
            const isCompleted = ticket.status === "complete";

            return (
              <Link
                to={`/ticket/${ticket._id}`}
                key={ticket._id}
                className={
                  viewMode === "grid"
                    ? `card shadow-lg rounded-2xl bg-base-100 border ${
                        isCompleted ? "border-success bg-success/10" : "border-base-300"
                      } hover:shadow-xl transition-all duration-300`
                    : `card shadow-lg rounded-2xl bg-base-100 border ${
                        isCompleted ? "border-success bg-success/10" : "border-base-300"
                      } flex flex-row p-4`
                }
              >
                {ticket.attachments?.url && (
                  <figure
                    className={
                      viewMode === "grid"
                        ? "h-56 overflow-hidden"
                        : "w-40 h-40 overflow-hidden rounded-lg"
                    }
                  >
                    {isImage && (
                      <img
                        src={ticket.attachments.url}
                        alt={`Attachment for ticket: ${ticket.title}`}
                        className={
                          viewMode === "grid"
                            ? "w-full h-full object-cover hover:scale-105 transition-transform"
                            : "w-full h-full object-cover"
                        }
                      />
                    )}
                    {isVideo && (
                      <video
                        controls
                        className={
                          viewMode === "grid"
                            ? "w-full h-full object-cover"
                            : "w-full h-full object-cover"
                        }
                      >
                        <source src={ticket.attachments.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </figure>
                )}
                <div
                  className={
                    viewMode === "grid"
                      ? "card-body"
                      : "flex-1 pl-4 flex flex-col justify-between"
                  }
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="card-title text-lg font-semibold">{ticket.title}</h3>
                      {authUser && ticket.createdBy?._id === authUser._id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteClick(ticket._id);
                          }}
                          disabled={isDeleting}
                          className="btn btn-ghost btn-sm"
                          aria-label={`Delete ticket: ${ticket.title}`}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm line-clamp-3">{ticket.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-base-content/80">
                        <span className="font-semibold">Status: </span>
                        <span className={`badge ${isCompleted ? "badge-success" : "badge-primary"}`}>
                          {ticket.status}
                        </span>
                      </p>
                      <p className="text-sm text-base-content/80">
                        <span className="font-semibold">Created By: </span>
                        {ticket.createdBy?.fullName || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTickets.length === 0 && (
          <p className="text-center mt-6">No tickets found</p>
        )}

        {showDeleteModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Are you sure?</h3>
              <p className="py-4">Do you really want to delete this ticket? This action cannot be undone.</p>
              <div className="modal-action">
                <button className="btn" onClick={() => setShowDeleteModal(false)}>
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
    </div>
  );
};

export default TicketsPage;