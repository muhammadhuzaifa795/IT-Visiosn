"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Toaster, toast } from "react-hot-toast"
import {
  Users, Ticket, Crown, Activity, BarChart3, Search, ChevronUp, ChevronDown, Trash2, Eye, Frown
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
} from "chart.js"
import useTickets from "../hooks/useTicket"
import useLeaderboard from "../hooks/useLeaderboard"
import { getAllUsers, deleteUserById } from "../lib/api"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Custom hook for debouncing input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

// Reusable Components
const StatCard = ({ title, value, icon: Icon, color, loading }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
    green: { bg: "bg-green-500/10", text: "text-green-500" },
  }
  const selectedColor = colorClasses[color] || colorClasses.blue

  if (loading) {
    return <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300/30 h-[100px] skeleton"></div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300/30 hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base-content/70 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-base-content">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${selectedColor.bg}`}>
          <Icon className={`w-6 h-6 ${selectedColor.text}`} />
        </div>
      </div>
    </motion.div>
  )
}

const DashboardCard = ({ title, icon: Icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className={`bg-base-100 rounded-2xl shadow-lg p-6 border border-base-300/30 ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        {title}
      </h2>
    </div>
    {children}
  </motion.div>
)

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-base-100 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/70 mb-8">{message}</p>
          <div className="flex gap-4">
            <button onClick={onConfirm} className="btn btn-error flex-1">Confirm</button>
            <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

const UserTable = ({ users, loading, onDelete, onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'ascending' })
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users]
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1
        return 0
      })
    }
    return sortableUsers
  }, [users, sortConfig])

  const filteredUsers = useMemo(() =>
    sortedUsers.filter(user =>
      user.fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ), [sortedUsers, debouncedSearchTerm])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage
    return filteredUsers.slice(startIndex, startIndex + usersPerPage)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])


  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  return (
    <DashboardCard title="User Management" icon={Users}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              {['fullName', 'email', 'role'].map((key) => (
                <th key={key} onClick={() => requestSort(key)} className="cursor-pointer">
                  <span className="flex items-center gap-2 capitalize">{key.replace('fullName', 'Name')} <SortIcon columnKey={key} /></span>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan="4"><div className="skeleton h-8 w-full"></div></td>
                </tr>
              ))
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user._id} className="hover">
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td><span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>{user.role}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => onViewProfile(user._id)} className="btn btn-ghost btn-sm btn-circle" aria-label="View User"><Eye size={16} /></button>
                      <button onClick={() => onDelete(user._id)} className="btn btn-ghost btn-sm btn-circle text-error" aria-label="Delete User"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-12">
                  <div className="flex flex-col items-center gap-4 text-base-content/60">
                    <Frown size={48} />
                    <p className="font-semibold">No users found</p>
                    <p className="text-sm">Try adjusting your search query.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="btn" disabled={currentPage === 1}>«</button>
            <button className="btn">Page {currentPage} of {totalPages}</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="btn" disabled={currentPage === totalPages}>»</button>
          </div>
        </div>
      )}
    </DashboardCard>
  )
}

// Main Dashboard Component
const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [chartTimeRange, setChartTimeRange] = useState('Month')

  const { tickets, isFetching: isFetchingTickets } = useTickets()
  const navigate = useNavigate()

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const response = await getAllUsers()
      setUsers(Array.isArray(response.users) ? response.users : [])
    } catch (err) {
      setUsers([])
      toast.error("Failed to fetch users.")
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDeleteRequest = (userId) => {
    setUserToDelete(userId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    try {
      await deleteUserById(userToDelete)
      setUsers(prevUsers => prevUsers.filter((user) => user._id !== userToDelete))
      toast.success("User deleted successfully!")
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete user.")
    } finally {
      setUserToDelete(null)
      setDeleteModalOpen(false)
    }
  }

  const handleViewProfile = (userId) => navigate(`/admin/user/${userId}`)

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalTickets: tickets.length,
    subscribedUsers: users.filter(user => user.subscription && user.subscription !== "free").length,
    completionRate: tickets.length ? Math.round((tickets.filter(t => t.status === "completed" || t.status === "complete").length / tickets.length) * 100) : 0,
    freeUsers: users.filter(user => user.subscription === "free" || !user.subscription).length,
    monthlySubscriptions: users.filter(user => user.subscription === "monthly").length,
    yearlySubscriptions: users.filter(user => user.subscription === "yearly").length,
  }), [users, tickets])

  const barChartData = useMemo(() => {
    const dataMultiplier = chartTimeRange === 'Year' ? 12 : chartTimeRange === 'Week' ? 0.25 : 1
    return {
      labels: ["Total Users", "Total Tickets", "Subscribed", "Completed"],
      datasets: [{
        label: "Count",
        data: [
          Math.round(stats.totalUsers * dataMultiplier),
          Math.round(stats.totalTickets * dataMultiplier),
          Math.round(stats.subscribedUsers * dataMultiplier),
          Math.round(stats.totalTickets * (stats.completionRate / 100) * dataMultiplier),
        ],
        backgroundColor: ["#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e"],
        borderColor: ["#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e"],
        borderWidth: 2,
        borderRadius: 8,
      }],
    }
  }, [stats, chartTimeRange])

  const doughnutChartData = useMemo(() => ({
    labels: ["Free Users", "Monthly Pro", "Yearly Pro"],
    datasets: [{
      data: [stats.freeUsers, stats.monthlySubscriptions, stats.yearlySubscriptions],
      backgroundColor: ["#9ca3af", "#3b82f6", "#f59e0b"],
      borderColor: ["#9ca3af", "#3b82f6", "#f59e0b"],
      borderWidth: 2,
    }],
  }), [stats.freeUsers, stats.monthlySubscriptions, stats.yearlySubscriptions])

  const isDataLoading = loadingUsers || isFetchingTickets;

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-base-content">Admin Dashboard</h1>
        <p className="text-base-content/60 mt-2">Welcome back! Here's an overview of your system.</p>
      </header>


      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" loading={isDataLoading} />
                <StatCard title="Total Tickets" value={stats.totalTickets} icon={Ticket} color="purple" loading={isDataLoading} />
                <StatCard title="Subscribed Users" value={stats.subscribedUsers} icon={Crown} color="yellow" loading={isDataLoading} />
                <StatCard title="Completion Rate" value={`${stats.completionRate}%`} icon={Activity} color="green" loading={isDataLoading} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <DashboardCard title="System Overview" icon={BarChart3} className="xl:col-span-2">
                  <div className="flex justify-end mb-4">
                    <div className="btn-group">
                      {['Week', 'Month', 'Year'].map(range => (
                        <button key={range} onClick={() => setChartTimeRange(range)} className={`btn btn-sm ${chartTimeRange === range ? 'btn-active' : 'btn-ghost'}`}>{range}</button>
                      ))}
                    </div>
                  </div>
                  <div className="h-80">
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                  </div>
                </DashboardCard>
                <DashboardCard title="Subscription Distribution" icon={Crown}>
                  <div className="h-80 flex items-center justify-center">
                    <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </DashboardCard>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserTable
              users={users}
              loading={loadingUsers}
              onDelete={handleDeleteRequest}
              onViewProfile={handleViewProfile}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard