// "use client"

// import { Link, useLocation } from "react-router";
// import useAuthUser from "../hooks/useAuthUser";
// import { BellIcon, HomeIcon, PodcastIcon, MessageCircleIcon,ShipWheelIcon, UsersIcon, Code2Icon, FileTextIcon, MenuIcon, ChevronLeftIcon, XIcon, KeyIcon, LogOutIcon, SettingsIcon, HelpCircleIcon, CopyIcon,MapIcon,UserRound  } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";

// const useCopyToClipboard = () => {
//   const [copied, setCopied] = useState(false);

//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       toast.success("Copied to clipboard!", {
//         duration: 2000,
//         position: "top-right",
//         style: { background: "#eff6ff", color: "#2563eb", borderRadius: "8px", padding: "12px" },
//       });
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       toast.error("Failed to copy!", {
//         duration: 2000,
//         position: "top-right",
//         style: { background: "#fef2f2", color: "#dc2626", borderRadius: "8px", padding: "12px" },
//       });
//     }
//   };

//   return { copied, copyToClipboard };
// };

// const Sidebar = () => {
//   const { authUser } = useAuthUser();
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
//     const savedState = localStorage.getItem("sidebarState");
//     return savedState ? JSON.parse(savedState) : true;
//   });
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const sidebarRef = useRef();
//   const { copied, copyToClipboard } = useCopyToClipboard();

//   useEffect(() => {
//     localStorage.setItem("sidebarState", JSON.stringify(isSidebarOpen));
//   }, [isSidebarOpen]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (isMobileSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
//         setIsMobileSidebarOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isMobileSidebarOpen]);

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const toggleMobileSidebar = () => {
//     setIsMobileSidebarOpen((prev) => !prev);
//   };

//   const navItems = [
//     { to: "/", label: "Home", icon: HomeIcon },
//     { to: "/create-post", label: "Create Post", icon: PodcastIcon },
//     { to: "/cv-list", label: "CV", icon: FileTextIcon },
//     { to: "/ai-prompt", label: "AI Prompt", icon: Code2Icon },
//     { to: "/roadmap", label: "Road Map", icon: MapIcon },
//     { to: "/interviews", label: "Mock Interview", icon: UserRound  },
//     { to: "/friends", label: "Friends", icon: UsersIcon },
//     { to: "/users", label: "Users", icon: UsersIcon },
//     { to: "/notifications", label: "Notifications", icon: BellIcon },
//     { to: "/password-reset", label: "Password Reset", icon: KeyIcon },
//     { to: "/add-face", label: "Add Face", icon: KeyIcon },
//     { to: "/chatbot", label: "Chatbot", icon: MessageCircleIcon },
//     { to: "/settings", label: "Settings", icon: SettingsIcon },
//     { to: "/help", label: "Help", icon: HelpCircleIcon },
//     { to: "/logout", label: "Logout", icon: LogOutIcon },
//   ];

//   return (
//     <>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={toggleMobileSidebar}
//         className="btn btn-ghost btn-circle lg:hidden fixed top-4 left-4 z-50 bg-base-300 shadow-md"
//         aria-label="Open sidebar"
//         aria-expanded={isMobileSidebarOpen}
//       >
//         <MenuIcon className="size-6 text-primary" />
//       </motion.button>

//       <AnimatePresence>
//         {isMobileSidebarOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//             />
//             <motion.aside
//               ref={sidebarRef}
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//               className="fixed top-0 left-0 w-full sm:w-72 bg-base-200 border-r border-base-300 flex flex-col h-screen z-50 lg:hidden shadow-2xl"
//               aria-label="Mobile sidebar navigation"
//             >
//               <div className="p-4 border-b border-base-300 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
//                 <Link to="/" className="flex items-center gap-2.5">
//                   <ShipWheelIcon className="size-10 text-primary" />
//                   <motion.span
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.2 }}
//                     className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
//                   >
//                     CodeZynix
//                   </motion.span>
//                 </Link>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={toggleMobileSidebar}
//                   className="btn btn-ghost btn-circle hover:bg-base-300"
//                   aria-label="Close sidebar"
//                 >
//                   <XIcon className="size-6 text-base-content" />
//                 </motion.button>
//               </div>

//               <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.to}
//                     to={item.to}
//                     className={`btn btn-ghost justify-start w-full gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
//                       currentPath === item.to ? "bg-primary text-white" : "hover:bg-base-300"
//                     }`}
//                     aria-label={item.label}
//                     onClick={() => setIsMobileSidebarOpen(false)}
//                   >
//                     <item.icon className="size-5 text-current" />
//                     <motion.span
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       {item.label}
//                     </motion.span>
//                   </Link>
//                 ))}
//               </nav>

//               <div className="p-4 border-t border-base-300 bg-base-200">
//                 <div className="flex items-center gap-3">
//                   <div className="avatar">
//                     <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2">
//                       <img src={authUser?.profilePic} alt="User Avatar" />
//                     </div>
//                   </div>
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.2 }}
//                     className="flex-1"
//                   >
//                     <p className="font-semibold text-base">{authUser?.fullName}</p>
//                     <p className="text-sm text-success flex items-center gap-1">
//                       <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
//                       Online
//                     </p>
//                   </motion.div>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => copyToClipboard(authUser?.fullName || "")}
//                     className="btn btn-ghost btn-circle"
//                     aria-label="Copy username"
//                   >
//                     <CopyIcon className="size-5 text-base-content" />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       <aside
//         className={`bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out ${
//           isSidebarOpen ? "w-72" : "w-16"
//         } shadow-lg`}
//         aria-label="Desktop sidebar navigation"
//       >
//         <div className="p-4 border-b border-base-300 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
//           {isSidebarOpen ? (
//             <Link to="/" className="flex items-center gap-2.5">
//               <ShipWheelIcon className="size-10 text-primary" />
//               <motion.span
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.2 }}
//                 className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
//               >
//                 CodeZynix
//               </motion.span>
//             </Link>
//           ) : (
//             <Link to="/">
//               <ShipWheelIcon className="size-10 text-primary" />
//             </Link>
//           )}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={toggleSidebar}
//             className="btn btn-ghost btn-circle hover:bg-base-300"
//             aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
//           >
//             {isSidebarOpen ? <ChevronLeftIcon className="size-6 text-primary" /> : <MenuIcon className="size-6 text-primary" />}
//           </motion.button>
//         </div>

//         <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300">
//           {navItems.map((item) => (
//             <div key={item.to} className="relative group">
//               <Link
//                 to={item.to}
//                 className={`btn btn-ghost w-full gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
//                   currentPath === item.to ? "bg-primary text-white" : "hover:bg-base-300"
//                 } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
//                 aria-label={item.label}
//               >
//                 <item.icon className="size-5 text-current min-w-[1.25rem]" />
//                 {isSidebarOpen && (
//                   <motion.span
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {item.label}
//                   </motion.span>
//                 )}
//               </Link>
//               {!isSidebarOpen && (
//                 <AnimatePresence>
//                   <motion.div
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute left-full top-0 ml-2 hidden group-hover:flex items-center px-4 py-2 bg-base-300 text-base-content text-sm rounded-lg shadow-xl z-10"
//                   >
//                     {item.label}
//                   </motion.div>
//                 </AnimatePresence>
//               )}
//             </div>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-base-300 bg-base-200">
//           <div className="flex items-center gap-3 relative group">
//             <div className="avatar">
//               <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2">
//                 <img src={authUser?.profilePic} alt="User Avatar" />
//               </div>
//             </div>
//             {isSidebarOpen && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.2 }}
//                 className="flex-1 flex items-center gap-2"
//               >
//                 <div>
//                   <p className="font-semibold text-base">{authUser?.fullName}</p>
//                   <p className="text-sm text-success flex items-center gap-1">
//                     <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
//                     Online
//                   </p>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => copyToClipboard(authUser?.fullName || "")}
//                   className="btn btn-ghost btn-circle"
//                   aria-label="Copy username"
//                 >
//                   <CopyIcon className="size-5 text-base-content" />
//                 </motion.button>
//               </motion.div>
//             )}
//             {!isSidebarOpen && (
//               <AnimatePresence>
//                 <motion.div
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute left-full top-0 ml-2 hidden group-hover:flex items-center px-4 py-2 bg-base-300 text-base-content text-sm rounded-lg shadow-xl z-10"
//                 >
//                   {authUser?.fullName}
//                 </motion.div>
//               </AnimatePresence>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;








"use client"
import { Link, useLocation } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { BellIcon, HomeIcon, PodcastIcon, MessageCircleIcon, ShipWheelIcon, UsersIcon, Code2Icon, FileTextIcon, MenuIcon, ChevronLeftIcon, XIcon, KeyIcon, LogOutIcon, SettingsIcon, HelpCircleIcon, CopyIcon, MapIcon, UserRound, SparklesIcon, TrophyIcon } from 'lucide-react'
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

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

  const navItems = [
    { to: "/", label: "Home", icon: HomeIcon, gradient: "from-blue-500/20 to-cyan-500/20" },
    { to: "/create-post", label: "Create Post", icon: PodcastIcon, gradient: "from-purple-500/20 to-pink-500/20" },
    { to: "/cv-list", label: "CV", icon: FileTextIcon, gradient: "from-green-500/20 to-emerald-500/20" },
    { to: "/ai-prompt", label: "AI Prompt", icon: Code2Icon, gradient: "from-orange-500/20 to-red-500/20" },
    { to: "/roadmap", label: "Road Map", icon: MapIcon, gradient: "from-indigo-500/20 to-purple-500/20" },
    { to: "/interviews", label: "Mock Interview", icon: UserRound, gradient: "from-teal-500/20 to-cyan-500/20" },
    { to: "/leaderboard", label: "Leader Board", icon: TrophyIcon, gradient: "from-amber-500/20 to-yellow-500/20" }, // New leaderboard item
    // { to: "/settings", label: "Settings", icon: TrophyIcon, gradient: "from-amber-500/20 to-yellow-500/20" }, // New Settings item
    { to: "/friends", label: "Friends", icon: UsersIcon, gradient: "from-pink-500/20 to-rose-500/20" },
    { to: "/users", label: "Users", icon: UsersIcon, gradient: "from-violet-500/20 to-purple-500/20" },
    { to: "/notifications", label: "Notifications", icon: BellIcon, gradient: "from-yellow-500/20 to-orange-500/20" },
    { to: "/password-reset", label: "Password Reset", icon: KeyIcon, gradient: "from-red-500/20 to-pink-500/20" },
    { to: "/add-face", label: "Add Face", icon: KeyIcon, gradient: "from-blue-500/20 to-indigo-500/20" },
    { to: "/chatbot", label: "Chatbot", icon: MessageCircleIcon, gradient: "from-green-500/20 to-teal-500/20" },
    { to: "/settingspage", label: "Settingspage", icon: SettingsIcon, gradient: "from-gray-500/20 to-slate-500/20" },
    { to: "/help", label: "Help", icon: HelpCircleIcon, gradient: "from-cyan-500/20 to-blue-500/20" },
    { to: "/logout", label: "Logout", icon: LogOutIcon, gradient: "from-red-500/20 to-orange-500/20" },
  ]

  const sidebarVariants = {
    open: {
      width: "18rem",
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
    closed: {
      width: "4rem",
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

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMobileSidebar}
        className="btn btn-circle lg:hidden fixed top-4 left-4 z-50 bg-base-100/80 backdrop-blur-md border border-base-300/50 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Open sidebar"
        aria-expanded={isMobileSidebarOpen}
      >
        <MenuIcon className="size-5 text-primary" />
      </motion.button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Mobile Sidebar */}
            <motion.aside
              ref={sidebarRef}
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 w-full sm:w-80 bg-base-100/95 backdrop-blur-xl border-r border-base-300/50 flex flex-col h-screen z-50 lg:hidden shadow-2xl"
              aria-label="Mobile sidebar navigation"
            >
              {/* Mobile Header */}
              <div className="p-6 border-b border-base-300/30 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-3">
                    <div className="relative">
                      <ShipWheelIcon className="size-12 text-primary" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                        CodeZynix
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <SparklesIcon className="size-3 text-primary/60" />
                        <span className="text-xs text-base-content/60 font-medium">Pro Platform</span>
                      </div>
                    </motion.div>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMobileSidebar}
                    className="btn btn-circle btn-ghost hover:bg-base-200/50 transition-all duration-300"
                    aria-label="Close sidebar"
                  >
                    <XIcon className="size-5 text-base-content/70" />
                  </motion.button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                        currentPath === item.to
                          ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-lg shadow-primary/10"
                          : "hover:bg-base-200/50 hover:translate-x-1"
                      }`}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <div className={`relative p-2 rounded-lg bg-gradient-to-br ${item.gradient} backdrop-blur-sm`}>
                        <item.icon className="size-5" />
                        {currentPath === item.to && (
                          <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse" />
                        )}
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {currentPath === item.to && (
                        <motion.div
                          layoutId="mobile-active-pill"
                          className="absolute right-3 w-2 h-2 bg-primary rounded-full"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile User Section */}
              <div className="p-4 border-t border-base-300/30 bg-gradient-to-r from-base-200/30 to-base-300/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="avatar">
                      <div className="w-12 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                        <img src={authUser?.profilePic || "/placeholder.svg"} alt="User Avatar" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base truncate">{authUser?.fullName}</p>
                    <p className="text-sm text-success flex items-center gap-1">
                      <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
                      Online
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(authUser?.fullName || "")}
                    className="btn btn-circle btn-ghost hover:bg-primary/10 transition-all duration-300"
                    aria-label="Copy username"
                  >
                    <CopyIcon className="size-4" />
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        className="bg-base-100/80 backdrop-blur-xl border-r border-base-300/50 hidden lg:flex flex-col h-screen sticky top-0 shadow-xl overflow-hidden"
        aria-label="Desktop sidebar navigation"
      >
        {/* Desktop Header */}
        <div className="p-4 border-b border-base-300/30 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
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
                  <Link to="/" className="flex items-center gap-3">
                    <div className="relative">
                      <ShipWheelIcon className="size-10 text-primary" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                        CodeZynix
                      </span>
                      <div className="flex items-center gap-1">
                        <SparklesIcon className="size-3 text-primary/60" />
                        <span className="text-xs text-base-content/60 font-medium">Pro</span>
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
                  <Link to="/" className="relative">
                    <ShipWheelIcon className="size-10 text-primary" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="btn btn-circle btn-ghost hover:bg-primary/10 transition-all duration-300"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                <ChevronLeftIcon className="size-5 text-primary" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
          {navItems.map((item, index) => (
            <div key={item.to} className="relative group">
              <Link
                to={item.to}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  currentPath === item.to
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-lg shadow-primary/10"
                    : "hover:bg-base-200/50 hover:translate-x-1"
                } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
                aria-label={item.label}
              >
                <div className={`relative p-2 rounded-lg bg-gradient-to-br ${item.gradient} backdrop-blur-sm`}>
                  <item.icon className="size-4" />
                  {currentPath === item.to && (
                    <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse" />
                  )}
                </div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {currentPath === item.to && isSidebarOpen && (
                  <motion.div
                    layoutId="desktop-active-pill"
                    className="absolute right-3 w-2 h-2 bg-primary rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-base-300/90 backdrop-blur-md text-base-content text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-base-300/90 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop User Section */}
        <div className="p-4 border-t border-base-300/30 bg-gradient-to-r from-base-200/30 to-base-300/30 backdrop-blur-sm">
          <div className="relative group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="avatar">
                  <div className="w-10 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                    <img src={authUser?.profilePic || "/placeholder.svg"} alt="User Avatar" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100 animate-pulse" />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
                      <p className="text-xs text-success flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-success inline-block animate-pulse" />
                        Online
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(authUser?.fullName || "")}
                      className="btn btn-circle btn-ghost btn-xs hover:bg-primary/10 transition-all duration-300"
                      aria-label="Copy username"
                    >
                      <CopyIcon className="size-3" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Tooltip for collapsed user section */}
            {!isSidebarOpen && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-base-300/90 backdrop-blur-md text-base-content text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap">
                {authUser?.fullName}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-base-300/90 rotate-45" />
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar

