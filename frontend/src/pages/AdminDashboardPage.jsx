"use client"

import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Plus, Eye, Users, Ticket, Crown, TrendingUp, BarChart3, UserPlus, Activity } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import useTickets from "../hooks/useTicket"
import useLeaderboard from "../hooks/useLeaderboard"
import { getAllUsers, deleteUserById, createUser } from "../lib/api"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  })

  const { tickets, isFetching: isFetchingTickets, fetchError: ticketsError } = useTickets()
  const { leaderboard, isFetching: isFetchingLeaderboard, fetchError: leaderboardError } = useLeaderboard()
  const navigate = useNavigate()

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalTickets: tickets.length,
    completedTickets: tickets.filter(t => t.status === "completed" || t.status === "complete").length,
    pendingTickets: tickets.filter(t => t.status === "pending" || t.status === "open").length,
    subscribedUsers: users.filter(user => user.subscription && user.subscription !== "free").length,
    freeUsers: users.filter(user => user.subscription === "free" || !user.subscription).length,
    monthlySubscriptions: users.filter(user => user.subscription === "monthly").length,
    yearlySubscriptions: users.filter(user => user.subscription === "yearly").length,
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllUsers()
      if (Array.isArray(response.users)) {
        setUsers(response.users)
      } else {
        setUsers([])
        toast.error("No users found.")
      }
    } catch (err) {
      console.error("API Error:", err)
      setUsers([])
      toast.error("Failed to fetch users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(userId)
        setUsers(users.filter((user) => user._id !== userId))
        toast.success("User deleted successfully!")
      } catch (err) {
        console.error("Delete Error:", err)
        toast.error("Failed to delete user.")
      }
    }
  }

  const handleViewProfile = (userId) => {
    navigate(`/admin/user/${userId}`)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    const userToCreate = { ...newUser }
    if (userToCreate.phone === "") {
      delete userToCreate.phone
    }
    try {
      await createUser(userToCreate)
      toast.success("User created successfully!")
      setShowAddUserForm(false)
      setNewUser({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      })
      fetchUsers()
    } catch (err) {
      console.error("Create User Error:", err)
      toast.error(err.response?.data?.error || "Failed to create user.")
    }
  }

  // Main Chart Data
  const chartData = {
    labels: ["Total Users", "Total Tickets", "Completed", "Pending"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.totalUsers,
          stats.totalTickets,
          stats.completedTickets,
          stats.pendingTickets,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)"
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(139, 92, 246)",
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)"
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: false 
      },
      title: { 
        display: true, 
        text: "System Overview",
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: { color: 'rgba(100, 100, 100, 0.8)' }
      },
      x: { 
        grid: { display: false },
        ticks: { color: 'rgba(100, 100, 100, 0.8)' }
      },
    },
  }

  // Subscription Chart Data
  const subscriptionData = {
    labels: ["Free Users", "Monthly Pro", "Yearly Pro"],
    datasets: [
      {
        data: [stats.freeUsers, stats.monthlySubscriptions, stats.yearlySubscriptions],
        backgroundColor: [
          "rgba(156, 163, 175, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)"
        ],
        borderColor: [
          "rgb(156, 163, 175)",
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)"
        ],
        borderWidth: 2,
      },
    ],
  }

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className={`bg-base-100 p-6 rounded-xl shadow-lg border border-base-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base-content/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-base-content">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-success' : 'text-error'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('text-', 'text-')}`} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Dashboard
          </h1> */}
          <p className="text-base-content/60 mt-2">Manage your platform and monitor performance</p>
        </div>
        {/* <button 
          onClick={() => setShowAddUserForm(!showAddUserForm)} 
          className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <UserPlus size={20} />
          Add New User
        </button> */}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 bg-base-200 rounded-xl p-1 w-fit">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "users", label: "Users", icon: Users },
          { id: "tickets", label: "Tickets", icon: Ticket },
          { id: "analytics", label: "Analytics", icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-content shadow-lg' 
                : 'text-base-content/70 hover:text-base-content hover:bg-base-300'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="text-blue-500"
        />
        <StatCard 
          title="Total Tickets" 
          value={stats.totalTickets} 
          icon={Ticket} 
          color="text-purple-500"
        />
        <StatCard 
          title="Subscribed Users" 
          value={stats.subscribedUsers} 
          icon={Crown} 
          color="text-yellow-500"
        />
        <StatCard 
          title="Completion Rate" 
          value={`${stats.totalTickets ? Math.round((stats.completedTickets / stats.totalTickets) * 100) : 0}%`} 
          icon={Activity} 
          color="text-green-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-8">
          {/* Main Chart */}
          <div className="bg-base-100 rounded-2xl shadow-lg p-6 border border-base-300/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                System Overview
              </h2>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline">Week</button>
                <button className="btn btn-sm btn-primary">Month</button>
                <button className="btn btn-sm btn-outline">Year</button>
              </div>
            </div>
            <div className="h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Subscription Chart */}
          <div className="bg-base-100 rounded-2xl shadow-lg p-6 border border-base-300/30">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Subscription Distribution
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={subscriptionData} 
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgba(100, 100, 100, 0.8)',
                        font: { size: 12 }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Right Column - Side Panels */}
        <div className="space-y-8">
          {/* Recent Tickets */}
          <div className="bg-base-100 rounded-2xl shadow-lg p-6 border border-base-300/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Recent Tickets
              </h2>
              <span className="badge badge-primary">{stats.totalTickets}</span>
            </div>
            
            {isFetchingTickets ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-base-content/60 mt-2">Loading tickets...</p>
              </div>
            ) : ticketsError ? (
              <div className="text-center py-8">
                <p className="text-error">Failed to load tickets</p>
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket._id}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      ticket.status === "completed" || ticket.status === "complete" 
                        ? "border-success/20 bg-success/5" 
                        : "border-warning/20 bg-warning/5"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-base-content line-clamp-1 flex-1">{ticket.title}</h3>
                      <span className={`badge badge-sm ml-2 ${
                        ticket.status === "completed" || ticket.status === "complete" 
                          ? "badge-success" 
                          : "badge-warning"
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/60 line-clamp-2 mb-2">{ticket.description}</p>
                    <div className="flex justify-between items-center text-xs text-base-content/50">
                      <span>By: {ticket.createdBy?.fullName || "Unknown"}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                <p className="text-base-content/60">No tickets found.</p>
              </div>
            )}
          </div>

          {/* Top Performers */}
          <div className="bg-base-100 rounded-2xl shadow-lg p-6 border border-base-300/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Top Performers
              </h2>
              <span className="badge badge-secondary">{leaderboard.length}</span>
            </div>
            
            {isFetchingLeaderboard ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg text-secondary"></span>
                <p className="text-base-content/60 mt-2">Loading leaderboard...</p>
              </div>
            ) : leaderboardError ? (
              <div className="text-center py-8">
                <p className="text-error">Failed to load leaderboard</p>
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-3 p-3 rounded-lg border border-base-300/30 hover:bg-base-200/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-base-300 overflow-hidden">
                          <img
                            src={user.profilePic || "/placeholder.svg?height=32&width=32"}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base-content truncate">{user.fullName}</h3>
                          <p className="text-xs text-base-content/60 truncate">
                            {user.totalPoints || 0} points • {user.tickets?.length || 0} tickets
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Crown className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                <p className="text-base-content/60">No leaderboard data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add New User
                </h2>
                <button 
                  onClick={() => setShowAddUserForm(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone (Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn btn-success flex-1 gap-2">
                    <UserPlus size={18} />
                    Create User
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddUserForm(false)} 
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard