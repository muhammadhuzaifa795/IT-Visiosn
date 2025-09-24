

"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { Toaster, toast } from "react-hot-toast"
import { ArrowLeft, Trash2, Heart, MessageCircle, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import useTickets from "../hooks/useTicket"
import useLeaderboard from "../hooks/useLeaderboard"
import { getUserById, getPostsByUserId, deletePost } from "../lib/api"

const AdminUserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const { tickets, isFetching: isFetchingTickets, fetchError: ticketsError } = useTickets()
  const { leaderboard, isFetching: isFetchingLeaderboard, fetchError: leaderboardError } = useLeaderboard()

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
    if (window.confirm("Are you sure you want to delete this post?")) {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  // Filter user-specific tickets
  const userTickets = tickets.filter((ticket) => ticket.createdBy?._id === userId)

  // Find user in leaderboard
  const userLeaderboard = leaderboard.find((entry) => entry.userId === userId)

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading user profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <Toaster position="top-right" />

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/admin/users")} className="btn btn-ghost btn-circle">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      {user && (
        <div className="space-y-6">
          {/* User Details */}
          <div className="card bg-base-200 shadow-lg border border-base-300/30">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-16">
                    <span className="text-xl font-bold">
                      {user.fullName?.charAt(0)?.toUpperCase() || user.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="card-title text-xl">{user.fullName || user.fullname}</h2>
                  <p className="text-base-content/70">{user.email}</p>
                  <p className="text-base-content/70">{user.phone || "No phone"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-neutral"}`}>
                      {user.role}
                    </span>
                    <span className="text-sm text-base-content/60">
                      <Calendar size={14} className="inline mr-1" />
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Posts */}
          <div className="card bg-base-200 shadow-lg border border-base-300/30">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">User Posts ({posts.length})</h3>
              </div>

              {postsLoading ? (
                <div className="text-center py-8">
                  <span className="loading loading-spinner loading-md"></span>
                  <p className="mt-2">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-2">
                  {posts.map((post) => {
                    const isExpanded = expandedPosts.has(post._id)
                    const shouldTruncateDesc = post.description && post.description.length > 150
                    const shouldTruncateLongDesc = post.longDesc && post.longDesc.length > 150

                    return (
                      <div key={post._id} className="card bg-base-100 shadow-sm border border-base-300/30">
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-2 line-clamp-2">{post.title}</h4>

                              {post.description && (
                                <div className="mb-2">
                                  <p className="text-base-content/80 text-sm leading-relaxed">
                                    {isExpanded || !shouldTruncateDesc ? post.description : truncateText(post.description)}
                                  </p>
                                  {shouldTruncateDesc && (
                                    <button
                                      onClick={() => togglePostExpansion(post._id)}
                                      className="text-primary text-xs font-medium hover:underline mt-1 flex items-center gap-1"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp size={12} />
                                          See less
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown size={12} />
                                          See more
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}

                              {post.longDesc && (
                                <div className="mb-2">
                                  <p className="text-base-content/70 text-sm leading-relaxed">
                                    {isExpanded || !shouldTruncateLongDesc ? post.longDesc : truncateText(post.longDesc)}
                                  </p>
                                  {shouldTruncateLongDesc && !shouldTruncateDesc && (
                                    <button
                                      onClick={() => togglePostExpansion(post._id)}
                                      className="text-primary text-xs font-medium hover:underline mt-1 flex items-center gap-1"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp size={12} />
                                          See less
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown size={12} />
                                          See details
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}

                              {post.attachments?.url && (
                                <div className="mb-2">
                                  {post.attachments.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <img
                                      src={post.attachments.url || "/placeholder.svg"}
                                      alt="Post attachment"
                                      className="rounded-lg max-w-xs h-32 object-cover"
                                    />
                                  ) : post.attachments.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                    <video controls className="rounded-lg max-w-xs h-32">
                                      <source src={post.attachments.url} type="video/mp4" />
                                    </video>
                                  ) : (
                                    <div className="badge badge-outline text-xs">
                                      📎 {post.attachments.url.split("/").pop()}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-3 text-xs text-base-content/60">
                                <span className="flex items-center gap-1">
                                  <Heart size={12} />
                                  {post.likes?.length || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle size={12} />
                                  {post.comments?.length || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {formatDate(post.createdAt)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="btn btn-error btn-xs flex-shrink-0"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="text-lg font-semibold mb-2">No Posts Yet</h4>
                  <p className="text-base-content/60">This user hasn't created any posts.</p>
                </div>
              )}
            </div>
          </div>

          {/* User Tickets */}
          <div className="card bg-base-200 shadow-lg border border-base-300/30">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">User Tickets ({userTickets.length})</h3>
              {isFetchingTickets ? (
                <div className="text-center py-8">
                  <span className="loading loading-spinner loading-md"></span>
                  <p className="mt-2">Loading tickets...</p>
                </div>
              ) : ticketsError ? (
                <div className="text-center py-12">
                  <h4 className="text-lg font-semibold mb-2 text-error">Error</h4>
                  <p className="text-base-content/60">Failed to load tickets.</p>
                </div>
              ) : userTickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-auto w-full">
                    <thead className="bg-base-300/50">
                      <tr>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTickets.map((ticket) => (
                        <tr key={ticket._id} className="hover:bg-base-300/30">
                          <td className="px-4 py-2 truncate max-w-xs">{ticket.title}</td>
                          <td className="px-4 py-2 truncate max-w-md">{ticket.description}</td>
                          <td className="px-4 py-2">
                            <span className={`badge ${ticket.status === "complete" ? "badge-success" : "badge-primary"}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {formatDate(ticket.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎟️</div>
                  <h4 className="text-lg font-semibold mb-2">No Tickets Yet</h4>
                  <p className="text-base-content/60">This user hasn't created any tickets.</p>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Stats */}
          <div className="card bg-base-200 shadow-lg border border-base-300/30">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">Leaderboard Stats</h3>
              {isFetchingLeaderboard ? (
                <div className="text-center py-8">
                  <span className="loading loading-spinner loading-md"></span>
                  <p className="mt-2">Loading leaderboard...</p>
                </div>
              ) : leaderboardError ? (
                <div className="text-center py-12">
                  <h4 className="text-lg font-semibold mb-2 text-error">Error</h4>
                  <p className="text-base-content/60">Failed to load leaderboard data.</p>
                </div>
              ) : userLeaderboard ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-base-content/60">Rank</p>
                    <p className="text-lg font-semibold text-primary">
                      #{leaderboard.findIndex((entry) => entry.userId === userId) + 1}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-base-content/60">Points</p>
                    <p className="text-lg font-semibold text-primary">{userLeaderboard.totalPoints || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-base-content/60">Tickets Solved</p>
                    <p className="text-lg font-semibold text-primary">{userLeaderboard.tickets?.length || 0}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <h4 className="text-lg font-semibold mb-2">No Leaderboard Data</h4>
                  <p className="text-base-content/60">This user is not ranked on the leaderboard.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserProfile