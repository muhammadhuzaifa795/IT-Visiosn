"use client"
import { Link, useLocation, useNavigate } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { BellIcon, HomeIcon, PodcastIcon, MessageCircleIcon, ShipWheelIcon, UsersIcon, Code2Icon, FileTextIcon, MenuIcon, ChevronLeftIcon, XIcon, KeyIcon, LogOutIcon, SettingsIcon, HelpCircleIcon, CopyIcon, MapIcon, UserRound, SparklesIcon, Ticket, TrophyIcon, ContactIcon, SubscriptIcon, BotIcon, StarIcon, CrownIcon, LockIcon } from 'lucide-react'
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import useLogout from "../hooks/useLogout"

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "rgba(var(--b1), 0.95)",
          color: "hsl(var(--p))",
          borderRadius: "12px",
          padding: "12px 16px",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(var(--bc), 0.1)",
        },
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy!", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "rgba(var(--er), 0.1)",
          color: "hsl(var(--er))",
          borderRadius: "12px",
          padding: "12px 16px",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(var(--er), 0.2)",
        },
      })
    }
  }
  return { copied, copyToClipboard }
}

const Sidebar = () => {
  const { authUser } = useAuthUser()
  const location = useLocation()
  const currentPath = location.pathname
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarState")
    return savedState ? JSON.parse(savedState) : true
  })
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const sidebarRef = useRef()
  const { copied, copyToClipboard } = useCopyToClipboard()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isSidebarOpen))
  }, [isSidebarOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsMobileSidebarOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev)
  }

  const { logoutMutation, isPending } = useLogout()

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        navigate("/login")
      },
    })
  }

  const isSubscribed = authUser?.subscription && authUser.subscription !== "free"
  const subscriptionType = authUser?.subscription

  const baseNavItems = [
    { to: "/", label: "Home", icon: HomeIcon, gradient: "from-blue-500/20 to-cyan-500/20", color: "text-blue-400", premium: false },
    { to: "/create-post", label: "Create Post", icon: PodcastIcon, gradient: "from-purple-500/20 to-pink-500/20", color: "text-purple-400", premium: false },
    { to: "/ai-prompt", label: "AI Prompt", icon: Code2Icon, gradient: "from-orange-500/20 to-red-500/20", color: "text-orange-400", premium: true },
    { to: "/roadmap", label: "Road Map", icon: MapIcon, gradient: "from-indigo-500/20 to-purple-500/20", color: "text-indigo-400", premium: true },
    { to: "/interviews", label: "Mock Interview", icon: UserRound, gradient: "from-teal-500/20 to-cyan-500/20", color: "text-teal-400", premium: true },
    { to: "/tickets", label: "Tickets", icon: Ticket, gradient: "from-amber-500/20 to-yellow-500/20", color: "text-amber-400", premium: true },
    { to: "/reviews", label: "Review", icon: StarIcon, gradient: "from-yellow-500/20 to-orange-500/20", color: "text-yellow-400", premium: false },
    { to: "/leaderboard", label: "Leader Board", icon: TrophyIcon, gradient: "from-yellow-500/20 to-orange-500/20", color: "text-yellow-400", premium: false },
    { to: "/contacts", label: "Contact", icon: ContactIcon, gradient: "from-pink-500/20 to-rose-500/20", color: "text-pink-400", premium: false },
    { to: "/friends", label: "Friends", icon: UsersIcon, gradient: "from-rose-500/20 to-red-500/20", color: "text-rose-400", premium: false },
    { to: "/users", label: "Users", icon: UsersIcon, gradient: "from-violet-500/20 to-purple-500/20", color: "text-violet-400", premium: false },
    { to: "/notifications", label: "Notifications", icon: BellIcon, gradient: "from-amber-500/20 to-orange-500/20", color: "text-amber-400", premium: false },
    { to: "/add-face", label: "Add Face", icon: KeyIcon, gradient: "from-blue-500/20 to-indigo-500/20", color: "text-blue-400", premium: false },
    { to: "/subscription", label: isSubscribed ? "Premium" : "Subscribe", icon: isSubscribed ? CrownIcon : SubscriptIcon, gradient: isSubscribed ? "from-yellow-500/20 to-amber-500/20" : "from-cyan-500/20 to-blue-500/20", color: isSubscribed ? "text-yellow-400" : "text-cyan-400", premium: false },
    { to: "/help", label: "Help", icon: HelpCircleIcon, gradient: "from-emerald-500/20 to-teal-500/20", color: "text-emerald-400", premium: false },
  ]

  const sidebarVariants = {
    open: {
      width: "20rem",
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
    closed: {
      width: "5rem",
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  }

  const mobileSidebarVariants = {
    open: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
    closed: {
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  }

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  }

  const NavItem = ({ item, index, isMobile = false }) => {
    const isActive = currentPath === item.to
    const canAccess = !item.premium || isSubscribed
    
    const handleClick = (e) => {
      if (!canAccess) {
        e.preventDefault()
        toast.error("Premium feature! Upgrade to access.", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "rgba(var(--wa), 0.1)",
            color: "hsl(var(--wa))",
            borderRadius: "12px",
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(var(--wa), 0.2)",
          },
        })
        if (isMobile) {
          setIsMobileSidebarOpen(false)
        }
        setTimeout(() => {
          navigate("/subscription")
        }, 1000)
      } else if (isMobile) {
        setIsMobileSidebarOpen(false)
      }
    }

    return (
      <motion.div
        key={item.to}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="relative"
      >
        <Link
          to={canAccess ? item.to : "#"}
          onClick={handleClick}
          className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 ${
            isActive
              ? "bg-gradient-to-r from-primary/25 to-secondary/25 shadow-2xl shadow-primary/20"
              : canAccess
              ? "hover:bg-base-200/60 hover:shadow-xl hover:scale-105"
              : "opacity-70 cursor-pointer hover:bg-warning/10"
          }`}
        >
          {item.premium && (
            <div className="absolute -top-1 -right-1 z-20">
              <CrownIcon className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
            </div>
          )}
          <div className={`relative p-3 rounded-xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 ${
            item.premium && !isSubscribed ? "grayscale opacity-70" : ""
          }`}>
            <item.icon className={`size-5 ${isActive ? 'text-white' : item.color}`} />
            {isActive && (
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
            )}
            {item.premium && !isSubscribed && (
              <LockIcon className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <span className={`font-semibold text-lg ${
            isActive ? 'text-white' : 'text-base-content'
          } ${item.premium && !isSubscribed ? 'opacity-70' : ''}`}>
            {item.label}
          </span>
          {isActive && (
            <motion.div
              layoutId={isMobile ? "mobile-active-pill" : "desktop-active-pill"}
              className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-lg"
              transition={{ duration: 0.4, type: "spring" }}
            />
          )}
          {item.premium && !isSubscribed && !isMobile && isSidebarOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-warning/95 backdrop-blur-lg text-warning-content text-sm rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap border border-warning/30">
              <div className="flex items-center gap-2">
                <CrownIcon className="w-3 h-3 fill-current" />
                Premium Feature - Upgrade to access
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-warning/95 rotate-45" />
            </div>
          )}
        </Link>
      </motion.div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMobileSidebar}
        className="btn btn-circle lg:hidden fixed top-6 left-6 z-50 bg-base-100/90 backdrop-blur-lg border border-base-300/60 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        aria-label="Open sidebar"
        aria-expanded={isMobileSidebarOpen}
      >
        <MenuIcon className="size-6 text-primary group-hover:text-secondary transition-colors duration-300" />
      </motion.button>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.aside
              ref={sidebarRef}
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 w-80 bg-base-100/97 backdrop-blur-2xl border-r border-base-300/30 flex flex-col h-screen z-50 lg:hidden shadow-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-base-300/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                      <ShipWheelIcon className="size-12 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        CodeZynix
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <SparklesIcon className="size-4 text-primary animate-pulse" />
                        <span className="text-sm text-base-content/70 font-medium">
                          {isSubscribed ? "Pro Platform" : "Free Platform"}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMobileSidebar}
                    className="btn btn-circle btn-ghost hover:bg-base-200/70 transition-all duration-300"
                  >
                    <XIcon className="size-6 text-base-content/70" />
                  </motion.button>
                </div>
              </div>

              <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent hover:scrollbar-thumb-primary/60">
                {baseNavItems.map((item, index) => (
                  <NavItem key={item.to} item={item} index={index} isMobile={true} />
                ))}
                
                <motion.button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="group relative flex items-center gap-4 px-4 py-4 rounded-2xl w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-500 hover:shadow-xl hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm">
                    <LogOutIcon className="size-5 text-red-400" />
                  </div>
                  <span className="font-semibold text-lg text-red-400">Logout</span>
                </motion.button>
              </nav>

              <div className="p-6 border-t border-base-300/20 bg-gradient-to-r from-base-200/40 to-base-300/40 backdrop-blur-lg">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="avatar">
                      <div className="w-14 rounded-2xl ring-3 ring-primary/40 ring-offset-2 ring-offset-base-100">
                        <img src={authUser?.profilePic || "/placeholder.svg"} alt="User Avatar" className="rounded-2xl" />
                      </div>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${isSubscribed ? 'bg-success' : 'bg-warning'} rounded-full border-2 border-base-100 shadow-lg`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base truncate text-base-content">{authUser?.fullName}</p>
                    <p className={`text-sm ${isSubscribed ? 'text-success' : 'text-warning'} flex items-center gap-2 font-medium`}>
                      <span className={`size-2 rounded-full ${isSubscribed ? 'bg-success' : 'bg-warning'} inline-block shadow`} />
                      {isSubscribed ? `${subscriptionType} Member` : "Free Member • Upgrade Now"}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(authUser?.fullName || "")}
                    className="btn btn-circle btn-ghost hover:bg-primary/20 transition-all duration-300 shadow-lg"
                  >
                    <CopyIcon className="size-4 text-base-content/70" />
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        className="bg-base-100/90 backdrop-blur-2xl border-r border-base-300/30 hidden lg:flex flex-col h-screen sticky top-0 shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-base-300/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div
                  key="expanded-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                      <ShipWheelIcon className="size-10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        CodeZynix
                      </span>
                      <div className="flex items-center gap-2">
                        <SparklesIcon className="size-3 text-primary/60 animate-pulse" />
                        <span className="text-xs text-base-content/60 font-medium">
                          {isSubscribed ? "Pro Platform" : "Free Platform"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                    <ShipWheelIcon className="size-10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--p), 0.1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="btn btn-circle btn-ghost transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <motion.div 
                animate={{ rotate: isSidebarOpen ? 0 : 180 }} 
                transition={{ duration: 0.4, type: "spring" }}
              >
                <ChevronLeftIcon className="size-5 text-primary" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent hover:scrollbar-thumb-primary/60">
          {baseNavItems.map((item, index) => (
            <NavItem key={item.to} item={item} index={index} />
          ))}
          
          <motion.button
            onClick={handleLogout}
            disabled={isPending}
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-500 hover:shadow-lg hover:scale-105 ${
              isSidebarOpen ? "justify-start" : "justify-center"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm">
              <LogOutIcon className="size-5 text-red-400" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="font-semibold text-red-400"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        <div className="p-4 border-t border-base-300/20 bg-gradient-to-r from-base-200/40 to-base-300/40 backdrop-blur-lg">
          <div className="relative group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="avatar">
                  <div className="w-12 rounded-2xl ring-2 ring-primary/40 ring-offset-2 ring-offset-base-100 shadow-lg">
                    <img src={authUser?.profilePic || "/placeholder.svg"} alt="User Avatar" className="rounded-2xl" />
                  </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${isSubscribed ? 'bg-success' : 'bg-warning'} rounded-full border-2 border-base-100 shadow-lg`} />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={itemVariants}
                    className="flex-1 flex items-center justify-between min-w-0"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate text-base-content">{authUser?.fullName}</p>
                      <p className={`text-xs ${isSubscribed ? 'text-success' : 'text-warning'} flex items-center gap-1 font-medium`}>
                        <span className={`size-1.5 rounded-full ${isSubscribed ? 'bg-success' : 'bg-warning'} inline-block shadow`} />
                        {isSubscribed ? `${subscriptionType} Member` : "Free Member"}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(authUser?.fullName || "")}
                      className="btn btn-circle btn-ghost btn-xs hover:bg-primary/20 transition-all duration-300 shadow-md"
                    >
                      <CopyIcon className="size-3.5 text-base-content/70" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {!isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-base-300/95 backdrop-blur-lg text-base-content text-sm rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap border border-base-300/30"
              >
                <p className="font-semibold">{authUser?.fullName}</p>
                <p className={`text-xs ${isSubscribed ? 'text-success' : 'text-warning'} flex items-center gap-1`}>
                  <span className={`size-1.5 rounded-full ${isSubscribed ? 'bg-success' : 'bg-warning'} inline-block`} />
                  {isSubscribed ? `${subscriptionType} Member` : "Free Member"}
                </p>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-base-300/95 rotate-45" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar