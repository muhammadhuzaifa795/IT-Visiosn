"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import { Toaster, toast } from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft, Trash2, Heart, MessageCircle, Calendar, ChevronDown, ChevronUp, Mail,
  Phone, Crown, Shield, Ticket, Award, BarChart3, FileText, Ban, UserCheck, RefreshCw,
  Image as ImageIcon, Video, Download, User as UserIcon, Sparkles, Zap, TrendingUp,
  Eye, Flag, Clock, Star, Users, Target, BadgeCheck, AlertTriangle
} from "lucide-react"
import useTickets from "../hooks/useTicket"
import useLeaderboard from "../hooks/useLeaderboard"
import { getUserById, getPostsByUserId, deletePost, toggleBanUser } from "../lib/api"
import { useAdminClearSubscription } from "../hooks/useSubscription"
import { motion, AnimatePresence } from "framer-motion"

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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-full min-h-[300px] text-center"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="loading loading-spinner loading-lg text-primary mb-4"
    />
    <p className="text-base-content/60">{text}</p>
  </motion.div>
)

const EmptyState = ({ icon: Icon, title, message, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 bg-base-200/50 rounded-2xl border-2 border-dashed border-base-300"
  >
    <Icon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
    <h4 className="text-lg font-semibold mb-2 text-base-content/70">{title}</h4>
    <p className="text-base-content/50 max-w-sm mx-auto mb-4">{message}</p>
    {action}
  </motion.div>
)

const StatCard = ({ icon: Icon, value, label, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-300/30 rounded-2xl overflow-hidden"
  >
    <div className="card-body p-6 items-center text-center">
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-bold text-base-content mb-1">{value}</div>
      <div className="text-sm text-base-content/60">{label}</div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs mt-2 ${trend > 0 ? 'text-success' : 'text-error'}`}>
          <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </motion.div>
)

const PostCard = ({ post, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = post.description && post.description.length > 200

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-base-300/30 rounded-2xl overflow-hidden"
    >
      <div className="card-body p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h4 className="card-title text-lg text-base-content font-bold">{post.title}</h4>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(post._id)}
            className="btn btn-error btn-sm btn-circle btn-ghost hover:bg-error/20"
            title="Delete Post"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
        
        {post.description && (
          <div className="mb-4">
            <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
              {isExpanded ? post.description : `${post.description.substring(0, 200)}${shouldTruncate ? '...' : ''}`}
            </p>
            {shouldTruncate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary font-semibold hover:underline mt-2 flex items-center gap-1"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {isExpanded ? "Show Less" : "Read More"}
              </motion.button>
            )}
          </div>
        )}

        {post.attachments?.url && (
          <div className="mb-4">
            {post.attachments.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <div className="relative group">
                <img 
                  src={post.attachments.url} 
                  alt="Post attachment" 
                  className="rounded-xl max-h-72 w-full object-cover border border-base-300 transition-all group-hover:brightness-110" 
                />
                <div className="absolute top-2 left-2 badge badge-sm badge-primary gap-1">
                  <ImageIcon size={12} />
                  Image
                </div>
              </div>
            ) : post.attachments.url.match(/\.(mp4|webm|ogg)$/i) ? (
              <div className="relative group">
                <video controls className="rounded-xl max-h-72 w-full border border-base-300">
                  <source src={post.attachments.url} type="video/mp4" />
                </video>
                <div className="absolute top-2 left-2 badge badge-sm badge-secondary gap-1">
                  <Video size={12} />
                  Video
                </div>
              </div>
            ) : (
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={post.attachments.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-lg gap-3 w-full md:w-auto"
              >
                <Download size={16} />
                Download File
                <span className="text-xs opacity-70">{post.attachments.url.split("/").pop()}</span>
              </motion.a>
            )}
          </div>
        )}

        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-300/30">
          <div className="flex items-center gap-6 text-sm text-base-content/60">
            <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-2 font-semibold">
              <Heart size={16} className="text-error" />
              {post.likes?.length || 0}
            </motion.span>
            {/* <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-2 font-semibold">
              <MessageCircle size={16} className="text-info" />
              {post.comments?.length || 0}
            </motion.span>
            <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-2 font-semibold">
              <Eye size={16} className="text-warning" />
              {post.views || 0}
            </motion.span> */}
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <Clock size={12} />
            {getTimeAgo(post.createdAt)}
          </div>
        </div>
      </div>
    </motion.div>
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
    totalComments: posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0),
    rank: userRank > 0 ? `#${userRank}` : 'N/A',
    points: leaderboardEntry?.totalPoints || 0,
  }), [posts, userTickets, userRank, leaderboardEntry])

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
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4 sm:p-6 lg:p-8">
      {/* <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(var(--b1), 0.95)',
            color: 'hsl(var(--bc))',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(var(--bc), 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      /> */}

      {/* Enhanced Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-circle shadow-lg"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-base-content/60 mt-1">Manage user activity and details</p>
          </div>
        </div>
        {user && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 self-end sm:self-center flex-wrap"
          >
            {user.subscription !== "free" && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearSubscription}
                className="btn btn-warning btn-lg gap-3 shadow-lg"
                disabled={isClearPending}
              >
                <RefreshCw size={18} className={isClearPending ? "animate-spin" : ""} />
                Clear Subscription
                <Zap size={16} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleBan}
              className={`btn btn-lg gap-3 shadow-lg ${user.isBanned ? "btn-success" : "btn-error"}`}
              disabled={isBanPending}
            >
              {user.isBanned ? <UserCheck size={18} /> : <Ban size={18} />}
              {user.isBanned ? "Unban User" : "Ban User"}
              {!user.isBanned && <AlertTriangle size={16} />}
            </motion.button>
          </motion.div>
        )}
      </motion.header>

      {user && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Enhanced Left Sidebar - User Info */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-300/30 rounded-2xl p-6 sticky top-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring-4 ring-primary ring-offset-4 ring-offset-base-100 transition-all duration-500 group-hover:ring-secondary group-hover:scale-105">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt={user.fullName} className="object-cover" />
                      ) : (
                        <div className="bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center w-full h-full">
                          <span className="text-4xl font-bold">{user.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Online Status */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-success rounded-full border-2 border-base-100 shadow-lg" />
                  
                  {/* Subscription Crown */}
                  {user.subscription !== 'free' && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-1">{user.fullName}</h2>
                <p className="text-base-content/60 mb-4">@{user.username || 'username'}</p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="badge badge-lg badge-outline gap-1.5 font-semibold"
                  >
                    <Shield size={14} /> 
                    {user.role}
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className={`badge badge-lg gap-1.5 font-semibold ${user.isBanned ? 'badge-error' : 'badge-success'}`}
                  >
                    {user.isBanned ? <Ban size={14} /> : <BadgeCheck size={14} />}
                    {user.isBanned ? "Banned" : "Active"}
                  </motion.span>
                </div>
              </div>
              
              <div className="divider my-6 text-base-content/30">Details</div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                  <Mail size={18} className="text-primary flex-shrink-0" />
                  <span className="truncate font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                    <Phone size={18} className="text-secondary flex-shrink-0" />
                    <span className="font-medium">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                  <Calendar size={18} className="text-accent flex-shrink-0" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                  <Crown size={18} className="text-warning flex-shrink-0" />
                  <span className="font-semibold capitalize">{user.subscription} Plan</span>
                </div>
              </div>
              
              {user.subscription !== 'free' && user.subscriptionExpiresAt && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-gradient-to-r from-warning/10 to-amber-500/10 rounded-xl border border-warning/20 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock size={16} className="text-warning" />
                    <span className="text-warning font-semibold text-sm">Subscription Expires</span>
                  </div>
                  <div className=" text-xs text-white">
                    {formatDate(user.subscriptionExpiresAt)}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </aside>

          {/* Enhanced Right Content - Tabs */}
          <section className="lg:col-span-8 xl:col-span-9">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatCard 
                icon={FileText} 
                value={userStats.totalPosts} 
                label="Posts Created" 
                color="from-info to-cyan-500" 
                trend={+12}
              />
              <StatCard 
                icon={Ticket} 
                value={userStats.totalTickets} 
                label="Tickets Raised" 
                color="from-accent to-purple-500"
                trend={-5}
              />
              <StatCard 
                icon={Heart} 
                value={userStats.totalLikes} 
                label="Likes Received" 
                color="from-error to-pink-500"
                trend={+25}
              />
              <StatCard 
                icon={Award} 
                value={userStats.rank} 
                label="Leaderboard Rank" 
                color="from-warning to-orange-500"
              />
            </div>
            
            {/* Enhanced Tabs */}
            <div className="bg-base-100/80 backdrop-blur-xl rounded-2xl shadow-lg border border-base-300/30 p-2 mb-6">
              <div className="flex flex-wrap gap-2">
                {TABS.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn btn-lg gap-3 transition-all ${
                      activeTab === tab.id 
                        ? "btn-primary shadow-lg text-primary-content" 
                        : "btn-ghost text-base-content/70 hover:text-base-content"
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                    {activeTab === tab.id && <Sparkles size={16} className="animate-pulse" />}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-300/30 rounded-2xl overflow-hidden"
            >
              <div className="card-body p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="prose max-w-none"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Target className="w-8 h-8 text-primary" />
                        <h3 className="font-bold text-2xl text-base-content">User Overview</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-base-200/50 rounded-2xl p-6">
                          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-info" />
                            Activity Summary
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span>Posts Created:</span>
                              <span className="font-semibold">{userStats.totalPosts}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Likes:</span>
                              <span className="font-semibold text-error">{userStats.totalLikes}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Comments:</span>
                              <span className="font-semibold text-info">{userStats.totalComments}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tickets Submitted:</span>
                              <span className="font-semibold text-accent">{userStats.totalTickets}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-base-200/50 rounded-2xl p-6">
                          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-warning" />
                            Performance
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span>Leaderboard Rank:</span>
                              <span className="font-semibold text-warning">{userStats.rank}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Points:</span>
                              <span className="font-semibold text-success">{userStats.points}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Member Since:</span>
                              <span className="font-semibold">{formatDate(user.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Account Status:</span>
                              <span className={`font-semibold ${user.isBanned ? 'text-error' : 'text-success'}`}>
                                {user.isBanned ? 'Banned' : 'Active'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Quick Actions
                        </h4>
                        <p className="text-base-content/70 mb-4">
                          Navigate through the tabs to manage different aspects of this user's account:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-info" />
                            <strong>Posts:</strong> Review and manage user-generated content
                          </li>
                          <li className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-accent" />
                            <strong>Tickets:</strong> View support requests and their status
                          </li>
                          <li className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-warning" />
                            <strong>Leaderboard:</strong> Check ranking and contribution metrics
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "posts" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {postsLoading ? (
                        <LoadingSpinner text="Loading user posts..." />
                      ) : posts.length > 0 ? (
                        <div className="space-y-6">
                          {posts.map((post, index) => (
                            <motion.div
                              key={post._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <PostCard post={post} onDelete={handleDeletePost} />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState 
                          icon={FileText} 
                          title="No Posts Found" 
                          message="This user hasn't created any posts yet."
                          action={
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="btn btn-primary btn-sm gap-2"
                              onClick={() => navigate('/admin/posts')}
                            >
                              <Eye size={16} />
                              View All Posts
                            </motion.button>
                          }
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "tickets" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {isFetchingTickets ? (
                        <LoadingSpinner text="Loading user tickets..." />
                      ) : ticketsError ? (
                        <EmptyState 
                          icon={Ticket} 
                          title="Error Loading Tickets" 
                          message="Could not load user tickets. Please try again."
                        />
                      ) : userTickets.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="table table-zebra w-full">
                            <thead>
                              <tr>
                                <th className="text-base font-semibold">Title</th>
                                <th className="text-base font-semibold">Status</th>
                                <th className="text-base font-semibold">Priority</th>
                                <th className="text-base font-semibold">Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userTickets.map((ticket, index) => (
                                <motion.tr
                                  key={ticket._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="hover:bg-base-200/50 transition-colors"
                                >
                                  <td>
                                    <div className="font-bold text-base-content">{ticket.title}</div>
                                    <div className="text-sm opacity-60 max-w-md truncate">{ticket.description}</div>
                                  </td>
                                  <td>
                                    <span className={`badge badge-lg font-semibold ${
                                      ticket.status.toLowerCase().includes('complete') ? 'badge-success' : 
                                      ticket.status.toLowerCase().includes('pending') ? 'badge-warning' : 'badge-info'
                                    }`}>
                                      {ticket.status}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`badge badge-sm ${
                                      ticket.priority === 'high' ? 'badge-error' :
                                      ticket.priority === 'medium' ? 'badge-warning' : 'badge-info'
                                    }`}>
                                      {ticket.priority}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock size={14} />
                                      {getTimeAgo(ticket.createdAt)}
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <EmptyState 
                          icon={Ticket} 
                          title="No Tickets Found" 
                          message="This user hasn't submitted any support tickets."
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "leaderboard" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {isFetchingLeaderboard ? (
                        <LoadingSpinner text="Loading leaderboard data..." />
                      ) : leaderboardError ? (
                        <EmptyState 
                          icon={Award} 
                          title="Error Loading Leaderboard" 
                          message="Could not load leaderboard data. Please try again."
                        />
                      ) : leaderboardEntry ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="p-8 bg-gradient-to-br from-warning/20 to-orange-500/20 rounded-2xl border border-warning/30"
                          >
                            <Award className="w-12 h-12 text-warning mx-auto mb-4" />
                            <div className="text-5xl font-extrabold text-warning mb-2">#{userRank}</div>
                            <div className="text-base-content/70 font-semibold">Current Rank</div>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="p-8 bg-gradient-to-br from-info/20 to-cyan-500/20 rounded-2xl border border-info/30"
                          >
                            <TrendingUp className="w-12 h-12 text-info mx-auto mb-4" />
                            <div className="text-5xl font-extrabold text-info mb-2">{leaderboardEntry.totalPoints || 0}</div>
                            <div className="text-base-content/70 font-semibold">Total Points</div>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="p-8 bg-gradient-to-br from-success/20 to-green-500/20 rounded-2xl border border-success/30"
                          >
                            <Target className="w-12 h-12 text-success mx-auto mb-4" />
                            <div className="text-5xl font-extrabold text-success mb-2">{leaderboardEntry.tickets?.length || 0}</div>
                            <div className="text-base-content/70 font-semibold">Tickets Solved</div>
                          </motion.div>
                        </div>
                      ) : (
                        <EmptyState 
                          icon={Award} 
                          title="Not on Leaderboard" 
                          message="This user is not currently ranked on the leaderboard."
                          action={
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="btn btn-primary btn-sm gap-2"
                              onClick={() => navigate('/leaderboard')}
                            >
                              <TrendingUp size={16} />
                              View Leaderboard
                            </motion.button>
                          }
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>
        </motion.main>
      )}
    </div>
  )
}

export default AdminUserProfile