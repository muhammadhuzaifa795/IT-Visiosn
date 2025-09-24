import React, { useState } from "react";
import { useParams, Link } from "react-router"; // Updated import
import {
  LoaderIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  FileTextIcon,
  ClockIcon,
  DownloadIcon,
  CheckCircleIcon,
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
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="animate-spin w-12 h-12 text-primary" aria-label="Loading ticket details" />
      </div>
    );
  }

  if (error || fetchError) {
    return (
      <p className="text-center text-lg text-error" role="alert">
        Failed to load data: {error?.message || fetchError?.message || "Unknown error"}
      </p>
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

  // Check if ticket ID exists in leaderboard
  const isTicketInLeaderboard = leaderboard.some((entry) =>
    entry.tickets.includes(id) || entry.tickets.some((ticketId) => ticketId.toString() === id)
  );

  // Find the leaderboard entry for this ticket to highlight the solution
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-base-200">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/tickets"
          className="btn btn-ghost mb-8 flex items-center gap-2 sticky top-4 z-10 bg-base-100 rounded-lg shadow hover:bg-base-300 transition-colors"
          aria-label="Back to tickets list"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tickets
        </Link>
        <div className="card rounded-2xl bg-base-100 border shadow-xl animate-fade-in">
          {ticket.attachments?.url ? (
            <figure className="h-80 overflow-hidden rounded-t-2xl">
              {isImage && (
                <img
                  src={ticket.attachments.url}
                  alt={`Attachment for ticket: ${ticket.title}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              )}
              {isVideo && (
                <video controls className="w-full h-full object-cover">
                  <source src={ticket.attachments.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {isOtherFile && (
                <div className="h-80 bg-base-200 flex flex-col items-center justify-center">
                  <DownloadIcon className="w-12 h-12 text-primary" />
                  <a
                    href={ticket.attachments.url}
                    download
                    className="text-primary hover:underline"
                    aria-label="Download attachment"
                  >
                    Download Attachment
                  </a>
                </div>
              )}
            </figure>
          ) : (
            <div className="h-80 bg-base-200 flex items-center justify-center rounded-t-2xl">
              <FileTextIcon className="w-12 h-12 text-base-content/60" />
              <span className="text-lg text-base-content/60">No Attachment</span>
            </div>
          )}
          <div className="card-body p-6 sm:p-8">
            <h2 className="card-title text-3xl font-bold tracking-tight text-primary">{ticket.title}</h2>
            <p className="text-base leading-relaxed text-base-content/80 mt-4">{ticket.description}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <TagIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Status: </span>
                  <span className={`badge ${isTicketComplete ? "badge-success" : "badge-primary"} badge-md`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                <div className="group relative">
                    <h4 className="text-sm font-semibold text-base-content/80">Related Skills Assigned User</h4>
                  {ticket.assignedTo?.length > 0
                    ? ticket.assignedTo
                        .map((u) => (
                          <span key={u._id} className="inline-block">
                            {u.fullName}
                            <span className="absolute hidden group-hover:block bg-base-300 text-sm p-2 rounded shadow z-10">
                              {u.email}
                            </span>
                          </span>
                        ))
                        .reduce((prev, curr) => [prev, ", ", curr])
                    : "Unassigned"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TagIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Priority: </span>
                  <span className="badge badge-secondary badge-md">{ticket.priority || "Normal"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                <div className="group relative">
                  <span className="font-semibold text-base-content/80">Created By: </span>
                  <span>
                    {ticket.createdBy?.fullName || "Unknown"}
                    <span className="absolute hidden group-hover:block bg-base-300 text-sm p-2 rounded shadow z-10">
                      {ticket.createdBy?.email || "No email"}
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileTextIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Helpful Notes: </span>
                  {ticket.helpfulNotes || "None"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TagIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Related Skills: </span>
                  {ticket.relatedSkills?.length > 0 ? ticket.relatedSkills.join(", ") : "None"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-base-content/80">Created At: </span>
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 card rounded-2xl bg-base-100 border shadow-xl p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-primary mb-6">Solutions</h3>
          {successMessage && (
            <div className="alert alert-success mb-4" role="alert">
              <span>{successMessage}</span>
            </div>
          )}
          {addSolutionError && (
            <div className="alert alert-error mb-4" role="alert">
              <span>{addSolutionError.message}</span>
            </div>
          )}
          {leaderboardSuccess && (
            <div className="alert alert-success mb-4" role="alert">
              <span>{leaderboardSuccess}</span>
            </div>
          )}
          {addUserError && (
            <div className="alert alert-error mb-4" role="alert">
              <span>Failed to add to leaderboard: {addUserError.message}</span>
            </div>
          )}
          {isTicketComplete && (
            <div className="alert alert-success mb-4" role="alert">
              <span>Ticket completed successfully!</span>
            </div>
          )}
          {!isTicketCreator && (
            <div className="mb-6">
              <div className="relative">
                <textarea
                  className="textarea textarea-bordered w-full resize-y"
                  placeholder="Write your solution here..."
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value.slice(0, maxSolutionLength))}
                  disabled={isAddingSolution || hasSubmitted || isTicketComplete || isTicketInLeaderboard}
                  aria-label="Solution input"
                  maxLength={maxSolutionLength}
                />
                <span className="absolute bottom-2 right-2 text-sm text-base-content/60">
                  {solutionText.length}/{maxSolutionLength}
                </span>
              </div>
              <button
                className="btn btn-primary mt-4"
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
                {isAddingSolution ? <LoaderIcon className="animate-spin w-5 h-5" /> : "Submit Solution"}
              </button>
            </div>
          )}
          <div className="space-y-4">
            {ticket.solutions?.length > 0 ? (
              ticket.solutions.map((solution) => (
                <div
                  key={solution._id}
                  className={`border rounded-lg p-4 ${
                    acceptedSolutionId === solution._id
                      ? "bg-success/10 border-success"
                      : solution.user?._id === leaderboardUserId
                      ? "bg-accent/10 border-accent"
                      : "bg-base-200"
                  } animate-fade-in`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={solution.user?.profilePic || "/default-avatar.png"}
                      alt={`Profile picture of ${solution.user?.fullName || "Unknown"}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="group relative">
                      <p className="font-semibold flex items-center gap-2">
                        {solution.user?.fullName || "Unknown"}
                        {acceptedSolutionId === solution._id && (
                          <CheckCircleIcon className="w-5 h-5 text-success" aria-label="Accepted solution" />
                        )}
                        {solution.user?._id === leaderboardUserId && !acceptedSolutionId && (
                          <CheckCircleIcon className="w-5 h-5 text-accent" aria-label="Leaderboard solution" />
                        )}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {new Date(solution.createdAt).toLocaleString()}
                      </p>
                      <span className="absolute hidden group-hover:block bg-base-300 text-sm p-2 rounded shadow z-10">
                        {solution.user?.email || "No email"}
                      </span>
                    </div>
                  </div>
                  <p className="text-base-content/80">{solution.solutionText}</p>
                  {isTicketCreator && acceptedSolutionId !== solution._id && (
                    <button
                      className="btn btn-sm btn-outline btn-accent mt-2"
                      onClick={() => handleMarkAsAccepted(solution._id, solution.user?._id)}
                      disabled={isAddingUser || isTicketComplete}
                      aria-label={`Mark solution by ${solution.user?.fullName} as accepted`}
                    >
                      {isAddingUser ? <LoaderIcon className="animate-spin w-5 h-5" /> : "Mark as Accepted"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-base-content/60">No solutions submitted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;