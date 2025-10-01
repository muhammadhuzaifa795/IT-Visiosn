"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import { Toaster, toast } from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft, Trash2, Heart, MessageCircle, Calendar, ChevronDown, ChevronUp, Mail,
  Phone, Crown, Shield, Ticket, Award, BarChart3, FileText, Ban, UserCheck, RefreshCw,
  Image as ImageIcon, Video, Download, User as UserIcon
} from "lucide-react"
import useTickets from "../hooks/useTicket"
import useLeaderboard from "../hooks/useLeaderboard"
import { getUserById, getPostsByUserId, deletePost, toggleBanUser } from "../lib/api"
import { useAdminClearSubscription } from "../hooks/useSubscription"

// --- Helper Functions ---
const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
const getTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  if (diffInSeconds < 60) return "just now"
  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateString)
}

// --- Reusable UI Components ---
const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
    <span className="loading loading-spinner loading-lg text-primary"></span>
    <p className="mt-4 text-base-content/60">{text}</p>
  </div>
)

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="text-center py-16 bg-base-200/50 rounded-lg">
    <Icon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
    <h4 className="text-lg font-semibold mb-2 text-base-content/70">{title}</h4>
    <p className="text-base-content/50 max-w-sm mx-auto">{message}</p>
  </div>
)

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="card bg-base-100 shadow-md border border-base-300/30 transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="card-body p-4 items-center text-center">
      <Icon className={`w-8 h-8 ${color} mb-2`} />
      <div className="text-3xl font-bold text-base-content">{value}</div>
      <div className="text-sm text-base-content/60 mt-1">{label}</div>
    </div>
  </div>
)

const PostCard = ({ post, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = post.description && post.description.length > 200

  return (
    <div className="card bg-base-200 shadow-sm border border-base-300/30">
      <div className="card-body p-5">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h4 className="card-title text-lg text-base-content">{post.title}</h4>
          <button onClick={() => onDelete(post._id)} className="btn btn-error btn-sm btn-circle btn-ghost" title="Delete Post">
            <Trash2 size={16} />
          </button>
        </div>
        
        {post.description && (
          <div className="mb-4">
            <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
              {isExpanded ? post.description : `${post.description.substring(0, 200)}${shouldTruncate ? '...' : ''}`}
            </p>
            {shouldTruncate && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary text-sm font-semibold hover:underline mt-2 flex items-center gap-1">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        )}

        {post.attachments?.url && (
          <div className="mb-4">
            {post.attachments.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img src={post.attachments.url} alt="Post attachment" className="rounded-lg max-h-72 object-cover border border-base-300" />
            ) : post.attachments.url.match(/\.(mp4|webm|ogg)$/i) ? (
              <video controls className="rounded-lg max-h-72 border border-base-300">
                <source src={post.attachments.url} type="video/mp4" />
              </video>
            ) : (
              <a href={post.attachments.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm gap-2">
                <Download size={14} />
                {post.attachments.url.split("/").pop()}
              </a>
            )}
          </div>
        )}

        <div className="card-actions justify-between items-center mt-2">
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            <span className="flex items-center gap-1.5"><Heart size={14} /> {post.likes?.length || 0}</span>
            <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {post.comments?.length || 0}</span>
          </div>
          <div className="text-xs text-base-content/50">{getTimeAgo(post.createdAt)}</div>
        </div>
      </div>
    </div>
  )
}

// --- Main Page Component ---
const AdminUserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const { tickets = [], isFetching: isFetchingTickets, error: ticketsError } = useTickets()
  const { leaderboard = [], isFetching: isFetchingLeaderboard, error: leaderboardError } = useLeaderboard()
  const { clear: clearSubscription, isPending: isClearPending } = useAdminClearSubscription()

  const { mutate: banMutation, isPending: isBanPending } = useMutation({
    mutationFn: toggleBanUser,
    onSuccess: (data) => {
      toast.success(data.message)
      setUser(data.user)
      queryClient.invalidateQueries(['users'])
    },
    onError: (err) => toast.error(err.message || "Failed to update ban status"),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setPostsLoading(true)
        const [userData, userPosts] = await Promise.all([
          getUserById(userId),
          getPostsByUserId(userId)
        ])
        setUser(userData.user)
        setPosts(userPosts || [])
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to fetch user details or posts")
        navigate("/admin/users")
      } finally {
        setLoading(false)
        setPostsLoading(false)
      }
    }
    fetchData()
  }, [userId, navigate])
  
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to permanently delete this post?")) {
      try {
        await deletePost(postId)
        setPosts(posts.filter((post) => post._id !== postId))
        toast.success("Post deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete post")
      }
    }
  }

  const handleToggleBan = () => {
    if (!user.isBanned) {
      const reason = prompt("Enter a reason for banning this user:")
      if (!reason) return toast.error("Ban reason is required.")
      if (window.confirm(`Are you sure you want to ban this user for: ${reason}?`)) {
        banMutation({ userId, isBanned: true, reason })
      }
    } else {
      if (window.confirm("Are you sure you want to unban this user?")) {
        banMutation({ userId, isBanned: false })
      }
    }
  }

  const handleClearSubscription = async () => {
    if (window.confirm("Are you sure? This will downgrade the user to the free plan immediately.")) {
      try {
        await clearSubscription(userId)
        setUser(prev => ({...prev, subscription: 'free', subscriptionExpiresAt: null}))
        toast.success("Subscription cleared successfully!")
      } catch (err) {
        toast.error("Failed to clear subscription.")
      }
    }
  }
  
  const userTickets = useMemo(() => tickets.filter((ticket) => ticket.createdBy?._id === userId), [tickets, userId])
  const leaderboardEntry = useMemo(() => leaderboard.find((entry) => entry.userId === userId), [leaderboard, userId])
  const userRank = useMemo(() => leaderboard.findIndex((entry) => entry.userId === userId) + 1, [leaderboard, userId])

  const userStats = useMemo(() => ({
    totalPosts: posts.length,
    totalTickets: userTickets.length,
    totalLikes: posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
    rank: userRank > 0 ? `#${userRank}` : 'N/A',
  }), [posts, userTickets, userRank])

  if (loading) {
    return <LoadingSpinner text="Loading user profile..." />
  }
  
  const TABS = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "posts", label: `Posts (${posts.length})`, icon: FileText },
    { id: "tickets", label: `Tickets (${userTickets.length})`, icon: Ticket },
    { id: "leaderboard", label: "Leaderboard", icon: Award },
  ]
  
  return (
    <div className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-base-content">User Profile</h1>
            <p className="text-base-content/60 mt-1">Manage user activity and details</p>
          </div>
        </div>
        {user && (
          <div className="flex gap-2 self-end sm:self-center">
            {user.subscription !== "free" && (
              <button onClick={handleClearSubscription} className="btn btn-warning btn-sm gap-2" disabled={isClearPending}>
                <RefreshCw size={16} /> Clear Subscription
              </button>
            )}
            <button onClick={handleToggleBan} className={`btn btn-sm gap-2 ${user.isBanned ? "btn-success" : "btn-error"}`} disabled={isBanPending}>
              {user.isBanned ? <><UserCheck size={16} /> Unban</> : <><Ban size={16} /> Ban User</>}
            </button>
          </div>
        )}
      </header>

      {user && (
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - User Info */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="card bg-base-100 shadow-xl border border-base-300/30 p-6 sticky top-8">
              <div className="flex flex-col items-center text-center">
                <div className="avatar mb-4">
                  <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.fullName} />
                    ) : (
                      <div className="bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center w-full h-full">
                        <span className="text-4xl font-bold">{user.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
                      </div>
                    )}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">{user.fullName}</h2>
                <p className="text-base-content/60">@{user.username || 'username'}</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <span className="badge badge-lg badge-outline gap-1.5"><Shield size={12} /> {user.role}</span>
                  <span className={`badge badge-lg ${user.isBanned ? 'badge-error' : 'badge-success'}`}>{user.isBanned ? "Banned" : "Active"}</span>
                </div>
              </div>
              <div className="divider my-6">Details</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Mail size={16} className="text-base-content/60" /> <span className="truncate">{user.email}</span></div>
                {user.phone && <div className="flex items-center gap-3"><Phone size={16} className="text-base-content/60" /> <span>{user.phone}</span></div>}
                <div className="flex items-center gap-3"><Calendar size={16} className="text-base-content/60" /> <span>Joined {formatDate(user.createdAt)}</span></div>
                <div className="flex items-center gap-3"><Crown size={16} className="text-base-content/60" /> <span>{user.subscription} Plan</span></div>
              </div>
              {user.subscription !== 'free' && user.subscriptionExpiresAt &&
                <div className="mt-4 p-3 bg-info/10 rounded-lg text-center text-xs text-info">
                  Subscription expires on {formatDate(user.subscriptionExpiresAt)}
                </div>
              }
            </div>
          </aside>

          {/* Right Content - Tabs */}
          <section className="lg:col-span-8 xl:col-span-9">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={FileText} value={userStats.totalPosts} label="Posts Created" color="text-info" />
              <StatCard icon={Ticket} value={userStats.totalTickets} label="Tickets Raised" color="text-accent" />
              <StatCard icon={Heart} value={userStats.totalLikes} label="Likes Received" color="text-error" />
              <StatCard icon={Award} value={userStats.rank} label="Leaderboard Rank" color="text-warning" />
            </div>
            
            <div className="tabs tabs-boxed bg-base-100/80 mb-6 backdrop-blur-sm">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab tab-lg gap-2 ${activeTab === tab.id ? "tab-active !bg-primary !text-primary-content" : ""}`}>
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300/30">
              <div className="card-body">
                {activeTab === "overview" && (
                    <div className="prose max-w-none">
                        <h3 className="font-semibold text-xl mb-4">User Overview</h3>
                        <p>This section provides a summary of the user's activities and status. You can navigate through the tabs to view their specific posts, support tickets, and leaderboard performance.</p>
                        <ul>
                            <li><strong>Posts:</strong> View all content created by the user. You can delete posts if they violate community guidelines.</li>
                            <li><strong>Tickets:</strong> Review all support tickets submitted by the user and their current status.</li>
                            <li><strong>Leaderboard:</strong> Check the user's ranking and points based on their contributions.</li>
                        </ul>
                        <p>Use the action buttons in the header to manage the user's account, such as applying a ban or clearing their active subscription.</p>
                    </div>
                )}
                {activeTab === "posts" && (
                  postsLoading ? <LoadingSpinner text="Loading posts..." /> :
                  posts.length > 0 ? <div className="space-y-4">{posts.map(post => <PostCard key={post._id} post={post} onDelete={handleDeletePost} />)}</div> :
                  <EmptyState icon={FileText} title="No Posts Found" message="This user hasn't created any posts yet." />
                )}
                {activeTab === "tickets" && (
                  isFetchingTickets ? <LoadingSpinner text="Loading tickets..." /> :
                  ticketsError ? <EmptyState icon={Ticket} title="Error" message="Could not load user tickets." /> :
                  userTickets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead><tr><th>Title</th><th>Status</th><th>Created</th></tr></thead>
                        <tbody>
                          {userTickets.map(ticket => (
                            <tr key={ticket._id}>
                              <td>
                                <div className="font-bold">{ticket.title}</div>
                                <div className="text-sm opacity-60 max-w-md truncate">{ticket.description}</div>
                              </td>
                              <td><span className={`badge ${ticket.status.toLowerCase().includes('complete') ? 'badge-success' : 'badge-warning'}`}>{ticket.status}</span></td>
                              <td>{getTimeAgo(ticket.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <EmptyState icon={Ticket} title="No Tickets Found" message="This user hasn't submitted any support tickets." />
                )}
                {activeTab === "leaderboard" && (
                  isFetchingLeaderboard ? <LoadingSpinner text="Loading leaderboard..." /> :
                  leaderboardError ? <EmptyState icon={Award} title="Error" message="Could not load leaderboard data." /> :
                  leaderboardEntry ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="p-6 bg-base-200/60 rounded-lg"><div className="text-4xl font-extrabold text-warning">#{userRank}</div><div className="mt-2 text-base-content/70">Current Rank</div></div>
                        <div className="p-6 bg-base-200/60 rounded-lg"><div className="text-4xl font-extrabold text-info">{leaderboardEntry.totalPoints || 0}</div><div className="mt-2 text-base-content/70">Total Points</div></div>
                        <div className="p-6 bg-base-200/60 rounded-lg"><div className="text-4xl font-extrabold text-success">{leaderboardEntry.tickets?.length || 0}</div><div className="mt-2 text-base-content/70">Tickets Solved</div></div>
                    </div>
                  ) : <EmptyState icon={Award} title="Not on Leaderboard" message="This user is not currently ranked on the leaderboard." />
                )}
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  )
}

export default AdminUserProfile