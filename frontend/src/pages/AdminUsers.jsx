"use client"

import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Plus, Eye, Ban, UserCheck, Trash2, RefreshCw, Crown, Users, TrendingUp, CreditCard } from "lucide-react"
import { useNavigate } from "react-router"
import { getAllUsers, deleteUserById, createUser, toggleBanUser } from "../lib/api"
import { useMutation } from "@tanstack/react-query"
import { useAdminClearSubscription } from "../hooks/useSubscription"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    subscribedUsers: 0,
    monthlySubscriptions: 0,
    yearlySubscriptions: 0,
    freeUsers: 0
  })
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  })

  const { clear: clearSubscription, isPending: isClearPending } = useAdminClearSubscription();

  const navigate = useNavigate()

  const { mutate: banMutation, isPending: isBanPending } = useMutation({
    mutationFn: toggleBanUser,
    onSuccess: (data) => {
      toast.success(data.message)
      setUsers(users.map((user) => user._id === data.user._id ? data.user : user))
    },
    onError: () => {
      toast.error("Failed to update user ban status")
    }
  })

  const calculateStats = (users) => {
    const totalUsers = users.length
    const subscribedUsers = users.filter(user => user.subscription !== "free").length
    const monthlySubscriptions = users.filter(user => user.subscription === "monthly").length
    const yearlySubscriptions = users.filter(user => user.subscription === "yearly").length
    const freeUsers = users.filter(user => user.subscription === "free").length

    return {
      totalUsers,
      subscribedUsers,
      monthlySubscriptions,
      yearlySubscriptions,
      freeUsers
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllUsers()
      if (Array.isArray(response.users)) {
        setUsers(response.users)
        setStats(calculateStats(response.users))
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
        setStats(calculateStats(users.filter((user) => user._id !== userId)))
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

  const handleToggleBan = (userId, isBanned) => {
    if (!isBanned) {
      const reason = prompt("Enter reason for banning this user:")
      if (!reason) return toast.error("Ban reason is required")
      banMutation({ userId, isBanned: true, reason })
    } else {
      banMutation({ userId, isBanned: false })
    }
  }

  const handleClearSubscription = async (userId) => {
    if (window.confirm("Are you sure you want to clear this user's subscription?")) {
      try {
        await clearSubscription(userId)
        toast.success("Subscription cleared successfully!")
        fetchUsers() // Refresh the list
      } catch (err) {
        toast.error("Failed to clear subscription")
      }
    }
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

  const getSubscriptionBadge = (subscription) => {
    const badges = {
      free: "badge-neutral",
      monthly: "badge-primary",
      yearly: "badge-secondary"
    }
    return badges[subscription] || "badge-neutral"
  }

  const getSubscriptionText = (subscription) => {
    const texts = {
      free: "Free",
      monthly: "Monthly",
      yearly: "Yearly"
    }
    return texts[subscription] || "Free"
  }

  return (
    <div className="min-h-screen p-6 bg-base-100">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button onClick={() => setShowAddUserForm(!showAddUserForm)} className="btn btn-primary">
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Total Users */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-base-content/60">Total Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribed Users */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Crown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.subscribedUsers}</div>
                <div className="text-sm text-base-content/60">Subscribed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Subscriptions */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.monthlySubscriptions}</div>
                <div className="text-sm text-base-content/60">Monthly</div>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Subscriptions */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.yearlySubscriptions}</div>
                <div className="text-sm text-base-content/60">Yearly</div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Users */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-500/20 p-2 rounded-lg">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.freeUsers}</div>
                <div className="text-sm text-base-content/60">Free Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {showAddUserForm && (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
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

      {/* Users Table */}
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="bg-base-100 shadow rounded-lg overflow-x-auto">
          <table className="table table-auto w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Subscription</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200">
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 text-left">{user.phone || "N/A"}</td>
                    <td className="px-4 py-2">
                      <span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-neutral"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`badge ${getSubscriptionBadge(user.subscription)}`}>
                        {getSubscriptionText(user.subscription)}
                      </span>
                      {user.subscriptionExpiresAt && (
                        <div className="text-xs text-base-content/60 mt-1">
                          Expires: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`badge ${user.isBanned ? "badge-error" : "badge-success"}`}>
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 flex-wrap">
                        <button 
                          onClick={() => handleViewProfile(user._id)} 
                          className="btn btn-sm btn-outline"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        
                        {user.subscription !== "free" && (
                          <button
                            onClick={() => handleClearSubscription(user._id)}
                            className="btn btn-warning btn-sm"
                            disabled={isClearPending}
                          >
                            <RefreshCw size={16} />
                            Clear Sub
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleToggleBan(user._id, user.isBanned)}
                          className={`btn btn-sm ${user.isBanned ? "btn-success" : "btn-error"}`}
                          disabled={isBanPending}
                        >
                          {user.isBanned ? <UserCheck size={16} /> : <Ban size={16} />}
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(user._id)} 
                          className="btn btn-error btn-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-base-content/60">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsers