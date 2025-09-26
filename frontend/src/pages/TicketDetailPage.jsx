import React, { useState } from "react";
import { useParams, Link } from "react-router";
import {
  LoaderIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  FileTextIcon,
  ClockIcon,
  DownloadIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "lucide-react";
import useTickets from "../hooks/useTicket";
import useAuthUser from "../hooks/useAuthUser";
import useLeaderboard from "../hooks/useLeaderboard";

const TicketDetailPage = () => {
  const { id } = useParams();
  const { useTicketById, addSolution, isAddingSolution, addSolutionError } = useTickets();
  const { data: ticket, isLoading, error } = useTicketById(id);
  const { authUser, isLoading: isAuthLoading } = useAuthUser();
  const { leaderboard, isFetching, fetchError, addUserToLeaderboard, isAddingUser, addUserError } =
    useLeaderboard();
  const [solutionText, setSolutionText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [leaderboardSuccess, setLeaderboardSuccess] = useState("");
  const maxSolutionLength = 500;

  if (isLoading || isAuthLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <LoaderIcon
          className="animate-spin w-12 h-12 text-primary"
          aria-label="Loading ticket details"
        />
      </div>
    );
  }

  if (error || fetchError) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div
          className="alert alert-error max-w-md text-center shadow-lg"
          role="alert"
        >
          <span>Failed to load data: {error?.message || fetchError?.message || "Unknown error"}</span>
        </div>
      </div>
    );
  }

  const currentUserId = authUser?._id;
  const isImage = ticket.attachments?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isVideo = ticket.attachments?.url?.match(/\.(mp4|webm|ogg)$/i);
  const isOtherFile = ticket.attachments?.url && !isImage && !isVideo;
  const hasSubmitted = (ticket.solutions || []).some(
    (solution) => solution.user?._id?.toString() === currentUserId
  );
  const isTicketCreator = ticket.createdBy?._id?.toString() === currentUserId;
  const acceptedSolutionId = ticket.acceptedSolutionId || null;
  const isTicketComplete = ticket.status === "complete";

  const isTicketInLeaderboard = leaderboard.some((entry) =>
    entry.tickets.includes(id) || entry.tickets.some((ticketId) => ticketId.toString() === id)
  );

  const leaderboardEntry = leaderboard.find((entry) =>
    entry.tickets.includes(id) || entry.tickets.some((ticketId) => ticketId.toString() === id)
  );
  const leaderboardUserId = leaderboardEntry?.userId;

  const handleSolutionSubmit = () => {
    if (!solutionText.trim()) return;
    if (window.confirm("Are you sure you want to submit this solution?")) {
      addSolution(
        { ticketId: id, solutionText },
        {
          onSuccess: () => {
            setSuccessMessage("Solution submitted successfully!");
            setSolutionText("");
            setTimeout(() => setSuccessMessage(""), 3000);
          },
        }
      );
    }
  };

  const handleMarkAsAccepted = (solutionId, userId) => {
    if (window.confirm("Mark this solution as accepted? This will add the user to the leaderboard.")) {
      addUserToLeaderboard(
        { userId, ticketId: id },
        {
          onSuccess: () => {
            setLeaderboardSuccess(
              `${ticket.solutions.find((s) => s._id === solutionId)?.user?.fullName}'s solution marked as accepted and added to leaderboard!`
            );
            setTimeout(() => setLeaderboardSuccess(""), 3000);
          },
        }
      );
    }
  };

  const dismissAlert = (setter) => () => setter("");

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-base-100 shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/tickets"
              className="btn btn-ghost btn-sm flex items-center gap-2"
              aria-label="Back to tickets list"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Tickets
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/60">Ticket ID:</span>
              <span className="font-mono text-sm bg-base-200 px-2 py-1 rounded">{id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        <div className="space-y-4 mb-6">
          {successMessage && (
            <div className="alert alert-success flex justify-between items-center" role="alert">
              <span>{successMessage}</span>
              <button
                onClick={dismissAlert(setSuccessMessage)}
                className="btn btn-ghost btn-sm"
                aria-label="Dismiss success message"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          {addSolutionError && (
            <div className="alert alert-error flex justify-between items-center" role="alert">
              <span>{addSolutionError.message}</span>
              <button
                onClick={dismissAlert(() => {})}
                className="btn btn-ghost btn-sm"
                aria-label="Dismiss error message"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          {leaderboardSuccess && (
            <div className="alert alert-success flex justify-between items-center" role="alert">
              <span>{leaderboardSuccess}</span>
              <button
                onClick={dismissAlert(setLeaderboardSuccess)}
                className="btn btn-ghost btn-sm"
                aria-label="Dismiss leaderboard success message"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          {addUserError && (
            <div className="alert alert-error flex justify-between items-center" role="alert">
              <span>Failed to add to leaderboard: {addUserError.message}</span>
              <button
                onClick={dismissAlert(() => {})}
                className="btn btn-ghost btn-sm"
                aria-label="Dismiss leaderboard error message"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          {isTicketComplete && (
            <div className="alert alert-success flex justify-between items-center" role="alert">
              <span>Ticket completed successfully!</span>
              <button
                onClick={dismissAlert(() => {})}
                className="btn btn-ghost btn-sm"
                aria-label="Dismiss ticket complete message"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Ticket Card */}
        <div className="card rounded-2xl bg-base-100 border shadow-lg mb-8">
          {/* Attachment Section */}
          {ticket.attachments?.url ? (
            <figure className="h-64 sm:h-80 overflow-hidden rounded-t-2xl">
              {isImage && (
                <img
                  src={ticket.attachments.url}
                  alt={`Attachment for ticket: ${ticket.title}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              )}
              {isVideo && (
                <video
                  controls
                  className="w-full h-full object-cover"
                  aria-label="Ticket attachment video"
                >
                  <source src={ticket.attachments.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {isOtherFile && (
                <div className="h-64 sm:h-80 bg-base-200 flex flex-col items-center justify-center">
                  <DownloadIcon className="w-12 h-12 text-primary" />
                  <a
                    href={ticket.attachments.url}
                    download
                    className="text-primary hover:underline font-medium mt-2"
                    aria-label="Download attachment"
                  >
                    Download Attachment
                  </a>
                </div>
              )}
            </figure>
          ) : (
            <div className="h-48 bg-base-200 flex items-center justify-center rounded-t-2xl">
              <FileTextIcon className="w-12 h-12 text-base-content/60" />
              <span className="text-lg text-base-content/60 ml-2">No Attachment</span>
            </div>
          )}

          {/* Ticket Details */}
          <div className="card-body p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <h2 className="card-title text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-2 sm:mb-0">
                {ticket.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${isTicketComplete ? "badge-success" : "badge-primary"} badge-lg`}>
                  {ticket.status}
                </span>
                <span className="badge badge-secondary badge-lg">
                  {ticket.priority || "Normal"}
                </span>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-base-content/80 mb-6">
              {ticket.description}
            </p>

            {/* Ticket Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Created By: </span>
                  <span className="group relative cursor-help">
                    {ticket.createdBy?.fullName || "Unknown"}
                    <span className="absolute bottom-full left-0 hidden group-hover:block bg-base-300 text-sm p-2 rounded shadow-lg z-10 whitespace-nowrap">
                      {ticket.createdBy?.email || "No email"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Assigned To: </span>
                  {ticket.assignedTo?.length > 0 ? (
                    <span className="group relative cursor-help">
                      {ticket.assignedTo.map(u => u.fullName).join(", ")}
                      <span className="absolute bottom-full left-0 hidden group-hover:block bg-base-300 text-sm p-2 rounded shadow-lg z-10 whitespace-nowrap">
                        {ticket.assignedTo.map(u => u.email).join(", ")}
                      </span>
                    </span>
                  ) : (
                    "Unassigned"
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileTextIcon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Helpful Notes: </span>
                  {ticket.helpfulNotes || "None"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TagIcon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Related Skills: </span>
                  {ticket.relatedSkills?.length > 0 ? ticket.relatedSkills.join(", ") : "None"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Created At: </span>
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Section */}
        <div className="card rounded-2xl bg-base-100 border shadow-lg">
          <div className="card-body p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-0">
                Solutions ({ticket.solutions?.length || 0})
              </h3>
              
              {/* Solution Submission (for non-creators) */}
              {!isTicketCreator && (
                <div className="flex items-center gap-2 text-sm">
                  {hasSubmitted && (
                    <span className="text-success flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      You've submitted a solution
                    </span>
                  )}
                  {isTicketComplete && (
                    <span className="text-warning">Ticket is completed</span>
                  )}
                  {isTicketInLeaderboard && (
                    <span className="text-info">Solution accepted</span>
                  )}
                </div>
              )}
            </div>

            {/* Solution Input Form */}
            {!isTicketCreator && (
              <div className="mb-6 p-4 bg-base-200 rounded-lg">
                <div className="relative mb-3">
                  <textarea
                    className="textarea textarea-bordered w-full resize-y focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Write your solution here..."
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value.slice(0, maxSolutionLength))}
                    disabled={isAddingSolution || hasSubmitted || isTicketComplete || isTicketInLeaderboard}
                    aria-label="Solution input"
                    maxLength={maxSolutionLength}
                    rows={4}
                  />
                  <span className="absolute bottom-3 right-3 text-sm text-base-content/60">
                    {solutionText.length}/{maxSolutionLength}
                  </span>
                </div>
                <button
                  className="btn btn-primary w-full sm:w-auto hover:bg-primary-dark transition-colors duration-200"
                  onClick={handleSolutionSubmit}
                  disabled={
                    isAddingSolution ||
                    hasSubmitted ||
                    isTicketComplete ||
                    isTicketInLeaderboard ||
                    !solutionText.trim()
                  }
                  aria-label="Submit solution"
                >
                  {isAddingSolution ? (
                    <LoaderIcon className="animate-spin w-5 h-5" />
                  ) : (
                    "Submit Solution"
                  )}
                </button>
              </div>
            )}

            {/* Solutions List */}
            <div className="space-y-4">
              {ticket.solutions?.length > 0 ? (
                ticket.solutions.map((solution) => (
                  <div
                    key={solution._id}
                    className={`border rounded-lg p-4 sm:p-6 ${
                      acceptedSolutionId === solution._id
                        ? "bg-success/10 border-success"
                        : solution.user?._id === leaderboardUserId
                        ? "bg-accent/10 border-accent"
                        : "bg-base-200"
                    } transition-all duration-300 hover:shadow-md`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={solution.user?.profilePic || "/default-avatar.png"}
                        alt={`Profile picture of ${solution.user?.fullName || "Unknown"}`}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-base sm:text-lg truncate">
                            {solution.user?.fullName || "Unknown"}
                          </p>
                          {acceptedSolutionId === solution._id && (
                            <CheckCircleIcon
                              className="w-5 h-5 text-success flex-shrink-0"
                              aria-label="Accepted solution"
                            />
                          )}
                          {solution.user?._id === leaderboardUserId && !acceptedSolutionId && (
                            <CheckCircleIcon
                              className="w-5 h-5 text-accent flex-shrink-0"
                              aria-label="Leaderboard solution"
                            />
                          )}
                        </div>
                        <p className="text-sm text-base-content/60">
                          {new Date(solution.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-base-content/80 text-base sm:text-lg whitespace-pre-wrap">
                      {solution.solutionText}
                    </p>
                    {isTicketCreator && acceptedSolutionId !== solution._id && (
                      <div className="mt-3 flex justify-end">
                        <button
                          className="btn btn-sm btn-outline btn-accent hover:bg-accent hover:text-white transition-colors duration-200"
                          onClick={() => handleMarkAsAccepted(solution._id, solution.user?._id)}
                          disabled={isAddingUser || isTicketComplete}
                          aria-label={`Mark solution by ${solution.user?.fullName} as accepted`}
                        >
                          {isAddingUser ? (
                            <LoaderIcon className="animate-spin w-5 h-5" />
                          ) : (
                            "Mark as Accepted"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileTextIcon className="w-12 h-12 text-base-content/40 mx-auto mb-3" />
                  <p className="text-base-content/60 text-base sm:text-lg">
                    No solutions submitted yet.
                  </p>
                  {!isTicketCreator && (
                    <p className="text-sm text-base-content/50 mt-1">
                      Be the first to submit a solution!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;