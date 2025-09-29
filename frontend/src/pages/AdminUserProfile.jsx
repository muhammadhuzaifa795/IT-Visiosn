"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { Toaster, toast } from "react-hot-toast"
import {
  ArrowLeft,
  Trash2,
  Heart,
  MessageCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Crown,
  Shield,
  User,
  Ticket,
  Award,
  BarChart3,
  FileText,
  Video,
  Image,
  Download,
  Ban,
  UserCheck,
  RefreshCw
} from "lucide-react"
import useTickets from "../hooks/useTicket"
import useLeaderboard from "../hooks/useLeaderboard"
import { getUserById, getPostsByUserId, deletePost, toggleBanUser } from "../lib/api"
import { useMutation } from "@tanstack/react-query"
import { useAdminClearSubscription } from "../hooks/useSubscription"

const AdminUserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const [activeTab, setActiveTab] = useState("overview")
  const { tickets, isFetching: isFetchingTickets, fetchError: ticketsError } = useTickets()
  const { leaderboard, isFetching: isFetchingLeaderboard, fetchError: leaderboardError } = useLeaderboard()
  const { clear: clearSubscription, isPending: isClearPending } = useAdminClearSubscription()

  const { mutate: banMutation, isPending: isBanPending } = useMutation({
    mutationFn: toggleBanUser,
    onSuccess: (data) => {
      toast.success(data.message)
      setUser(data.user)
    },
    onError: () => {
      toast.error("Failed to update user ban status")
    }
  })

  const fetchUser = async () => {
    try {
      const userData = await getUserById(userId)
      setUser(userData.user)
    } catch (error) {
      console.error("Error fetching user:", error)
      toast.error("Failed to fetch user details")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      console.log("[v0] Fetching posts for userId:", userId)
      const userPosts = await getPostsByUserId(userId)
      console.log("[v0] User posts received:", userPosts)
      console.log("[v0] User posts length:", userPosts?.length)
      setPosts(userPosts || [])
    } catch (error) {
      console.error("Error fetching user posts:", error)
      toast.error("Failed to fetch user posts")
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchUserPosts()
  }, [userId])

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deletePost(postId)
        setPosts(posts.filter((post) => post._id !== postId))
        toast.success("Post deleted successfully!")
      } catch (error) {
        console.error("Error deleting post:", error)
        toast.error("Failed to delete post")
      }
    }
  }

  const handleToggleBan = () => {
    if (!user.isBanned) {
      const reason = prompt("Enter reason for banning this user:")
      if (!reason) return toast.error("Ban reason is required")
      if (!confirm(`Are you sure you want to ban this user?\nReason: ${reason}`)) return
      banMutation({ userId, isBanned: true, reason })
    } else {
      if (!confirm("Are you sure you want to unban this user?")) return
      banMutation({ userId, isBanned: false })
    }
  }

  const handleClearSubscription = async () => {
    if (window.confirm("Are you sure you want to clear this user's subscription? This will downgrade them to free plan.")) {
      try {
        await clearSubscription(userId)
        toast.success("Subscription cleared successfully!")
        fetchUser() // Refresh user data
      } catch (err) {
        toast.error("Failed to clear subscription")
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return formatDate(dateString)
  }

  const togglePostExpansion = (postId) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const getSubscriptionBadge = (subscription) => {
    const badges = {
      free: "badge-ghost",
      monthly: "badge-primary",
      yearly: "badge-secondary"
    }
    return badges[subscription] || "badge-ghost"
  }

  const getSubscriptionText = (subscription) => {
    const texts = {
      free: "Free",
      monthly: "Monthly Pro",
      yearly: "Yearly Pro"
    }
    return texts[subscription] || "Free"
  }

  // Filter user-specific tickets
  const userTickets = tickets.filter((ticket) => ticket.createdBy?._id === userId)

  // Find user in leaderboard
  const userLeaderboard = leaderboard.find((entry) => entry.userId === userId)
  const userRank = leaderboard.findIndex((entry) => entry.userId === userId) + 1

  // Calculate user stats
  const userStats = {
    totalPosts: posts.length,
    totalTickets: userTickets.length,
    completedTickets: userTickets.filter(t => t.status === "completed" || t.status === "complete").length,
    totalLikes: posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
    totalComments: posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/60">Loading user profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="btn btn-ghost btn-circle hover:bg-base-300/50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-base-content/60 mt-1">Manage and view user details</p>
          </div>
        </div>

        {user && (
          <div className="flex gap-2">
            {user.subscription !== "free" && (
              <button
                onClick={handleClearSubscription}
                className="btn btn-warning btn-sm gap-2"
                disabled={isClearPending}
              >
                <RefreshCw size={16} />
                Clear Sub
              </button>
            )}
            <button
              onClick={handleToggleBan}
              className={`btn btn-sm gap-2 ${user.isBanned ? "btn-success" : "btn-error"}`}
              disabled={isBanPending}
            >
              {user.isBanned ? <UserCheck size={16} /> : <Ban size={16} />}
              {user.isBanned ? "Unban" : "Ban"}
            </button>
          </div>
        )}
      </div>

      {user && (
        <div className="space-y-6">
          {/* User Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* User Profile Card */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-xl border border-base-300/30">
                <div className="card-body items-center text-center">
                  <div className="avatar mb-4">
                    {user.profilePic ? (
                      <div className="w-24 rounded-full overflow-hidden">
                        <img src={user.profilePic} alt={user.fullName || "User"} />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-24 h-24 flex items-center justify-center">
                        <span className="text-2xl font-bold">
                          {user.fullName?.charAt(0)?.toUpperCase() || user.fullname?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>


                  <h2 className="card-title text-xl mb-2">{user.fullName || user.fullname}</h2>

                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-ghost"}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </span>
                    <span className={`badge ${getSubscriptionBadge(user.subscription)}`}>
                      <Crown className="w-3 h-3 mr-1" />
                      {getSubscriptionText(user.subscription)}
                    </span>
                    <span className={`badge ${user.isBanned ? "badge-error" : "badge-success"}`}>
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </div>

                  {user.subscriptionExpiresAt && user.subscription !== "free" && (
                    <div className="mt-3 p-2 bg-warning/10 rounded-lg border border-warning/20">
                      <p className="text-xs text-warning flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Subscription expires {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card bg-base-100 shadow-lg border border-base-300/30">
                <div className="card-body p-4 text-center">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-base-content">{userStats.totalPosts}</div>
                  <div className="text-sm text-base-content/60">Total Posts</div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg border border-base-300/30">
                <div className="card-body p-4 text-center">
                  <Ticket className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-base-content">{userStats.totalTickets}</div>
                  <div className="text-sm text-base-content/60">Tickets</div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg border border-base-300/30">
                <div className="card-body p-4 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-base-content">{userStats.totalLikes}</div>
                  <div className="text-sm text-base-content/60">Total Likes</div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg border border-base-300/30">
                <div className="card-body p-4 text-center">
                  <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-base-content">{userRank || "-"}</div>
                  <div className="text-sm text-base-content/60">Leaderboard Rank</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs tabs-boxed bg-base-200 p-1 rounded-xl w-fit">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "posts", label: "Posts", icon: FileText },
              { id: "tickets", label: "Tickets", icon: Ticket },
              { id: "leaderboard", label: "Leaderboard", icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="card bg-base-100 shadow-lg border border-base-300/30">
              <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    User Posts ({posts.length})
                  </h3>
                  <div className="text-sm text-base-content/60">
                    {userStats.totalLikes} likes • {userStats.totalComments} comments
                  </div>
                </div>

                {postsLoading ? (
                  <div className="text-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading posts...</p>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => {
                      const isExpanded = expandedPosts.has(post._id)
                      const shouldTruncate = post.description && post.description.length > 150

                      return (
                        <div key={post._id} className="card bg-base-200 shadow-sm border border-base-300/30 hover:shadow-md transition-all">
                          <div className="card-body">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-semibold text-lg text-base-content line-clamp-2">{post.title}</h4>
                                  <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className="btn btn-error btn-sm btn-square flex-shrink-0"
                                    title="Delete Post"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                {post.description && (
                                  <div className="mb-3">
                                    <p className="text-base-content/80 leading-relaxed">
                                      {isExpanded || !shouldTruncate ? post.description : truncateText(post.description)}
                                    </p>
                                    {shouldTruncate && (
                                      <button
                                        onClick={() => togglePostExpansion(post._id)}
                                        className="text-primary text-sm font-medium hover:underline mt-2 flex items-center gap-1"
                                      >
                                        {isExpanded ? (
                                          <>
                                            <ChevronUp size={14} />
                                            Show less
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown size={14} />
                                            Read more
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Media Attachments */}
                                {post.attachments?.url && (
                                  <div className="mb-3">
                                    {post.attachments.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                      <div className="flex items-center gap-2">
                                        <Image className="w-4 h-4 text-green-500" />
                                        <img
                                          src={post.attachments.url || "/placeholder.svg"}
                                          alt="Post attachment"
                                          className="rounded-lg max-w-xs h-32 object-cover border border-base-300"
                                        />
                                      </div>
                                    ) : post.attachments.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                      <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-blue-500" />
                                        <video controls className="rounded-lg max-w-xs h-32 border border-base-300">
                                          <source src={post.attachments.url} type="video/mp4" />
                                        </video>
                                      </div>
                                    ) : (
                                      <div className="badge badge-outline gap-2">
                                        <Download size={12} />
                                        {post.attachments.url.split("/").pop()}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Post Stats and Meta */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-base-content/60">
                                    <span className="flex items-center gap-1">
                                      <Heart size={14} />
                                      {post.likes?.length || 0} likes
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageCircle size={14} />
                                      {post.comments?.length || 0} comments
                                    </span>
                                  </div>
                                  <div className="text-xs text-base-content/50">
                                    {getTimeAgo(post.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2 text-base-content/70">No Posts Yet</h4>
                    <p className="text-base-content/50">This user hasn't created any posts.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <div className="card bg-base-100 shadow-lg border border-base-300/30">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  User Tickets ({userTickets.length})
                </h3>

                {isFetchingTickets ? (
                  <div className="text-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading tickets...</p>
                  </div>
                ) : ticketsError ? (
                  <div className="text-center py-12">
                    <div className="text-error mb-4">❌</div>
                    <h4 className="text-lg font-semibold mb-2 text-error">Error Loading Tickets</h4>
                    <p className="text-base-content/60">Failed to load user tickets.</p>
                  </div>
                ) : userTickets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead className="bg-base-200/50">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Title</th>
                          <th className="px-6 py-4 text-left font-semibold">Description</th>
                          <th className="px-6 py-4 text-left font-semibold">Status</th>
                          <th className="px-6 py-4 text-left font-semibold">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTickets.map((ticket) => (
                          <tr key={ticket._id} className="hover:bg-base-200/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-base-content">{ticket.title}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-base-content/70 max-w-md line-clamp-2">
                                {ticket.description}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`badge badge-lg ${ticket.status === "completed" || ticket.status === "complete"
                                  ? "badge-success"
                                  : "badge-warning"
                                }`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-base-content/60">
                                {getTimeAgo(ticket.createdAt)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Ticket className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2 text-base-content/70">No Tickets Yet</h4>
                    <p className="text-base-content/50">This user hasn't created any support tickets.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div className="card bg-base-100 shadow-lg border border-base-300/30">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Leaderboard Performance
                </h3>

                {isFetchingLeaderboard ? (
                  <div className="text-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading leaderboard data...</p>
                  </div>
                ) : leaderboardError ? (
                  <div className="text-center py-12">
                    <div className="text-error mb-4">❌</div>
                    <h4 className="text-lg font-semibold mb-2 text-error">Error Loading Data</h4>
                    <p className="text-base-content/60">Failed to load leaderboard information.</p>
                  </div>
                ) : userLeaderboard ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20">
                      <div className="card-body text-center">
                        <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-base-content">#{userRank}</div>
                        <div className="text-base-content/60">Current Rank</div>
                      </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                      <div className="card-body text-center">
                        <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-base-content">{userLeaderboard.totalPoints || 0}</div>
                        <div className="text-base-content/60">Total Points</div>
                      </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                      <div className="card-body text-center">
                        <Ticket className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-base-content">{userLeaderboard.tickets?.length || 0}</div>
                        <div className="text-base-content/60">Tickets Solved</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Award className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2 text-base-content/70">Not on Leaderboard</h4>
                    <p className="text-base-content/50">This user is not currently ranked on the leaderboard.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminUserProfile