"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Download,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  ChevronDown,
} from "lucide-react"

function CustomDropdown({ label, value, options, onChange, isOpen, setIsOpen }) {
  const selectedOption = options.find((opt) => opt.id === value)

  return (
    <div className="relative">
      <div className="text-xs font-medium text-base-content/70 mb-2">{label}</div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-xl border border-base-300/50 bg-base-200/40 hover:bg-base-200/60 transition flex items-center justify-between text-sm"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300/50 rounded-xl shadow-lg z-10 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-base-200/60 transition ${
                value === option.id ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminReports() {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all") 
  const [priority, setPriority] = useState("all") 
  const [range, setRange] = useState("14") 
  const [reports, setReports] = useState([])

  // Dropdown states
  const [statusOpen, setStatusOpen] = useState(false)
  const [priorityOpen, setPriorityOpen] = useState(false)
  const [rangeOpen, setRangeOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      const now = new Date()
      const daysAgo = (n) => {
        const d = new Date(now)
        d.setDate(now.getDate() - n)
        return d.toISOString()
      }
      setReports([
        {
          id: "RPT-1001",
          title: "Login errors for new users",
          category: "Authentication",
          priority: "high",
          status: "in_progress",
          assignee: "Ayesha",
          updatedAt: daysAgo(1),
          slaBreached: false,
          score: 82,
        },
        {
          id: "RPT-1002",
          title: "Slow dashboard load",
          category: "Performance",
          priority: "medium",
          status: "open",
          assignee: "Bilal",
          updatedAt: daysAgo(2),
          slaBreached: false,
          score: 74,
        },
        {
          id: "RPT-1003",
          title: "Missing translations in settings",
          category: "Localization",
          priority: "low",
          status: "resolved",
          assignee: "Dania",
          updatedAt: daysAgo(3),
          slaBreached: false,
          score: 91,
        },
        {
          id: "RPT-1004",
          title: "Payment webhook retries failed",
          category: "Billing",
          priority: "critical",
          status: "open",
          assignee: "Hassan",
          updatedAt: daysAgo(0),
          slaBreached: true,
          score: 55,
        },
        {
          id: "RPT-1005",
          title: "Notifications duplicated",
          category: "Notifications",
          priority: "high",
          status: "in_progress",
          assignee: "Iqra",
          updatedAt: daysAgo(4),
          slaBreached: false,
          score: 68,
        },
        {
          id: "RPT-1006",
          title: "Avatar upload failing on mobile",
          category: "Media",
          priority: "medium",
          status: "resolved",
          assignee: "Junaid",
          updatedAt: daysAgo(5),
          slaBreached: false,
          score: 88,
        },
        {
          id: "RPT-1007",
          title: "Audit logs export timeout",
          category: "Compliance",
          priority: "high",
          status: "open",
          assignee: "Kiran",
          updatedAt: daysAgo(1),
          slaBreached: false,
          score: 62,
        },
        {
          id: "RPT-1008",
          title: "2FA SMS delays",
          category: "Security",
          priority: "critical",
          status: "in_progress",
          assignee: "Omar",
          updatedAt: daysAgo(0),
          slaBreached: true,
          score: 49,
        },
        {
          id: "RPT-1009",
          title: "Broken links in docs",
          category: "Docs",
          priority: "low",
          status: "closed",
          assignee: "Sara",
          updatedAt: daysAgo(7),
          slaBreached: false,
          score: 95,
        },
        {
          id: "RPT-1010",
          title: "Search indexing lag",
          category: "Search",
          priority: "medium",
          status: "open",
          assignee: "Talha",
          updatedAt: daysAgo(2),
          slaBreached: false,
          score: 70,
        },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return reports
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) => (priority === "all" ? true : r.priority === priority))
      .filter((r) => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.assignee.toLowerCase().includes(q)
        )
      })
      .filter((r) => {
        const d = new Date(r.updatedAt)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - Number(range))
        return d >= cutoff
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
  }, [reports, status, priority, query, range])

  const stats = useMemo(() => {
    const total = filtered.length
    const open = filtered.filter((r) => r.status === "open").length
    const resolved = filtered.filter((r) => r.status === "resolved").length
    const breaches = filtered.filter((r) => r.slaBreached).length
    const owners = new Set(filtered.map((r) => r.assignee)).size
    return { total, open, resolved, breaches, owners }
  }, [filtered])

  function exportJSON() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "reports.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportCSV() {
    const headers = ["id", "title", "category", "priority", "status", "assignee", "updatedAt", "slaBreached", "score"]
    const rows = filtered.map((r) =>
      [r.id, r.title, r.category, r.priority, r.status, r.assignee, r.updatedAt, r.slaBreached, r.score].join(","),
    )
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "reports.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const STAT_WRAP = "p-5 rounded-2xl border border-base-300/50 bg-base-100/80 backdrop-blur-xl shadow-xl"
  const ICON_BG = "p-2 rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10"

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm border-b border-base-300/50"
      >
        <div className="absolute inset-0 bg-[url('/abstract-mesh-gradient-waves.png')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative"
              aria-hidden="true"
            >
              <BarChart3 className="size-14 text-primary" />
              <div className="absolute inset-0 -z-10 rounded-full blur-3xl bg-primary/20" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Admin Reports
            </h1>
            <p className="text-base md:text-lg text-base-content/70 max-w-2xl">
              Insights, trends, and health metrics — soft gradients to match your theme.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl overflow-hidden"
        >
          <div className="p-4 sm:p-6 space-y-4">
            {/* Row 1: Search + Actions */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by id, title, category, assignee"
                    aria-label="Search reports"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-base-200/50 border border-base-300/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300/50 bg-base-200/40"
                  onClick={() => {
                    setQuery("")
                    setStatus("all")
                    setPriority("all")
                    setRange("14")
                  }}
                >
                  Clear
                </button>
                <button
                  className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="size-4" />
                  <span className="text-sm">Refresh</span>
                </button>
                <button
                  onClick={exportJSON}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10"
                >
                  <Download className="size-4" />
                  <span className="text-sm">JSON</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10"
                >
                  <Download className="size-4" />
                  <span className="text-sm">CSV</span>
                </button>
              </div>
            </div>
            <div className="h-px bg-base-300/40" />

            {/* Row 2: Dropdown filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Status Dropdown */}
              <CustomDropdown
                label="Status"
                value={status}
                options={[
                  { id: "all", label: "All" },
                  { id: "open", label: "Open" },
                  { id: "in_progress", label: "In Progress" },
                  { id: "resolved", label: "Resolved" },
                  { id: "closed", label: "Closed" },
                ]}
                onChange={setStatus}
                isOpen={statusOpen}
                setIsOpen={setStatusOpen}
              />

              {/* Priority Dropdown */}
              <CustomDropdown
                label="Priority"
                value={priority}
                options={[
                  { id: "all", label: "All" },
                  { id: "low", label: "Low" },
                  { id: "medium", label: "Medium" },
                  { id: "high", label: "High" },
                  { id: "critical", label: "Critical" },
                ]}
                onChange={setPriority}
                isOpen={priorityOpen}
                setIsOpen={setPriorityOpen}
              />

              {/* Range Dropdown */}
              <CustomDropdown
                label="Range"
                value={range}
                options={[
                  { id: "7", label: "7 Days" },
                  { id: "14", label: "14 Days" },
                  { id: "30", label: "30 Days" },
                ]}
                onChange={setRange}
                isOpen={rangeOpen}
                setIsOpen={setRangeOpen}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Reports" value={loading ? "-" : stats.total} Icon={BarChart3} />
          <StatCard title="Open" value={loading ? "-" : stats.open} Icon={Clock} />
          <StatCard title="Resolved" value={loading ? "-" : stats.resolved} Icon={CheckCircle2} />
          <StatCard
            title={`SLA Breaches (Owners: ${loading ? "-" : stats.owners})`}
            value={loading ? "-" : stats.breaches}
            Icon={AlertTriangle}
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl overflow-hidden"
        >
          <div className="p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={ICON_BG}>
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-base-content">Recent Reports</h3>
                <p className="text-xs text-base-content/60">{loading ? "Loading..." : `${filtered.length} items`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10 text-sm"
              >
                <Download className="size-4" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-base-content/60 bg-gradient-to-r from-base-200/50 to-base-200/30">
                  <th className="px-4 sm:px-6 py-3">ID</th>
                  <th className="px-4 sm:px-6 py-3">Title</th>
                  <th className="px-4 sm:px-6 py-3">Category</th>
                  <th className="px-4 sm:px-6 py-3">Priority</th>
                  <th className="px-4 sm:px-6 py-3">Status</th>
                  <th className="px-4 sm:px-6 py-3">Assignee</th>
                  <th className="px-4 sm:px-6 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : filtered).map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`border-t border-base-300/40 hover:bg-base-200/40 transition-colors ${idx % 2 === 1 ? "bg-base-100/40" : ""}`}
                  >
                    <td className="px-4 sm:px-6 py-3 font-mono text-xs">{r.id}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="line-clamp-1">{r.title}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">{r.category}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <PriorityPill priority={r.priority} />
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 sm:px-6 py-3">{r.assignee}</td>
                    <td className="px-4 sm:px-6 py-3">{new Date(r.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-base-content/60">
                      No reports found for current filters.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-base-content/60">
                      Loading reports...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )

  function StatCard({ title, value, Icon }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={STAT_WRAP}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-base-content/60">{title}</p>
            <p className="text-3xl font-bold text-base-content mt-1">{value}</p>
          </div>
          <div className={ICON_BG}>
            <Icon className="size-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-base-content/60 flex items-center gap-2">
          <TrendingUp className="size-3.5" />
          Trend
        </div>
      </motion.div>
    )
  }
}

function StatusBadge({ status }) {
  const map = {
    open: { bg: "from-amber-500/20 to-orange-500/20", text: "text-amber-700", label: "Open" },
    in_progress: { bg: "from-cyan-500/20 to-teal-500/20", text: "text-cyan-700", label: "In Progress" },
    resolved: { bg: "from-emerald-500/20 to-green-500/20", text: "text-emerald-700", label: "Resolved" },
    closed: { bg: "from-zinc-500/20 to-slate-500/20", text: "text-zinc-700", label: "Closed" },
  }
  const s = map[status] || map.open
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ring-current bg-gradient-to-r ${s.bg} ${s.text}`}
      aria-label={`Status: ${s.label}`}
    >
      {s.label}
    </span>
  )
}

function PriorityPill({ priority }) {
  const map = {
    low: { dot: "bg-emerald-500", label: "Low" },
    medium: { dot: "bg-amber-500", label: "Medium" },
    high: { dot: "bg-orange-500", label: "High" },
    critical: { dot: "bg-red-500", label: "Critical" },
  }
  const p = map[priority] || map.medium
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${p.dot}`} />
      {p.label}
    </span>
  )
}
