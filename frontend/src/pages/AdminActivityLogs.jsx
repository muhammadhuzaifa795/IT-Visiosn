"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  Clipboard,
  Download,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  Eye,
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

export default function AdminActivityLogs() {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all") 
  const [action, setAction] = useState("all") 
  const [role, setRole] = useState("all") 
  const [range, setRange] = useState("14") 
  const [logs, setLogs] = useState([])
  const [view, setView] = useState(null) 

 
  const [statusOpen, setStatusOpen] = useState(false)
  const [actionOpen, setActionOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const [rangeOpen, setRangeOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      const now = new Date()
      const hoursAgo = (n) => {
        const d = new Date(now)
        d.setHours(now.getHours() - n)
        return d.toISOString()
      }
      setLogs([
        {
          id: "LOG-2001",
          actor: "Ayesha",
          role: "admin",
          action: "login",
          entityType: "Session",
          entityId: "-",
          ip: "192.168.1.10",
          ua: "Chrome/125 MacOS",
          status: "success",
          createdAt: hoursAgo(1),
          details: "2FA successful",
        },
        {
          id: "LOG-2002",
          actor: "Bilal",
          role: "editor",
          action: "update",
          entityType: "Post",
          entityId: "POST-332",
          ip: "192.168.1.13",
          ua: "Firefox/124 Windows",
          status: "success",
          createdAt: hoursAgo(2),
          details: "Updated title and tags",
        },
        {
          id: "LOG-2003",
          actor: "Dania",
          role: "viewer",
          action: "access",
          entityType: "Report",
          entityId: "RPT-1004",
          ip: "10.0.0.2",
          ua: "Safari/17 iOS",
          status: "success",
          createdAt: hoursAgo(5),
          details: "Viewed report details",
        },
        {
          id: "LOG-2004",
          actor: "Hassan",
          role: "admin",
          action: "delete",
          entityType: "User",
          entityId: "USR-987",
          ip: "172.16.0.5",
          ua: "Chrome/125 Windows",
          status: "failure",
          createdAt: hoursAgo(0.5),
          details: "Permission scope blocked",
        },
        {
          id: "LOG-2005",
          actor: "Iqra",
          role: "editor",
          action: "create",
          entityType: "Project",
          entityId: "PRJ-551",
          ip: "192.168.1.33",
          ua: "Chrome/125 MacOS",
          status: "success",
          createdAt: hoursAgo(9),
          details: "New project bootstrap",
        },
        {
          id: "LOG-2006",
          actor: "Junaid",
          role: "viewer",
          action: "login",
          entityType: "Session",
          entityId: "-",
          ip: "10.0.0.8",
          ua: "Safari/17 MacOS",
          status: "failure",
          createdAt: hoursAgo(3),
          details: "2FA timeout",
        },
        {
          id: "LOG-2007",
          actor: "Kiran",
          role: "admin",
          action: "export",
          entityType: "AuditLog",
          entityId: "batch-202",
          ip: "172.16.0.11",
          ua: "Edge/124 Windows",
          status: "success",
          createdAt: hoursAgo(14),
          details: "CSV export successful",
        },
        {
          id: "LOG-2008",
          actor: "Omar",
          role: "editor",
          action: "update",
          entityType: "Settings",
          entityId: "appearance",
          ip: "192.168.1.77",
          ua: "Chrome/125 Linux",
          status: "success",
          createdAt: hoursAgo(20),
          details: "Changed theme to system",
        },
        {
          id: "LOG-2009",
          actor: "Sara",
          role: "viewer",
          action: "logout",
          entityType: "Session",
          entityId: "-",
          ip: "10.0.0.12",
          ua: "Chrome/125 Windows",
          status: "success",
          createdAt: hoursAgo(0.25),
          details: "User initiated logout",
        },
        {
          id: "LOG-2010",
          actor: "Talha",
          role: "editor",
          action: "import",
          entityType: "Users",
          entityId: "bulk-77",
          ip: "192.168.1.90",
          ua: "Firefox/124 Linux",
          status: "failure",
          createdAt: hoursAgo(30),
          details: "CSV validation failed",
        },
      ])
      setLoading(false)
    }, 700)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return logs
      .filter((l) => (status === "all" ? true : l.status === status))
      .filter((l) => (action === "all" ? true : l.action === action))
      .filter((l) => (role === "all" ? true : l.role === role))
      .filter((l) => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          l.id.toLowerCase().includes(q) ||
          l.actor.toLowerCase().includes(q) ||
          l.entityId.toLowerCase().includes(q) ||
          l.entityType.toLowerCase().includes(q) ||
          l.ip.toLowerCase().includes(q) ||
          l.ua.toLowerCase().includes(q)
        )
      })
      .filter((l) => {
        const d = new Date(l.createdAt)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - Number(range))
        return d >= cutoff
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [logs, status, action, role, query, range])

  const stats = useMemo(() => {
    const total = filtered.length
    const success = filtered.filter((l) => l.status === "success").length
    const failure = filtered.filter((l) => l.status === "failure").length
    const actors = new Set(filtered.map((l) => l.actor)).size
    return { total, success, failure, actors }
  }, [filtered])

  function exportJSON() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "activity-logs.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportCSV() {
    const headers = [
      "id",
      "actor",
      "role",
      "action",
      "entityType",
      "entityId",
      "ip",
      "userAgent",
      "status",
      "createdAt",
      "details",
    ]
    const rows = filtered.map((l) =>
      [
        l.id,
        l.actor,
        l.role,
        l.action,
        l.entityType,
        l.entityId,
        l.ip,
        l.ua.replaceAll(",", " "), 
        l.status,
        l.createdAt,
        l.details?.replaceAll(",", " "),
      ].join(","),
    )
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "activity-logs.csv"
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
              <Activity className="size-14 text-primary" />
              <div className="absolute inset-0 -z-10 rounded-full blur-3xl bg-primary/20" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Admin Activity Logs
            </h1>
            <p className="text-base md:text-lg text-base-content/70 max-w-2xl">
              Real-time audit trails and user activity with soft gradients to match your custom theme.
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
                    placeholder="Search by id, actor, entity, IP, user agent"
                    aria-label="Search activity logs"
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
                    setAction("all")
                    setRole("all")
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Status Dropdown */}
              <CustomDropdown
                label="Status"
                value={status}
                options={[
                  { id: "all", label: "All" },
                  { id: "success", label: "Success" },
                  { id: "failure", label: "Failure" },
                ]}
                onChange={setStatus}
                isOpen={statusOpen}
                setIsOpen={setStatusOpen}
              />

              {/* Action Dropdown */}
              <CustomDropdown
                label="Action"
                value={action}
                options={[
                  { id: "all", label: "All" },
                  { id: "login", label: "Login" },
                  { id: "logout", label: "Logout" },
                  { id: "access", label: "Access" },
                  { id: "create", label: "Create" },
                  { id: "update", label: "Update" },
                  { id: "delete", label: "Delete" },
                  { id: "export", label: "Export" },
                  { id: "import", label: "Import" },
                ]}
                onChange={setAction}
                isOpen={actionOpen}
                setIsOpen={setActionOpen}
              />

              {/* Role Dropdown */}
              <CustomDropdown
                label="Role"
                value={role}
                options={[
                  { id: "all", label: "All" },
                  { id: "admin", label: "Admin" },
                  { id: "editor", label: "Editor" },
                  { id: "viewer", label: "Viewer" },
                ]}
                onChange={setRole}
                isOpen={roleOpen}
                setIsOpen={setRoleOpen}
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

            {/* Hint row */}
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <Filter className="size-3.5" />
              Use dropdowns above to filter logs. You can also type free text in search (actor, IP, entity, agent).
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Events" value={loading ? "-" : stats.total} Icon={Activity} />
          <StatCard title="Success" value={loading ? "-" : stats.success} Icon={ShieldCheck} />
          <StatCard title="Failure" value={loading ? "-" : stats.failure} Icon={ShieldAlert} />
          <StatCard title="Unique Actors" value={loading ? "-" : stats.actors} Icon={User} />
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
                <Activity className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-base-content">Activity Logs</h3>
                <p className="text-xs text-base-content/60">{loading ? "Loading..." : `${filtered.length} events`}</p>
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
                  <th className="px-4 sm:px-6 py-3">Time</th>
                  <th className="px-4 sm:px-6 py-3">Actor</th>
                  <th className="px-4 sm:px-6 py-3">Action</th>
                  <th className="px-4 sm:px-6 py-3">Entity</th>
                  <th className="px-4 sm:px-6 py-3">Status</th>
                  <th className="px-4 sm:px-6 py-3">IP</th>
                  <th className="px-4 sm:px-6 py-3">User Agent</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : filtered).map((l, idx) => (
                  <tr
                    key={l.id}
                    className={`border-t border-base-300/40 hover:bg-base-200/40 transition-colors ${idx % 2 === 1 ? "bg-base-100/40" : ""}`}
                  >
                    <td className="px-4 sm:px-6 py-3">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">
                          {l.actor?.[0]?.toUpperCase()}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium">{l.actor}</span>
                          <span className="text-xs text-base-content/60">{l.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <ActionBadge action={l.action} />
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{l.entityType}</span>
                        <span className="text-xs text-base-content/60">{l.entityId}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 sm:px-6 py-3">{l.ip}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <span title={l.ua} className="line-clamp-1 max-w-[240px] inline-block align-middle">
                        {l.ua}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(l.id)
                          }}
                          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-base-300/50 bg-base-200/40"
                          title="Copy ID"
                        >
                          <Clipboard className="size-4" />
                          <span className="sr-only">Copy ID</span>
                        </button>
                        <button
                          onClick={() => setView(l)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10"
                          title="View"
                        >
                          <Eye className="size-4" />
                          <span className="text-xs">View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-base-content/60">
                      No activity found for current filters.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-base-content/60">
                      Loading activity logs...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      {view && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-base-content/30 backdrop-blur-sm" onClick={() => setView(null)} />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full sm:max-w-xl bg-base-100/90 border border-base-300/50 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-base-300/40 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className={ICON_BG}>
                  <Activity className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-base-content">
                    {view.id} — {view.action}
                  </h3>
                  <p className="text-xs text-base-content/60">{new Date(view.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={view.status} />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <KV item="Actor" value={`${view.actor} (${view.role})`} />
              <KV item="Entity" value={`${view.entityType} ${view.entityId !== "-" ? `(${view.entityId})` : ""}`} />
              <KV item="IP" value={view.ip} />
              <KV item="User Agent" value={view.ua} />
              <KV item="Details" value={view.details || "-"} />
            </div>
            <div className="p-4 border-t border-base-300/40 flex items-center justify-end gap-2">
              <button
                onClick={() => setView(null)}
                className="px-4 py-2 rounded-xl border border-base-300/50 bg-base-200/50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(view, null, 2)], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `${view.id}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-base-300/50 bg-gradient-to-r from-primary/10 to-secondary/10"
              >
                <Download className="size-4" />
                Export JSON
              </button>
            </div>
          </motion.div>
        </div>
      )}
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
      </motion.div>
    )
  }
}

function StatusBadge({ status }) {
  const map = {
    success: { bg: "from-emerald-500/20 to-green-500/20", text: "text-emerald-700", label: "Success" },
    failure: { bg: "from-red-500/20 to-rose-500/20", text: "text-red-700", label: "Failure" },
  }
  const s = map[status] || { bg: "from-zinc-500/20 to-slate-500/20", text: "text-zinc-700", label: status }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ring-current bg-gradient-to-r ${s.bg} ${s.text}`}
      aria-label={`Status: ${s.label}`}
    >
      {s.label}
    </span>
  )
}

function ActionBadge({ action }) {
  const label = action?.[0]?.toUpperCase() + action?.slice(1)
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-base-300/50 bg-base-200/40 text-xs">
      {label}
    </span>
  )
}

function KV({ item, value }) {
  return (
    <div className="p-4 rounded-xl border border-base-300/50 bg-base-200/30">
      <p className="text-xs text-base-content/60">{item}</p>
      <p className="text-sm font-medium text-base-content mt-1 break-words">{value}</p>
    </div>
  )
}
