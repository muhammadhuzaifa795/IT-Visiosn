"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  Settings,
  Download,
  RefreshCw,
  UserPlus,
  FileText,
  Server,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, active: 0, new: 0, growth: 0 },
    reports: { total: 0, pending: 0, resolved: 0, growth: 0 },
    activity: { total: 0, success: 0, failed: 0, growth: 0 },
    system: { uptime: 0, cpu: 0, memory: 0, storage: 0 },
    recentUsers: [],
    recentActivity: [],
    analytics: {
      userGrowth: [65, 78, 82, 95, 108, 125, 142],
      activityTrend: [45, 52, 48, 61, 55, 67, 73],
    },
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          setDashboardData({
            users: { total: 1247, active: 892, new: 23, growth: 12.5 },
            reports: { total: 156, pending: 12, resolved: 144, growth: -2.3 },
            activity: { total: 8934, success: 8456, failed: 478, growth: 8.7 },
            system: { uptime: 99.9, cpu: 45, memory: 67, storage: 34 },
            recentUsers: [
              {
                id: 1,
                name: "Ayesha Khan",
                email: "ayesha@example.com",
                role: "Editor",
                joinedAt: "2024-01-15T10:30:00Z",
                avatar: "AK",
              },
              {
                id: 2,
                name: "Bilal Ahmed",
                email: "bilal@example.com",
                role: "Viewer",
                joinedAt: "2024-01-15T09:15:00Z",
                avatar: "BA",
              },
              {
                id: 3,
                name: "Dania Shah",
                email: "dania@example.com",
                role: "Admin",
                joinedAt: "2024-01-14T16:45:00Z",
                avatar: "DS",
              },
              {
                id: 4,
                name: "Hassan Ali",
                email: "hassan@example.com",
                role: "Editor",
                joinedAt: "2024-01-14T14:20:00Z",
                avatar: "HA",
              },
              {
                id: 5,
                name: "Iqra Malik",
                email: "iqra@example.com",
                role: "Viewer",
                joinedAt: "2024-01-14T11:10:00Z",
                avatar: "IM",
              },
            ],
            recentActivity: [
              { id: 1, user: "Ayesha", action: "Created new report", time: "2 minutes ago", status: "success" },
              { id: 2, user: "Bilal", action: "Updated user profile", time: "5 minutes ago", status: "success" },
              { id: 3, user: "Hassan", action: "Failed login attempt", time: "12 minutes ago", status: "failed" },
              { id: 4, user: "Dania", action: "Exported user data", time: "18 minutes ago", status: "success" },
              { id: 5, user: "Iqra", action: "Viewed dashboard", time: "25 minutes ago", status: "success" },
            ],
            analytics: {
              userGrowth: [65, 78, 82, 95, 108, 125, 142],
              activityTrend: [45, 52, 48, 61, 55, 67, 73],
            },
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const STAT_WRAP = "p-6 rounded-2xl border border-base-300/50 bg-base-100/80 backdrop-blur-xl shadow-xl"
  const ICON_BG = "p-3 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10"

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm border-b border-base-300/50"
      >
        <div className="absolute inset-0 bg-[url('/abstract-mesh-gradient-waves.png')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-base-content/70 mb-6 max-w-2xl">
                  Welcome back! Here's what's happening with your platform today.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition">
                    <UserPlus className="size-4" />
                    Add User
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition">
                    <FileText className="size-4" />
                    Generate Report
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-base-300/50 bg-base-200/40 hover:bg-base-200/60 transition">
                    <Settings className="size-4" />
                    Settings
                  </button>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-0 rounded-full blur-3xl bg-primary/20"
                />
                <BarChart3 className="size-20 text-primary relative z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-base-content mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={loading ? "-" : dashboardData.users.total.toLocaleString()}
              subtitle={`${dashboardData.users.active} active`}
              growth={dashboardData.users.growth}
              Icon={Users}
              color="primary"
            />
            <MetricCard
              title="Reports"
              value={loading ? "-" : dashboardData.reports.total}
              subtitle={`${dashboardData.reports.pending} pending`}
              growth={dashboardData.reports.growth}
              Icon={FileText}
              color="secondary"
            />
            <MetricCard
              title="Activity Events"
              value={loading ? "-" : dashboardData.activity.total.toLocaleString()}
              subtitle={`${dashboardData.activity.success} successful`}
              growth={dashboardData.activity.growth}
              Icon={Activity}
              color="accent"
            />
            <MetricCard
              title="System Health"
              value={loading ? "-" : `${dashboardData.system.uptime}%`}
              subtitle="Uptime"
              growth={0.1}
              Icon={Server}
              color="success"
            />
          </div>
        </motion.div>

        {/* Charts and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={ICON_BG}>
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content">User Growth</h3>
                  <p className="text-sm text-base-content/60">Last 7 days</p>
                </div>
              </div>
              <button className="p-2 rounded-lg border border-base-300/50 bg-base-200/40 hover:bg-base-200/60 transition">
                <RefreshCw className="size-4" />
              </button>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {dashboardData.analytics.userGrowth.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / Math.max(...dashboardData.analytics.userGrowth)) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-lg min-h-[20px]"
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-base-content/60 mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={ICON_BG}>
                <Server className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-base-content">System Status</h3>
                <p className="text-sm text-base-content/60">Real-time monitoring</p>
              </div>
            </div>
            <div className="space-y-4">
              <SystemMetric label="CPU Usage" value={dashboardData.system.cpu} max={100} color="primary" />
              <SystemMetric label="Memory" value={dashboardData.system.memory} max={100} color="secondary" />
              <SystemMetric label="Storage" value={dashboardData.system.storage} max={100} color="accent" />
              <div className="flex items-center justify-between pt-4 border-t border-base-300/40">
                <span className="text-sm text-base-content/60">Server Status</span>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity and Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-base-300/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={ICON_BG}>
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">Recent Users</h3>
                    <p className="text-sm text-base-content/60">Latest registrations</p>
                  </div>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 transition">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200/40 transition"
                  >
                    <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base-content truncate">{user.name}</p>
                      <p className="text-sm text-base-content/60 truncate">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <RoleBadge role={user.role} />
                      <p className="text-xs text-base-content/60 mt-1">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-base-300/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={ICON_BG}>
                    <Activity className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">Recent Activity</h3>
                    <p className="text-sm text-base-content/60">Latest system events</p>
                  </div>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 transition">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200/40 transition"
                  >
                    <div
                      className={`size-2 rounded-full ${activity.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base-content">
                        <span className="text-primary">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-base-content/60">{activity.time}</p>
                    </div>
                    <StatusBadge status={activity.status} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={ICON_BG}>
              <Zap className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-base-content">Quick Actions</h3>
              <p className="text-sm text-base-content/60">Common administrative tasks</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard icon={UserPlus} label="Add User" />
            <QuickActionCard icon={FileText} label="Create Report" />
            <QuickActionCard icon={Download} label="Export Data" />
            <QuickActionCard icon={Settings} label="System Settings" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, subtitle, growth, Icon, color }) {
  const isPositive = growth > 0
  const GrowthIcon = isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl border border-base-300/50 bg-base-100/80 backdrop-blur-xl shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}/10 via-${color}/5 to-${color}/10`}>
          <Icon className={`size-6 text-${color}`} />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            isPositive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
          }`}
        >
          <GrowthIcon className="size-3" />
          {Math.abs(growth)}%
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-base-content mb-1">{value}</p>
        <p className="text-sm text-base-content/60">{title}</p>
        <p className="text-xs text-base-content/50 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  )
}

function SystemMetric({ label, value, max, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-base-content/70">{label}</span>
        <span className="font-medium text-base-content">{value}%</span>
      </div>
      <div className="w-full bg-base-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-2 rounded-full bg-gradient-to-r from-${color}/60 to-${color}/40`}
        />
      </div>
    </div>
  )
}

function RoleBadge({ role }) {
  const colors = {
    Admin: "bg-red-100 text-red-700",
    Editor: "bg-blue-100 text-blue-700",
    Viewer: "bg-gray-100 text-gray-700",
  }

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || colors.Viewer}`}>{role}</span>
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {status === "success" ? "Success" : "Failed"}
    </span>
  )
}

function QuickActionCard({ icon: Icon, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-4 rounded-xl border border-base-300/50 bg-base-200/40 hover:bg-base-200/60 transition flex flex-col items-center gap-2 text-center"
    >
      <Icon className="size-6 text-primary" />
      <span className="text-sm font-medium text-base-content">{label}</span>
    </motion.button>
  )
}
