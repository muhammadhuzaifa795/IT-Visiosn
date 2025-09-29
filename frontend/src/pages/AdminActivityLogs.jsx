"use client"

import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Trophy, Users, Star, Award, TrendingUp, Target, Zap, Crown, Medal, Calendar } from "lucide-react"
import useLeaderboard from "../hooks/useLeaderboard"

const AdminActivityLogs = () => {
  const { leaderboard, isFetching, fetchError } = useLeaderboard()
  const [activeTab, setActiveTab] = useState("overall")
  const [showAllUsers, setShowAllUsers] = useState(false)

  // Process leaderboard data with actual skills
  const processedLeaderboard = leaderboard.map((user, index) => {
    // Get primary skill from user's skills array
    const primarySkill = user.skills?.[0] || "Full Stack Developer"
    
    // Determine level based on points
    const getLevel = (points) => {
      if (points >= 1000) return "Expert"
      if (points >= 500) return "Advanced"
      if (points >= 200) return "Intermediate"
      return "Beginner"
    }

    // Get specialty based on skills
    const getSpecialty = (skills) => {
      if (!skills || skills.length === 0) return "Full Stack Developer"
      
      const skill = skills[0].toLowerCase()
      if (skill.includes('react') || skill.includes('frontend') || skill.includes('ui')) return "Frontend Developer"
      if (skill.includes('node') || skill.includes('backend') || skill.includes('api')) return "Backend Developer"
      if (skill.includes('python') || skill.includes('django') || skill.includes('flask')) return "Python Developer"
      if (skill.includes('mobile') || skill.includes('react native') || skill.includes('flutter')) return "Mobile Developer"
      if (skill.includes('devops') || skill.includes('aws') || skill.includes('docker')) return "DevOps Engineer"
      if (skill.includes('ux') || skill.includes('design')) return "UI/UX Designer"
      return "Full Stack Developer"
    }

    return {
      id: user.userId,
      name: user.fullName || "Unknown User",
      avatar: user.profilePic || "/placeholder.svg?height=120&width=120",
      score: user.totalPoints || 0,
      rank: index + 1,
      ticketsSolved: user.tickets?.length || 0,
      specialty: getSpecialty(user.skills),
      level: getLevel(user.totalPoints || 0),
      skills: user.skills || [],
      joinDate: user.createdAt
    }
  })

  const topThree = processedLeaderboard.slice(0, 3)
  const otherParticipants = processedLeaderboard.slice(3)

  // Calculate statistics
  const stats = {
    totalParticipants: processedLeaderboard.length,
    totalPoints: processedLeaderboard.reduce((sum, user) => sum + user.score, 0),
    averagePoints: processedLeaderboard.length ? Math.round(processedLeaderboard.reduce((sum, user) => sum + user.score, 0) / processedLeaderboard.length) : 0,
    expertUsers: processedLeaderboard.filter(user => user.level === "Expert").length,
    topScore: processedLeaderboard[0]?.score || 0
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert": return "bg-purple-500/20 text-purple-600 border-purple-500/30"
      case "Advanced": return "bg-blue-500/20 text-blue-600 border-blue-500/30"
      case "Intermediate": return "bg-green-500/20 text-green-600 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-500 to-yellow-600"
    if (rank === 2) return "from-gray-400 to-gray-500"
    if (rank === 3) return "from-orange-500 to-orange-600"
    return "from-primary to-secondary"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-base-content/60 mt-2">Track user performance and achievements</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/60 bg-base-100 px-4 py-2 rounded-lg border border-base-300/30">
          <Users size={18} />
          <span>{stats.totalParticipants.toLocaleString()} Participants</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.topScore}</div>
            <div className="text-sm text-base-content/60">Top Score</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.averagePoints}</div>
            <div className="text-sm text-base-content/60">Avg Points</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.expertUsers}</div>
            <div className="text-sm text-base-content/60">Experts</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-base-content">{stats.totalPoints}</div>
            <div className="text-sm text-base-content/60">Total Points</div>
          </div>
        </div>
      </div>

      {/* Time Period Tabs */}
      <div className="card bg-base-100 shadow-lg border border-base-300/30 mb-8">
        <div className="card-body">
          <div className="flex justify-center">
            <div className="tabs tabs-boxed bg-base-200">
              {[
                { id: "overall", label: "Overall", icon: Trophy },
                { id: "monthly", label: "Monthly", icon: Calendar },
                { id: "weekly", label: "Weekly", icon: Zap }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isFetching ? (
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body">
            <div className="flex justify-center items-center py-16">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <span className="ml-3 text-base-content/60">Loading leaderboard...</span>
            </div>
          </div>
        </div>
      ) : fetchError ? (
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body">
            <div className="text-center py-16">
              <div className="text-error text-6xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-error mb-2">Failed to Load Leaderboard</h3>
              <p className="text-base-content/60">Please try again later</p>
            </div>
          </div>
        </div>
      ) : processedLeaderboard.length === 0 ? (
        <div className="card bg-base-100 shadow-lg border border-base-300/30">
          <div className="card-body">
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content/70 mb-2">No Leaderboard Data</h3>
              <p className="text-base-content/50">User performance data will appear here as they complete tasks.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {topThree.map((user, index) => (
              <div
                key={user.id}
                className={`card bg-gradient-to-br ${getRankColor(user.rank)} text-primary-content shadow-2xl border-0 transform ${
                  user.rank === 1 ? 'md:-translate-y-4 scale-105' : ''
                } transition-all duration-300`}
              >
                <div className="card-body text-center p-6">
                  <div className="absolute top-4 right-4 text-2xl">
                    {getRankBadge(user.rank)}
                  </div>
                  
                  <div className="w-24 h-24 rounded-full ring-4 ring-primary-content/30 mx-auto mb-4 overflow-hidden">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-1 truncate">{user.name}</h3>
                  <p className="text-primary-content/80 text-sm mb-2">{user.specialty}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Crown className="w-5 h-5" />
                    <span className="font-bold text-2xl">{user.score.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-semibold">{user.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tickets:</span>
                      <span className="font-semibold">{user.ticketsSolved}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Participants Table */}
          <div className="card bg-base-100 shadow-xl border border-base-300/30">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-base-200/50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Rank</th>
                      <th className="px-6 py-4 text-left font-semibold">User</th>
                      <th className="px-6 py-4 text-left font-semibold">Specialty</th>
                      <th className="px-6 py-4 text-left font-semibold">Level</th>
                      <th className="px-6 py-4 text-left font-semibold">Skills</th>
                      <th className="px-6 py-4 text-left font-semibold">Tickets</th>
                      <th className="px-6 py-4 text-left font-semibold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllUsers ? processedLeaderboard : processedLeaderboard.slice(0, 10)).map((user) => (
                      <tr key={user.id} className="hover:bg-base-200/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{getRankBadge(user.rank)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-base-content">{user.name}</div>
                              {user.joinDate && (
                                <div className="text-xs text-base-content/60">
                                  Joined {new Date(user.joinDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-base-content font-medium">{user.specialty}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge border ${getLevelColor(user.level)}`}>
                            {user.level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="badge badge-ghost badge-sm">
                                {skill}
                              </span>
                            ))}
                            {user.skills.length > 2 && (
                              <span className="badge badge-ghost badge-sm">
                                +{user.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-base-content font-medium">{user.ticketsSolved}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-bold text-base-content">{user.score.toLocaleString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {processedLeaderboard.length > 10 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllUsers(!showAllUsers)}
                className="btn btn-primary gap-2"
              >
                {showAllUsers ? (
                  <>
                    <Medal size={18} />
                    Show Top 10
                  </>
                ) : (
                  <>
                    <Users size={18} />
                    Show All {processedLeaderboard.length} Participants
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminActivityLogs