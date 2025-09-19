import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { LoaderIcon, CalendarIcon, UserIcon, TagIcon, FileTextIcon, ClockIcon } from "lucide-react";
import useTickets from "../hooks/useTicket";
import useAuthUser from "../hooks/useAuthUser";

const TicketDetailPage = () => {
    const { id } = useParams();
    const { useTicketById, addSolution, isAddingSolution, addSolutionError } = useTickets();
    const { data: ticket, isLoading, error } = useTicketById(id);
    const [solutionText, setSolutionText] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { authUser, isLoading: isAuthLoading } = useAuthUser();

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoaderIcon className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-lg text-error">Failed to load ticket details</p>;
    }

    const currentUserId = authUser?._id;
    const isImage = ticket.attachments?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isVideo = ticket.attachments?.url?.match(/\.(mp4|webm|ogg)$/i);
    const hasSubmitted = (ticket.solutions || []).some(
        (solution) => solution.user?._id?.toString() === currentUserId
    );
    const isTicketCreator = ticket.createdBy?._id?.toString() === currentUserId;

    const handleSolutionSubmit = () => {
        if (!solutionText.trim()) return;
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
    };

    return (
        <div className="min-h-screen py-12 px-6 bg-base-200">
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/tickets"
                    className="btn btn-ghost mb-8 flex items-center gap-2 sticky top-4 z-10 bg-base-100 rounded-lg shadow hover:bg-base-300 transition-colors"
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
                                    alt="Attachment"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            )}
                            {isVideo && (
                                <video controls className="w-full h-full object-cover">
                                    <source src={ticket.attachments.url} type="video/mp4" />
                                </video>
                            )}
                        </figure>
                    ) : (
                        <div className="h-80 bg-base-200 flex items-center justify-center rounded-t-2xl">
                            <span className="text-lg text-base-content">No Attachment</span>
                        </div>
                    )}
                    <div className="card-body p-8">
                        <h2 className="card-title text-3xl font-bold tracking-tight text-primary">{ticket.title}</h2>
                        <p className="text-base leading-relaxed text-base-content/80">{ticket.description}</p>
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <TagIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="font-semibold">Status: </span>
                                    <span className="badge badge-primary">{ticket.status}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="font-semibold">Assigned To: </span>
                                    {ticket.assignedTo?.length > 0
                                        ? ticket.assignedTo.map((u) => u.fullName).join(", ")
                                        : "Unassigned"}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TagIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="font-semibold">Priority: </span>
                                    <span className="badge badge-secondary">{ticket.priority || "Normal"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileTextIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="font-semibold">Helpful Notes: </span>
                                    {ticket.helpfulNotes || "None"}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TagIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="font-semibold">Related Skills: </span>
                                    {ticket.relatedSkills?.length > 0 ? ticket.relatedSkills.join(", ") : "None"}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ClockIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="font-semibold">Created At: </span>
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 card rounded-2xl bg-base-100 border shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-primary mb-6">Solutions</h3>
                    {successMessage && (
                        <div className="alert alert-success mb-4">
                            <span>{successMessage}</span>
                        </div>
                    )}
                    {addSolutionError && (
                        <div className="alert alert-error mb-4">
                            <span>{addSolutionError.message}</span>
                        </div>
                    )}
                    {!isTicketCreator && (
                        <div className="mb-6">
                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Write your solution here..."
                                value={solutionText}
                                onChange={(e) => setSolutionText(e.target.value)}
                                disabled={isAddingSolution || hasSubmitted}
                            />
                            <button
                                className="btn btn-primary mt-4"
                                onClick={handleSolutionSubmit}
                                disabled={isAddingSolution || hasSubmitted}
                            >
                                {isAddingSolution ? <LoaderIcon className="animate-spin w-5 h-5" /> : "Submit Solution"}
                            </button>
                        </div>
                    )}
                    <div className="space-y-4">
                        {ticket.solutions?.length > 0 ? (
                            ticket.solutions.map((solution) => (
                                <div key={solution._id} className="border rounded-lg p-4 bg-base-200 animate-fade-in">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={solution.user.profilePic}
                                            alt={solution.user.fullName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">{solution.user.fullName}</p>
                                            <p className="text-sm text-base-content/60">
                                                {new Date(solution.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-base-content/80">{solution.solutionText}</p>
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