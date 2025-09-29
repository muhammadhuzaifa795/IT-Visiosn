"use client"

import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Plus, Eye, Ban, UserCheck, Trash2, RefreshCw, Crown, Users, TrendingUp, CreditCard, Search, Filter, Download, Mail, Phone, Calendar, Shield, UserPlus } from "lucide-react"
import { useNavigate } from "react-router"
import { getAllUsers, deleteUserById, createUser, toggleBanUser } from "../lib/api"
import { useMutation } from "@tanstack/react-query"
import { useAdminClearSubscription } from "../hooks/useSubscription"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterSubscription, setFilterSubscription] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [stats, setStats] = useState({
    totalUsers: 0,
    subscribedUsers: 0,
    monthlySubscriptions: 0,
    yearlySubscriptions: 0,
    freeUsers: 0,
    bannedUsers: 0,
    adminUsers: 0
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
    const subscribedUsers = users.filter(user => user.subscription && user.subscription !== "free").length
    const monthlySubscriptions = users.filter(user => user.subscription === "monthly").length
    const yearlySubscriptions = users.filter(user => user.subscription === "yearly").length
    const freeUsers = users.filter(user => !user.subscription || user.subscription === "free").length
    const bannedUsers = users.filter(user => user.isBanned).length
    const adminUsers = users.filter(user => user.role === "admin").length

    return {
      totalUsers,
      subscribedUsers,
      monthlySubscriptions,
      yearlySubscriptions,
      freeUsers,
      bannedUsers,
      adminUsers
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllUsers()
      if (Array.isArray(response.users)) {
        setUsers(response.users)
        setFilteredUsers(response.users)
        setStats(calculateStats(response.users))
      } else {
        setUsers([])
        setFilteredUsers([])
        toast.error("No users found.")
      }
    } catch (err) {
      console.error("API Error:", err)
      setUsers([])
      setFilteredUsers([])
      toast.error("Failed to fetch users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      )
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(user => user.role === filterRole)
    }

    // Subscription filter
    if (filterSubscription !== "all") {
      filtered = filtered.filter(user => user.subscription === filterSubscription)
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(user => 
        filterStatus === "banned" ? user.isBanned : !user.isBanned
      )
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole, filterSubscription, filterStatus])

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUserById(userId)
        const updatedUsers = users.filter((user) => user._id !== userId)
        setUsers(updatedUsers)
        setStats(calculateStats(updatedUsers))
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
      if (!confirm(`Are you sure you want to ban this user?\nReason: ${reason}`)) return
      banMutation({ userId, isBanned: true, reason })
    } else {
      if (!confirm("Are you sure you want to unban this user?")) return
      banMutation({ userId, isBanned: false })
    }
  }

  const handleClearSubscription = async (userId) => {
    if (window.confirm("Are you sure you want to clear this user's subscription? This will downgrade them to free plan.")) {
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

  const getSubscriptionColor = (subscription) => {
    const colors = {
      free: "text-gray-600",
      monthly: "text-blue-600",
      yearly: "text-orange-600"
    }
    return colors[subscription] || "text-gray-600"
  }

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-base-content">{value}</p>
            <p className="text-sm text-base-content/60 mt-1">{title}</p>
            {description && (
              <p className="text-xs text-base-content/40 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color.replace('text-', 'text-')}`} />
          </div>
        </div>
      </div>
    </div>
  )

  const exportUsers = () => {
    const data = filteredUsers.map(user => ({
      Name: user.fullName,
      Email: user.email,
      Phone: user.phone || 'N/A',
      Role: user.role,
      Subscription: getSubscriptionText(user.subscription),
      Status: user.isBanned ? 'Banned' : 'Active',
      'Created At': new Date(user.createdAt).toLocaleDateString()
    }))
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Users exported successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 p-6">
      {/* <Toaster position="top-right" /> */}
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-base-content/60 mt-2">Manage all users and their subscriptions</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportUsers}
            className="btn btn-outline gap-2"
            disabled={filteredUsers.length === 0}
          >
            <Download size={18} />
            Export
          </button>
          {/* <button 
            onClick={() => setShowAddUserForm(!showAddUserForm)} 
            className="btn btn-primary gap-2 shadow-lg hover:shadow-xl"
          >
            <UserPlus size={18} />
            Add User
          </button> */}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="text-blue-500"
        />
        <StatCard 
          title="Subscribed" 
          value={stats.subscribedUsers} 
          icon={Crown} 
          color="text-green-500"
          description={`${stats.totalUsers ? Math.round((stats.subscribedUsers / stats.totalUsers) * 100) : 0}% of total`}
        />
        <StatCard 
          title="Monthly Pro" 
          value={stats.monthlySubscriptions} 
          icon={TrendingUp} 
          color="text-purple-500"
        />
        <StatCard 
          title="Yearly Pro" 
          value={stats.yearlySubscriptions} 
          icon={CreditCard} 
          color="text-orange-500"
        />
        <StatCard 
          title="Free Users" 
          value={stats.freeUsers} 
          icon={Users} 
          color="text-gray-500"
        />
        <StatCard 
          title="Admins" 
          value={stats.adminUsers} 
          icon={Shield} 
          color="text-red-500"
        />
        <StatCard 
          title="Banned" 
          value={stats.bannedUsers} 
          icon={Ban} 
          color="text-error"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-base-100 rounded-2xl shadow-lg p-6 mb-8 border border-base-300/30">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            
            <select 
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Subscriptions</option>
              <option value="free">Free</option>
              <option value="monthly">Monthly Pro</option>
              <option value="yearly">Yearly Pro</option>
            </select>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
            
            <button 
              onClick={() => {
                setSearchTerm("")
                setFilterRole("all")
                setFilterSubscription("all")
                setFilterStatus("all")
              }}
              className="btn btn-ghost btn-sm gap-2"
            >
              <Filter size={16} />
              Reset
            </button>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-base-content/60">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          {searchTerm && (
            <p className="text-sm text-base-content/60">
              Search: "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {/* Add User Modal */}
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

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 mt-4">Loading users...</p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden border border-base-300/30">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200/50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-base-content">User</th>
                  <th className="px-6 py-4 text-left font-semibold text-base-content">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold text-base-content">Role</th>
                  <th className="px-6 py-4 text-left font-semibold text-base-content">Subscription</th>
                  <th className="px-6 py-4 text-left font-semibold text-base-content">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-base-content">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold text-base-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-base-200/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden">
                              <img
                                src={user.profilePic || "/placeholder.svg?height=40&width=40"}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-base-content">{user.fullName}</div>
                            <div className="text-sm text-base-content/60">ID: {user._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-base-content/40" />
                            <span className="text-base-content">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-base-content/40" />
                              <span className="text-base-content/70">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge badge-lg ${user.role === "admin" ? "badge-primary" : "badge-ghost"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`badge ${getSubscriptionBadge(user.subscription)}`}>
                            {getSubscriptionText(user.subscription)}
                          </span>
                          {user.subscriptionExpiresAt && (
                            <div className="flex items-center gap-1 text-xs text-base-content/60">
                              <Calendar className="w-3 h-3" />
                              <span>Expires {new Date(user.subscriptionExpiresAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${user.isBanned ? "badge-error" : "badge-success"}`}>
                          {user.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-base-content/60">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          <button 
                            onClick={() => handleViewProfile(user._id)} 
                            className="btn btn-ghost btn-sm btn-square"
                            title="View Profile"
                          >
                            <Eye size={16} />
                          </button>
                          
                          {user.subscription !== "free" && (
                            <button
                              onClick={() => handleClearSubscription(user._id)}
                              className="btn btn-ghost btn-sm btn-square text-warning"
                              disabled={isClearPending}
                              title="Clear Subscription"
                            >
                              <RefreshCw size={16} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleToggleBan(user._id, user.isBanned)}
                            className={`btn btn-ghost btn-sm btn-square ${user.isBanned ? "text-success" : "text-error"}`}
                            disabled={isBanPending}
                            title={user.isBanned ? "Unban User" : "Ban User"}
                          >
                            {user.isBanned ? <UserCheck size={16} /> : <Ban size={16} />}
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(user._id)} 
                            className="btn btn-ghost btn-sm btn-square text-error"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-base-content/30" />
                        <p className="text-base-content/60">No users found</p>
                        {(searchTerm || filterRole !== "all" || filterSubscription !== "all" || filterStatus !== "all") && (
                          <button 
                            onClick={() => {
                              setSearchTerm("")
                              setFilterRole("all")
                              setFilterSubscription("all")
                              setFilterStatus("all")
                            }}
                            className="btn btn-ghost btn-sm"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers