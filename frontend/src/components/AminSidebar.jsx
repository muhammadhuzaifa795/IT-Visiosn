"use client";
import { Link, useLocation, useNavigate } from "react-router";
import {
  UsersIcon,
  HomeIcon,
  SettingsIcon,
  LogOutIcon,
  BarChart3Icon,
  ClipboardListIcon,
  MenuIcon,
  ChevronLeftIcon,
  XIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useadminlogout from "../hooks/useadminlogout";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("adminSidebarState");
    return savedState ? JSON.parse(savedState) : true;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const { logoutMutation, isPending } = useadminlogout();

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  useEffect(() => {
    localStorage.setItem("adminSidebarState", JSON.stringify(isSidebarOpen));
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

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: HomeIcon, gradient: "from-blue-500/20 to-cyan-500/20" },
    { to: "/admin/users", label: "Manage Users", icon: UsersIcon, gradient: "from-green-500/20 to-emerald-500/20" },
    { to: "/admin/reports", label: "Reports", icon: BarChart3Icon, gradient: "from-purple-500/20 to-pink-500/20" },
    { to: "/admin/logs", label: "Activity Logs", icon: ClipboardListIcon, gradient: "from-orange-500/20 to-red-500/20" },
    { to: "/admin/settings", label: "Settings", icon: SettingsIcon, gradient: "from-gray-500/20 to-slate-500/20" },
  ];

  const sidebarVariants = {
    open: { width: "18rem", transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
    closed: { width: "4rem", transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  };

  const mobileSidebarVariants = {
    open: { x: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
    closed: { x: "-100%", transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileSidebarOpen(true)}
        className="btn btn-circle lg:hidden fixed top-4 left-4 z-50 bg-base-100/80 backdrop-blur-md border border-base-300/50 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <MenuIcon className="size-5 text-primary" />
      </motion.button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              ref={sidebarRef}
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 w-full sm:w-80 bg-base-100/95 backdrop-blur-xl border-r border-base-300/50 flex flex-col h-screen z-50 lg:hidden shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="p-6 border-b border-base-300/30 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="btn btn-circle btn-ghost hover:bg-base-200/50"
                >
                  <XIcon className="size-5" />
                </motion.button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.div key={item.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                        currentPath === item.to
                          ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-lg shadow-primary/10"
                          : "hover:bg-base-200/50 hover:translate-x-1"
                      }`}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient}`}>
                        <item.icon className="size-5" />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        className="bg-base-100/80 backdrop-blur-xl border-r border-base-300/50 hidden lg:flex flex-col h-screen sticky top-0 shadow-xl overflow-hidden"
      >
        <div className="p-4 border-b border-base-300/30 flex justify-between items-center">
          {isSidebarOpen && <h2 className="text-lg font-bold text-primary">Admin Panel</h2>}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="btn btn-circle btn-ghost hover:bg-primary/10"
          >
            <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
              <ChevronLeftIcon className="size-5 text-primary" />
            </motion.div>
          </motion.button>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                currentPath === item.to
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-lg shadow-primary/10"
                  : "hover:bg-base-200/50 hover:translate-x-1"
              } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient}`}>
                <item.icon className="size-5" />
              </div>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-base-200 transition-all duration-200"
          >
            <LogOutIcon className="w-5 h-5" />
            {isSidebarOpen && "Logout"}
          </button>
        </nav>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
