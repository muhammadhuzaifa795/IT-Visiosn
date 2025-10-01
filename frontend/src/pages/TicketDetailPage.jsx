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
  LightbulbIcon,
  EyeIcon,
  MessageSquareIcon,
  AwardIcon,
  StarIcon,
  ThumbsUpIcon,
  ShareIcon,
  BookmarkIcon,
  NotebookIcon,
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
  const [showHelpfulNotesModal, setShowHelpfulNotesModal] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState(null);
  const maxSolutionLength = 500;

  if (isLoading || isAuthLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 flex justify-center items-center">
        <div className="text-center">
          <LoaderIcon className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-base-content/60">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 flex justify-center items-center">
        <div className="card bg-base-100 shadow-xl border border-base-300/30 max-w-md">
          <div className="card-body text-center">
            <div className="text-error text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-error mb-2">Failed to Load Data</h3>
            <p className="text-base-content/60 mb-4">
              {error?.message || fetchError?.message || "Unknown error occurred"}
            </p>
            <Link to="/tickets" className="btn btn-primary">
              Back to Tickets
            </Link>
          </div>
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

  // Helper function to truncate helpful notes
  const truncateHelpfulNotes = (notes, wordLimit = 10) => {
    if (!notes) return "No helpful notes available";
    const words = notes.split(' ');
    if (words.length <= wordLimit) return notes;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Format helpful notes with better structure
  const formatHelpfulNotes = (notes) => {
    if (!notes) return "No helpful notes provided for this ticket.";
    
    // Split by common formatting patterns
    const formattedNotes = notes
      .split('\n')
      .map(line => {
        // Remove extra whitespace
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';
        
        // Add bullet points for list items
        if (trimmedLine.match(/^[•\-*]\s/)) {
          return `• ${trimmedLine.substring(2)}`;
        }
        
        // Add numbering for numbered lists
        if (trimmedLine.match(/^\d+\.\s/)) {
          return trimmedLine;
        }
        
        return trimmedLine;
      })
      .filter(line => line !== '')
      .join('\n\n');
    
    return formattedNotes;
  };

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
    setSelectedSolutionId(solutionId);
    if (window.confirm("Mark this solution as accepted? This will add the user to the leaderboard.")) {
      addUserToLeaderboard(
        { userId, ticketId: id },
        {
          onSuccess: () => {
            setLeaderboardSuccess(
              `${ticket.solutions.find((s) => s._id === solutionId)?.user?.fullName}'s solution marked as accepted and added to leaderboard!`
            );
            setTimeout(() => setLeaderboardSuccess(""), 3000);
            setSelectedSolutionId(null);
          },
          onError: () => {
            setSelectedSolutionId(null);
          }
        }
      );
    } else {
      setSelectedSolutionId(null);
    }
  };

  const dismissAlert = (setter) => () => setter("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
      {/* Header Section */}
      <div className="bg-base-100/80 backdrop-blur-sm border-b border-base-300/30 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/tickets"
                className="btn btn-ghost btn-sm flex items-center gap-2 hover:bg-base-300/50 transition-all duration-200 hover:scale-105"
                aria-label="Back to tickets list"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Tickets
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-sm text-base-content/60">
                <span>Ticket ID:</span>
                <span className="font-mono bg-base-200 px-2 py-1 rounded border border-base-300">{id}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isTicketComplete && (
                <div className="badge badge-success gap-1 px-3 py-2">
                  <CheckCircleIcon className="w-3 h-3" />
                  Completed
                </div>
              )}
              <div className={`badge px-3 py-2 ${
                ticket.priority === 'high' ? 'badge-error' : 
                ticket.priority === 'medium' ? 'badge-warning' : 'badge-primary'
              }`}>
                {ticket.priority || "Normal"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        <div className="space-y-4 mb-8">
          {successMessage && (
            <div className="alert alert-success shadow-lg flex justify-between items-center animate-fade-in" role="alert">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={dismissAlert(setSuccessMessage)}
                className="btn btn-ghost btn-sm btn-circle hover:bg-success/20"
                aria-label="Dismiss success message"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          {addSolutionError && (
            <div className="alert alert-error shadow-lg flex justify-between items-center animate-shake" role="alert">
              <div className="flex items-center gap-2">
                <XCircleIcon className="w-5 h-5" />
                <span>{addSolutionError.message}</span>
              </div>
              <button
                onClick={dismissAlert(() => {})}
                className="btn btn-ghost btn-sm btn-circle hover:bg-error/20"
                aria-label="Dismiss error message"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          {leaderboardSuccess && (
            <div className="alert alert-success shadow-lg flex justify-between items-center animate-bounce-in" role="alert">
              <div className="flex items-center gap-2">
                <AwardIcon className="w-5 h-5" />
                <span>{leaderboardSuccess}</span>
              </div>
              <button
                onClick={dismissAlert(setLeaderboardSuccess)}
                className="btn btn-ghost btn-sm btn-circle hover:bg-success/20"
                aria-label="Dismiss leaderboard success message"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          {addUserError && (
            <div className="alert alert-error shadow-lg flex justify-between items-center animate-shake" role="alert">
              <div className="flex items-center gap-2">
                <XCircleIcon className="w-5 h-5" />
                <span>Failed to add to leaderboard: {addUserError.message}</span>
              </div>
              <button
                onClick={dismissAlert(() => {})}
                className="btn btn-ghost btn-sm btn-circle hover:bg-error/20"
                aria-label="Dismiss leaderboard error message"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Card */}
            <div className="card bg-base-100 shadow-2xl border border-base-300/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
              {/* Attachment Section */}
              {ticket.attachments?.url ? (
                <figure className="h-64 sm:h-80 overflow-hidden rounded-t-2xl relative group">
                  {isImage && (
                    <img
                      src={ticket.attachments.url}
                      alt={`Attachment for ticket: ${ticket.title}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                    <div className="h-64 sm:h-80 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                      <DownloadIcon className="w-16 h-16 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <a
                        href={ticket.attachments.url}
                        download
                        className="btn btn-primary gap-2 hover:scale-105 transition-all duration-200"
                        aria-label="Download attachment"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        Download Attachment
                      </a>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className={`badge badge-lg px-3 py-2 ${
                      ticket.priority === 'high' ? 'badge-error' : 
                      ticket.priority === 'medium' ? 'badge-warning' : 'badge-primary'
                    }`}>
                      {ticket.priority || "Normal"}
                    </div>
                    {isTicketComplete && (
                      <div className="badge badge-success badge-lg gap-1 px-3 py-2">
                        <CheckCircleIcon className="w-3 h-3" />
                        Completed
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-t-2xl"></div>
                </figure>
              ) : (
                <div className="h-48 bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center rounded-t-2xl group hover:from-base-300 hover:to-base-400 transition-all duration-300">
                  <FileTextIcon className="w-16 h-16 text-base-content/40 group-hover:scale-110 group-hover:text-base-content/60 transition-all duration-300" />
                </div>
              )}

              {/* Ticket Details */}
              <div className="card-body p-6 sm:p-8">
                <h1 className="card-title text-2xl sm:text-3xl font-bold text-base-content mb-4 leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {ticket.title}
                </h1>

                <p className="text-base-content/80 text-lg leading-relaxed mb-6 bg-base-200/50 p-4 rounded-xl border border-base-300/30 hover:bg-base-300/50 transition-all duration-300">
                  {ticket.description}
                </p>

                {/* Ticket Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl border border-base-300/30 hover:bg-base-300/50 hover:border-base-300/50 transition-all duration-300 group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
                      <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-base-content/80 text-sm">Created By</div>
                      <div className="text-base-content font-medium">{ticket.createdBy?.fullName || "Unknown"}</div>
                      <div className="text-xs text-base-content/60">{ticket.createdBy?.email || "No email"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl border border-base-300/30 hover:bg-base-300/50 hover:border-base-300/50 transition-all duration-300 group">
                    <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-all duration-300">
                      <UserIcon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-semibold text-base-content/80 text-sm">Assigned To</div>
                      <div className="text-base-content font-medium">
                        {ticket.assignedTo?.length > 0 
                          ? ticket.assignedTo.map(u => u.fullName).join(", ")
                          : "Unassigned"
                        }
                      </div>
                    </div>
                  </div>

                  <div 
                    className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl border border-base-300/30 hover:bg-warning/10 hover:border-warning/30 cursor-pointer transition-all duration-300 group"
                    onClick={() => setShowHelpfulNotesModal(true)}
                  >
                    <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-all duration-300">
                      <NotebookIcon className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base-content/80 text-sm">Helpful Notes</div>
                      <div className="text-base-content font-medium line-clamp-1">
                        {truncateHelpfulNotes(ticket.helpfulNotes)}
                      </div>
                    </div>
                    <EyeIcon className="w-4 h-4 text-base-content/40 group-hover:text-warning transition-colors duration-300" />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl border border-base-300/30 hover:bg-base-300/50 hover:border-base-300/50 transition-all duration-300 group">
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-all duration-300">
                      <TagIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-base-content/80 text-sm">Related Skills</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ticket.relatedSkills?.length > 0 
                          ? ticket.relatedSkills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="badge badge-outline badge-sm hover:badge-primary transition-all duration-200 cursor-default">
                                {skill}
                              </span>
                            ))
                          : <span className="text-base-content/60">None</span>
                        }
                        {ticket.relatedSkills?.length > 3 && (
                          <span className="badge badge-ghost badge-sm">
                            +{ticket.relatedSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl border border-base-300/30 hover:bg-base-300/50 hover:border-base-300/50 transition-all duration-300 group">
                    <div className="p-2 bg-info/10 rounded-lg group-hover:bg-info/20 transition-all duration-300">
                      <ClockIcon className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <div className="font-semibold text-base-content/80 text-sm">Created At</div>
                      <div className="text-base-content font-medium">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl border border-base-300/30 hover:bg-base-300/50 hover:border-base-300/50 transition-all duration-300 group">
                    <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-all duration-300">
                      <MessageSquareIcon className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-base-content/80 text-sm">Solutions</div>
                      <div className="text-base-content font-medium">
                        {ticket.solutions?.length || 0} submitted
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solutions Section */}
            <div className="card bg-base-100 shadow-2xl border border-base-300/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="card-body p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-0 flex items-center gap-2">
                    <MessageSquareIcon className="w-6 h-6" />
                    Solutions ({ticket.solutions?.length || 0})
                  </h3>
                  
                  {!isTicketCreator && (
                    <div className="flex items-center gap-3 text-sm">
                      {hasSubmitted && (
                        <span className="text-success flex items-center gap-1 bg-success/10 px-3 py-1 rounded-full">
                          <CheckCircleIcon className="w-4 h-4" />
                          Solution Submitted
                        </span>
                      )}
                      {isTicketComplete && (
                        <span className="text-warning flex items-center gap-1 bg-warning/10 px-3 py-1 rounded-full">
                          <AwardIcon className="w-4 h-4" />
                          Ticket Completed
                        </span>
                      )}
                      {isTicketInLeaderboard && (
                        <span className="text-info flex items-center gap-1 bg-info/10 px-3 py-1 rounded-full">
                          <StarIcon className="w-4 h-4" />
                          Solution Accepted
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Solution Input Form */}
                {!isTicketCreator && !hasSubmitted && !isTicketComplete && !isTicketInLeaderboard && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 hover:border-primary/30 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <LightbulbIcon className="w-5 h-5 text-primary" />
                      Submit Your Solution
                    </h4>
                    <div className="relative mb-4">
                      <textarea
                        className="textarea textarea-bordered w-full resize-y focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg rounded-xl"
                        placeholder="Share your solution... Be detailed and helpful!"
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value.slice(0, maxSolutionLength))}
                        disabled={isAddingSolution}
                        aria-label="Solution input"
                        maxLength={maxSolutionLength}
                        rows={5}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-base-content/60">
                          {maxSolutionLength - solutionText.length} characters remaining
                        </div>
                        <div className="text-sm text-base-content/60">
                          {solutionText.length}/{maxSolutionLength}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary gap-2 w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                      onClick={handleSolutionSubmit}
                      disabled={isAddingSolution || !solutionText.trim()}
                      aria-label="Submit solution"
                    >
                      {isAddingSolution ? (
                        <LoaderIcon className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          <ThumbsUpIcon className="w-5 h-5" />
                          Submit Solution
                        </>
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
                        className={`border rounded-2xl p-6 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1 ${
                          acceptedSolutionId === solution._id
                            ? "bg-gradient-to-br from-success/10 to-success/5 border-success/30 ring-2 ring-success/20"
                            : solution.user?._id === leaderboardUserId
                            ? "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 ring-2 ring-accent/20"
                            : "bg-base-100 border-base-300/30 hover:border-base-300/50"
                        }`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={solution.user?.profilePic || "/default-avatar.png"}
                            alt={`Profile picture of ${solution.user?.fullName || "Unknown"}`}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-base-300 hover:border-primary transition-all duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-bold text-lg text-base-content">
                                {solution.user?.fullName || "Unknown"}
                              </p>
                              {acceptedSolutionId === solution._id && (
                                <div className="badge badge-success gap-1 px-3 py-2 animate-pulse">
                                  <AwardIcon className="w-3 h-3" />
                                  Accepted Solution
                                </div>
                              )}
                              {solution.user?._id === leaderboardUserId && !acceptedSolutionId && (
                                <div className="badge badge-accent gap-1 px-3 py-2">
                                  <StarIcon className="w-3 h-3" />
                                  Accepted Solution
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-base-content/60 flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {new Date(solution.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-base-content/80 text-lg leading-relaxed whitespace-pre-wrap bg-base-200/50 p-4 rounded-xl border border-base-300/30 hover:bg-base-300/50 transition-all duration-300">
                          {solution.solutionText}
                        </p>
                        {isTicketCreator && acceptedSolutionId !== solution._id && !isTicketComplete && (
                          <div className="mt-4 flex justify-end">
                            <button
                              className={`btn gap-2 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl ${
                                selectedSolutionId === solution._id 
                                  ? 'btn-disabled loading' 
                                  : 'btn-accent'
                              }`}
                              onClick={() => handleMarkAsAccepted(solution._id, solution.user?._id)}
                              disabled={isAddingUser || selectedSolutionId === solution._id}
                              aria-label={`Mark solution by ${solution.user?.fullName} as accepted`}
                            >
                              {selectedSolutionId === solution._id ? (
                                "Processing..."
                              ) : (
                                <>
                                  <CheckCircleIcon className="w-5 h-5" />
                                  Mark as Accepted
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquareIcon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-base-content/70 mb-2">No Solutions Yet</h4>
                      <p className="text-base-content/50">
                        {!isTicketCreator 
                          ? "Be the first to submit a solution and help solve this ticket!" 
                          : "No solutions have been submitted yet."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}


            {/* Ticket Stats */}
            <div className="card bg-base-100 shadow-2xl border border-base-300/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="card-body p-6">
                <h4 className="font-semibold text-lg mb-4">Ticket Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 hover:bg-base-200/50 rounded-lg transition-all duration-200">
                    <span className="text-base-content/70">Status</span>
                    <span className={`badge ${isTicketComplete ? 'badge-success' : 'badge-primary'} px-3 py-2`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-base-200/50 rounded-lg transition-all duration-200">
                    <span className="text-base-content/70">Priority</span>
                    <span className={`badge px-3 py-2 ${
                      ticket.priority === 'high' ? 'badge-error' : 
                      ticket.priority === 'medium' ? 'badge-warning' : 'badge-primary'
                    }`}>
                      {ticket.priority || "Normal"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-base-200/50 rounded-lg transition-all duration-200">
                    <span className="text-base-content/70">Solutions</span>
                    <span className="font-semibold text-lg">{ticket.solutions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-base-200/50 rounded-lg transition-all duration-200">
                    <span className="text-base-content/70">Created</span>
                    <span className="text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Skills */}
            {ticket.relatedSkills?.length > 0 && (
              <div className="card bg-base-100 shadow-2xl border border-base-300/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="card-body p-6">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-accent" />
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {ticket.relatedSkills.map((skill, index) => (
                      <span key={index} className="badge badge-primary badge-lg hover:badge-secondary transition-all duration-200 cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helpful Notes Modal */}
      {showHelpfulNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-base-300/30">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <NotebookIcon className="w-6 h-6 text-warning" />
                Helpful Notes
              </h3>
              <button
                onClick={() => setShowHelpfulNotesModal(false)}
                className="btn btn-ghost btn-sm btn-circle hover:bg-base-300 transition-all duration-200"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 hover:bg-warning/15 transition-all duration-300">
              <div className="prose prose-lg max-w-none">
                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap font-medium">
                  {formatHelpfulNotes(ticket.helpfulNotes)}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end pt-4 border-t border-base-300/30">
              <button
                className="btn btn-primary hover:scale-105 active:scale-95 transition-all duration-200"
                onClick={() => setShowHelpfulNotesModal(false)}
              >
                Close Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailPage;