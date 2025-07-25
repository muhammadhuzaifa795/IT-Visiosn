"use client"

import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, PodcastIcon, ShipWheelIcon, UsersIcon, Code2Icon, FileTextIcon, MenuIcon, ChevronLeftIcon, XIcon, KeyIcon, LogOutIcon, SettingsIcon, HelpCircleIcon, CopyIcon,MapIcon,UserRound  } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "top-right",
        style: { background: "#eff6ff", color: "#2563eb", borderRadius: "8px", padding: "12px" },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy!", {
        duration: 2000,
        position: "top-right",
        style: { background: "#fef2f2", color: "#dc2626", borderRadius: "8px", padding: "12px" },
      });
    }
  };

  return { copied, copyToClipboard };
};

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarState");
    return savedState ? JSON.parse(savedState) : true;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const { copied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsMobileSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const navItems = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/create-post", label: "Create Post", icon: PodcastIcon },
    { to: "/cv-list", label: "CV", icon: FileTextIcon },
    { to: "/ai-prompt", label: "AI Prompt", icon: Code2Icon },
    { to: "/roadmap", label: "Road Map", icon: MapIcon },
    { to: "/interviews", label: "Mock Interview", icon: UserRound  },
    { to: "/friends", label: "Friends", icon: UsersIcon },
    { to: "/users", label: "Users", icon: UsersIcon },
    { to: "/notifications", label: "Notifications", icon: BellIcon },
    { to: "/password-reset", label: "Password Reset", icon: KeyIcon },
    { to: "/add-face", label: "Add Face", icon: KeyIcon },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
    { to: "/help", label: "Help", icon: HelpCircleIcon },
    { to: "/logout", label: "Logout", icon: LogOutIcon },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMobileSidebar}
        className="btn btn-ghost btn-circle lg:hidden fixed top-4 left-4 z-50 bg-base-300 shadow-md"
        aria-label="Open sidebar"
        aria-expanded={isMobileSidebarOpen}
      >
        <MenuIcon className="size-6 text-primary" />
      </motion.button>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              ref={sidebarRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-full sm:w-72 bg-base-200 border-r border-base-300 flex flex-col h-screen z-50 lg:hidden shadow-2xl"
              aria-label="Mobile sidebar navigation"
            >
              <div className="p-4 border-b border-base-300 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
                <Link to="/" className="flex items-center gap-2.5">
                  <ShipWheelIcon className="size-10 text-primary" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                  >
                    CodeZynix
                  </motion.span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMobileSidebar}
                  className="btn btn-ghost btn-circle hover:bg-base-300"
                  aria-label="Close sidebar"
                >
                  <XIcon className="size-6 text-base-content" />
                </motion.button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`btn btn-ghost justify-start w-full gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      currentPath === item.to ? "bg-primary text-white" : "hover:bg-base-300"
                    }`}
                    aria-label={item.label}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <item.icon className="size-5 text-current" />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-base-300 bg-base-200">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2">
                      <img src={authUser?.profilePic} alt="User Avatar" />
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1"
                  >
                    <p className="font-semibold text-base">{authUser?.fullName}</p>
                    <p className="text-sm text-success flex items-center gap-1">
                      <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
                      Online
                    </p>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(authUser?.fullName || "")}
                    className="btn btn-ghost btn-circle"
                    aria-label="Copy username"
                  >
                    <CopyIcon className="size-5 text-base-content" />
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={`bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-72" : "w-16"
        } shadow-lg`}
        aria-label="Desktop sidebar navigation"
      >
        <div className="p-4 border-b border-base-300 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-10 text-primary" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
              >
                CodeZynix
              </motion.span>
            </Link>
          ) : (
            <Link to="/">
              <ShipWheelIcon className="size-10 text-primary" />
            </Link>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="btn btn-ghost btn-circle hover:bg-base-300"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <ChevronLeftIcon className="size-6 text-primary" /> : <MenuIcon className="size-6 text-primary" />}
          </motion.button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300">
          {navItems.map((item) => (
            <div key={item.to} className="relative group">
              <Link
                to={item.to}
                className={`btn btn-ghost w-full gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  currentPath === item.to ? "bg-primary text-white" : "hover:bg-base-300"
                } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
                aria-label={item.label}
              >
                <item.icon className="size-5 text-current min-w-[1.25rem]" />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
              {!isSidebarOpen && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-full top-0 ml-2 hidden group-hover:flex items-center px-4 py-2 bg-base-300 text-base-content text-sm rounded-lg shadow-xl z-10"
                  >
                    {item.label}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-base-300 bg-base-200">
          <div className="flex items-center gap-3 relative group">
            <div className="avatar">
              <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex items-center gap-2"
              >
                <div>
                  <p className="font-semibold text-base">{authUser?.fullName}</p>
                  <p className="text-sm text-success flex items-center gap-1">
                    <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
                    Online
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(authUser?.fullName || "")}
                  className="btn btn-ghost btn-circle"
                  aria-label="Copy username"
                >
                  <CopyIcon className="size-5 text-base-content" />
                </motion.button>
              </motion.div>
            )}
            {!isSidebarOpen && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full top-0 ml-2 hidden group-hover:flex items-center px-4 py-2 bg-base-300 text-base-content text-sm rounded-lg shadow-xl z-10"
                >
                  {authUser?.fullName}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;