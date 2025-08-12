"use client"
import { motion } from "framer-motion"
import {
  TrophyIcon,
  CrownIcon,
  MedalIcon,
  StarIcon,
  FlameIcon,
  TrendingUpIcon,
  UsersIcon,
  SparklesIcon,
  AwardIcon,
  ZapIcon,
} from "lucide-react"
import { useState, useEffect } from "react"

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("overall")
  const [isLoading, setIsLoading] = useState(true)
  const [showAllUsers, setShowAllUsers] = useState(false)

 
  const topThree = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=120&width=120",
      score: 2850,
      rank: 1,
      badge: "Champion",
      streak: 45,
      achievements: 28,
      level: "Expert",
      specialty: "Full Stack Developer",
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=120&width=120",
      score: 2720,
      rank: 2,
      badge: "Master",
      streak: 32,
      achievements: 24,
      level: "Advanced",
      specialty: "Frontend Specialist",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=120&width=120",
      score: 2650,
      rank: 3,
      badge: "Expert",
      streak: 28,
      achievements: 22,
      level: "Advanced",
      specialty: "Backend Engineer",
    },
  ]

  const otherParticipants = [
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=60&width=60",
      score: 2480,
      rank: 4,
      level: "Intermediate",
      specialty: "UI/UX Developer",
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "/placeholder.svg?height=60&width=60",
      score: 2350,
      rank: 5,
      level: "Intermediate",
      specialty: "DevOps Engineer",
    },
    {
      id: 6,
      name: "Lisa Thompson",
      avatar: "/placeholder.svg?height=60&width=60",
      score: 2280,
      rank: 6,
      level: "Intermediate",
      specialty: "Mobile Developer",
    },
    {
      id: 7,
      name: "James Brown",
      avatar: "/placeholder.svg?height=60&width=60",
      score: 2150,
      rank: 7,
      level: "Beginner",
      specialty: "Python Developer",
    },
    {
      id: 8,
      name: "Anna Garcia",
      avatar: "/placeholder.svg?height=60&width=60",
      score: 2050,
      rank: 8,
      level: "Beginner",
      specialty: "React Developer",
    },
    {
      id: 9,
      name: "Tom Anderson",
      avatar: "/placeholder.svg?height=60&width=60",
      score: 1980,
      rank: 9,
      level: "Beginner",
      specialty: "Node.js Developer",
    },
    {
      id: 10,
      name: "Sophie Martin",
      avatar: "/placeholder.svg?height=60&width=60",
      score: 1920,
      rank: 10,
      level: "Beginner",
      specialty: "Vue.js Developer",
    },
  ]

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="size-8 text-amber-400" />
      case 2:
        return <MedalIcon className="size-7 text-gray-400" />
      case 3:
        return <AwardIcon className="size-6 text-amber-600" />
      default:
        return <span className="text-2xl font-bold text-base-content/60">#{rank}</span>
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-amber-400/20 via-yellow-500/20 to-amber-600/20"
      case 2:
        return "from-gray-300/20 via-slate-400/20 to-gray-500/20"
      case 3:
        return "from-amber-600/20 via-orange-500/20 to-amber-700/20"
      default:
        return "from-primary/10 to-secondary/10"
    }
  }

  const getPodiumHeight = (rank) => {
    switch (rank) {
      case 1:
        return "h-32"
      case 2:
        return "h-24"
      case 3:
        return "h-20"
      default:
        return "h-16"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="inline-block mb-4"
          >
            <TrophyIcon className="size-16 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold text-base-content mb-2">Loading Leaderboard...</h2>
          <p className="text-base-content/60">Fetching the latest rankings</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm border-b border-base-300/50"
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <TrophyIcon className="size-16 text-primary" />
              </motion.div>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
              Leader Board
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
              Compete with the best developers and showcase your coding skills
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <UsersIcon className="size-4" />
                <span>2,847 Participants</span>
              </div>
              <div className="flex items-center gap-2">
                <FlameIcon className="size-4" />
                <span>Live Competition</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="size-4" />
                <span>Updated Daily</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-base-200/50 backdrop-blur-md rounded-2xl p-2 border border-base-300/50">
            {["overall", "monthly", "weekly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-lg"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-300/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-end justify-center gap-4 md:gap-8 mb-8 pt-16">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative flex flex-col items-center"
            >
              {/* Avatar positioned above the podium */}
              <div className="relative mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-gray-400/30 ring-offset-4 ring-offset-base-100 overflow-hidden">
                  <img
                    src={topThree[1].avatar || "/placeholder.svg"}
                    alt={topThree[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2">{getRankIcon(2)}</div>
              </div>

              {/* User Info Card */}
              <div className="bg-base-100/80 backdrop-blur-md rounded-2xl p-4 border border-base-300/50 shadow-xl mb-4 w-40 md:w-48 text-center">
                <h3 className="font-bold text-lg text-base-content truncate">{topThree[1].name}</h3>
                <p className="text-sm text-base-content/60 mb-2">{topThree[1].specialty}</p>
                <div className="flex items-center justify-center gap-1">
                  <StarIcon className="size-4 text-primary fill-current" />
                  <span className="font-bold text-primary">{topThree[1].score.toLocaleString()}</span>
                </div>
              </div>

              <div
                className={`bg-gradient-to-t ${getRankColor(2)} backdrop-blur-md rounded-t-3xl h-20 md:h-24 w-40 md:w-48 border border-base-300/30 shadow-xl flex items-center justify-center`}
              >
                <span className="text-2xl font-bold text-base-content/60">#2</span>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative flex flex-col items-center"
            >
            
              <div className="relative mb-4">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full ring-4 ring-amber-400/50 ring-offset-4 ring-offset-base-100 overflow-hidden">
                  <img
                    src={topThree[0].avatar || "/placeholder.svg"}
                    alt={topThree[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 -right-3">{getRankIcon(1)}</div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl"
                />
              </div>

              <div className="bg-base-100/80 backdrop-blur-md rounded-2xl p-4 border border-base-300/50 shadow-2xl mb-4 w-44 md:w-52 text-center">
                <h3 className="font-bold text-xl text-base-content truncate">{topThree[0].name}</h3>
                <p className="text-sm text-base-content/60 mb-2">{topThree[0].specialty}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <StarIcon className="size-5 text-primary fill-current" />
                  <span className="font-bold text-xl text-primary">{topThree[0].score.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-base-content/60">
                  <div className="flex items-center gap-1">
                    <FlameIcon className="size-3" />
                    <span>{topThree[0].streak} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ZapIcon className="size-3" />
                    <span>{topThree[0].achievements} badges</span>
                  </div>
                </div>
              </div>

          
              <div
                className={`bg-gradient-to-t ${getRankColor(1)} backdrop-blur-md rounded-t-3xl h-28 md:h-32 w-44 md:w-52 border border-base-300/30 shadow-2xl flex items-center justify-center`}
              >
                <span className="text-3xl font-bold text-base-content/60">#1</span>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative flex flex-col items-center"
            >
            
              <div className="relative mb-4">
                <div className="w-18 h-18 md:w-20 md:h-20 rounded-full ring-4 ring-amber-600/30 ring-offset-4 ring-offset-base-100 overflow-hidden">
                  <img
                    src={topThree[2].avatar || "/placeholder.svg"}
                    alt={topThree[2].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1">{getRankIcon(3)}</div>
              </div>

              <div className="bg-base-100/80 backdrop-blur-md rounded-2xl p-4 border border-base-300/50 shadow-xl mb-4 w-36 md:w-44 text-center">
                <h3 className="font-bold text-base text-base-content truncate">{topThree[2].name}</h3>
                <p className="text-xs text-base-content/60 mb-2">{topThree[2].specialty}</p>
                <div className="flex items-center justify-center gap-1">
                  <StarIcon className="size-4 text-primary fill-current" />
                  <span className="font-bold text-primary">{topThree[2].score.toLocaleString()}</span>
                </div>
              </div>

              <div
                className={`bg-gradient-to-t ${getRankColor(3)} backdrop-blur-md rounded-t-3xl h-16 md:h-20 w-36 md:w-44 border border-base-300/30 shadow-lg flex items-center justify-center`}
              >
                <span className="text-xl font-bold text-base-content/60">#3</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 px-8 py-6 border-b border-base-300/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
                  <UsersIcon className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-base-content">All Participants</h2>
                  <p className="text-base-content/60">Complete ranking list</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <SparklesIcon className="size-4" />
                <span>Live Updates</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-base-300/30">
            {(showAllUsers ? otherParticipants : otherParticipants.slice(0, 3)).map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="px-8 py-6 hover:bg-base-200/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-base-200 to-base-300 rounded-xl font-bold text-lg text-base-content/70 group-hover:from-primary/20 group-hover:to-secondary/20 group-hover:text-primary transition-all duration-300">
                      #{participant.rank}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full ring-2 ring-base-300/50 ring-offset-2 ring-offset-base-100 overflow-hidden group-hover:ring-primary/30 transition-all duration-300">
                          <img
                            src={participant.avatar || "/placeholder.svg"}
                            alt={participant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-base-content group-hover:text-primary transition-colors duration-300">
                          {participant.name}
                        </h3>
                        <p className="text-sm text-base-content/60">{participant.specialty}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              participant.level === "Advanced"
                                ? "bg-primary/20 text-primary"
                                : participant.level === "Intermediate"
                                  ? "bg-secondary/20 text-secondary"
                                  : "bg-base-300/50 text-base-content/60"
                            }`}
                          >
                            {participant.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <StarIcon className="size-4 text-primary fill-current" />
                      <span className="text-xl font-bold text-primary">{participant.score.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-base-content/60">Total Points</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-8 py-6 bg-gradient-to-r from-base-200/30 to-base-300/30 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllUsers(!showAllUsers)}
              className="btn btn-primary btn-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {showAllUsers ? (
                <>
                  <TrendingUpIcon className="size-5 rotate-180" />
                  Show Less Users
                </>
              ) : (
                <>
                  <TrendingUpIcon className="size-5" />
                  See More Users ({otherParticipants.length - 3} remaining)
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Leaderboard
