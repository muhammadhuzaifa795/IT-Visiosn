

"use client"

import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Plus, Eye } from "lucide-react"
import { useNavigate } from "react-router"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import useTickets from "../hooks/useTicket"
import useLeaderboard from "../hooks/useLeaderboard"
import { getAllUsers, deleteUserById, createUser } from "../lib/api"


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  })

  const { tickets, isFetching: isFetchingTickets, fetchError: ticketsError } = useTickets()
  const { leaderboard, isFetching: isFetchingLeaderboard, fetchError: leaderboardError } = useLeaderboard()
  const navigate = useNavigate()

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
        fullname: "",
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

  // Chart Data
  const chartData = {
    labels: ["Total Users", "Total Tickets", "Completed Tickets", "Incomplete Tickets"],
    datasets: [
      {
        label: "Stats",
        data: [
          users.length,
          tickets.length,
          tickets.filter((t) => t.status === "complete").length,
          tickets.filter((t) => t.status !== "complete").length,
        ],
        backgroundColor: ["#10b981", "#3b82f6", "#22c55e", "#ef4444"],
        borderColor: ["#047857", "#1d4ed8", "#16a34a", "#b91c1c"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "System Overview" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Count" } },
      x: { title: { display: true, text: "Metrics" } },
    },
  }

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <button onClick={() => setShowAddUserForm(!showAddUserForm)} className="btn btn-primary">
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-base-200 p-6 rounded-lg shadow-lg border border-base-300/30">
          <h3 className="text-lg font-semibold text-base-content/80">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{users.length}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-lg shadow-lg border border-base-300/30">
          <h3 className="text-lg font-semibold text-base-content/80">Total Tickets</h3>
          <p className="text-3xl font-bold text-primary">{tickets.length}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-lg shadow-lg border border-base-300/30">
          <h3 className="text-lg font-semibold text-base-content/80">Top Ranker</h3>
          <p className="text-xl font-bold text-primary truncate">
            {leaderboard[0]?.fullName || "N/A"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-8 border border-base-300/30">
        <h2 className="text-xl font-semibold mb-4">System Stats</h2>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Add User Form */}
      {showAddUserForm && (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-8 border border-base-300/30">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={newUser.fullname}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
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
            <div>
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
            <div>
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
            <div>
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
            <div className="flex gap-2">
              <button type="submit" className="btn btn-success">
                Create User
              </button>
              <button type="button" onClick={() => setShowAddUserForm(false)} className="btn btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users Table */}
        <div className="lg:col-span-2 bg-base-200 rounded-lg shadow-lg p-6 border border-base-300/30">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          {loading ? (
            <div className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-auto w-full">
                <thead className="bg-base-300/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Full Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-base-300/30">
                        <td className="px-4 py-2">{user.fullname}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.phone || "N/A"}</td>
                        <td className="px-4 py-2">
                          <span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-neutral"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button onClick={() => handleViewProfile(user._id)} className="btn btn-info btn-sm">
                              <Eye size={16} />
                              View Profile
                            </button>
                            <button onClick={() => handleDelete(user._id)} className="btn btn-error btn-sm">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-center text-base-content/60">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tickets and Leaderboard Summary */}
        <div className="space-y-8">
          {/* Recent Tickets */}
          <div className="bg-base-200 rounded-lg shadow-lg p-6 border border-base-300/30">
            <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
            {isFetchingTickets ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading tickets...</p>
              </div>
            ) : ticketsError ? (
              <p className="text-center text-error">Failed to load tickets</p>
            ) : tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.slice(0, 3).map((ticket) => (
                  <div
                    key={ticket._id}
                    className={`p-4 rounded-lg border ${
                      ticket.status === "complete" ? "border-success bg-success/10" : "border-base-300"
                    }`}
                  >
                    <h3 className="font-semibold text-base-content truncate">{ticket.title}</h3>
                    <p className="text-sm text-base-content/60 line-clamp-2">{ticket.description}</p>
                    <p className="text-sm text-base-content/80 mt-2">
                      <span className="font-semibold">Status: </span>
                      <span className={`badge ${ticket.status === "complete" ? "badge-success" : "badge-primary"}`}>
                        {ticket.status}
                      </span>
                    </p>
                    <p className="text-sm text-base-content/80">
                      <span className="font-semibold">Created By: </span>
                      {ticket.createdBy?.fullName || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-base-content/60">No tickets found.</p>
            )}
          </div>

          {/* Leaderboard Summary */}
          <div className="bg-base-200 rounded-lg shadow-lg p-6 border border-base-300/30">
            <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
            {isFetchingLeaderboard ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading leaderboard...</p>
              </div>
            ) : leaderboardError ? (
              <p className="text-center text-error">Failed to load leaderboard</p>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.slice(0, 3).map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-4 p-4 rounded-lg border border-base-300/30 hover:bg-base-300/30"
                  >
                    <div className="w-10 h-10 rounded-full ring-2 ring-primary/30 overflow-hidden">
                      <img
                        src={user.profilePic || "/placeholder.svg?height=40&width=40"}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base-content truncate">{user.fullName}</h3>
                      <p className="text-sm text-base-content/60">
                        Points: {user.totalPoints || 0} | Tickets: {user.tickets?.length || 0}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-base-content/60">#{index + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-base-content/60">No leaderboard data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard