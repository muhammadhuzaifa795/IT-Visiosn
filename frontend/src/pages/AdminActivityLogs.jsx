"use client"

import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Trophy, Users, Star } from "lucide-react"
import useLeaderboard from "../hooks/useLeaderboard"

const AdminActivityLogs = () => {
  const { leaderboard, isFetching, fetchError } = useLeaderboard()
  const [activeTab, setActiveTab] = useState("overall")
  const [showAllUsers, setShowAllUsers] = useState(false)

  // Mock specialty and level since not available in backend
  const mockSpecialties = [
    "Full Stack Developer",
    "Frontend Specialist",
    "Backend Engineer",
    "UI/UX Developer",
    "DevOps Engineer",
    "Mobile Developer",
    "Python Developer",
    "React Developer",
    "Node.js Developer",
    "Vue.js Developer",
  ]
  const mockLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]

  // Process leaderboard data
  const processedLeaderboard = leaderboard.map((user, index) => ({
    id: user.userId,
    name: user.fullName || "Unknown User",
    avatar: user.profilePic || "/placeholder.svg?height=120&width=120",
    score: user.totalPoints || 0,
    rank: index + 1,
    ticketsSolved: user.tickets?.length || 0,
    specialty: mockSpecialties[index % mockSpecialties.length],
    level: mockLevels[Math.min(index, mockLevels.length - 1)],
  }))

  const topThree = processedLeaderboard.slice(0, 3)
  const otherParticipants = processedLeaderboard.slice(3)

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <Users size={16} />
          <span>{processedLeaderboard.length.toLocaleString()} Participants</span>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-6 border border-base-300/30">
        <div className="flex justify-center mb-6">
          <div className="btn-group">
            {["overall", "monthly", "weekly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn ${activeTab === tab ? "btn-primary" : "btn-ghost"} capitalize`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isFetching ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p>Loading leaderboard...</p>
          </div>
        ) : fetchError ? (
          <p className="text-center text-error">Failed to load leaderboard</p>
        ) : processedLeaderboard.length === 0 ? (
          <p className="text-center text-base-content/60">No leaderboard data available.</p>
        ) : (
          <>
            {/* Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {topThree.map((user) => (
                <div
                  key={user.id}
                  className="bg-base-100 p-6 rounded-lg shadow-lg border border-base-300/30 text-center"
                >
                  <div className="w-20 h-20 rounded-full ring-2 ring-primary/30 mx-auto mb-4 overflow-hidden">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-lg text-base-content truncate">{user.name}</h3>
                  <p className="text-sm text-base-content/60 mb-2">{user.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star size={16} className="text-primary fill-current" />
                    <span className="font-bold text-primary">{user.score.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-base-content/60">Rank #{user.rank}</p>
                </div>
              ))}
            </div>

            {/* All Participants */}
            <div className="bg-base-100 shadow rounded-lg overflow-x-auto">
              <table className="table table-auto w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Specialty</th>
                    <th className="px-4 py-2 text-left">Level</th>
                    <th className="px-4 py-2 text-left">Tickets Solved</th>
                    <th className="px-4 py-2 text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllUsers ? processedLeaderboard : processedLeaderboard.slice(0, 5)).map((user) => (
                    <tr key={user.id} className="hover:bg-base-200">
                      <td className="px-4 py-2">#{user.rank}</td>
                      <td className="px-4 py-2 truncate">{user.name}</td>
                      <td className="px-4 py-2">{user.specialty}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`badge ${
                            user.level === "Advanced" || user.level === "Expert"
                              ? "badge-primary"
                              : user.level === "Intermediate"
                              ? "badge-secondary"
                              : "badge-neutral"
                          }`}
                        >
                          {user.level}
                        </span>
                      </td>
                      <td className="px-4 py-2">{user.ticketsSolved}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-primary fill-current" />
                          <span>{user.score.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {processedLeaderboard.length > 5 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="btn btn-primary"
                >
                  {showAllUsers ? "Show Less" : `Show All (${processedLeaderboard.length - 5} more)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminActivityLogs