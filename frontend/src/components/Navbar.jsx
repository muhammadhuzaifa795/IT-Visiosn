import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useLeaderboard from "../hooks/useLeaderboard";
import { BellIcon, LogOutIcon, ShipWheelIcon, StarIcon, CrownIcon, ZapIcon, TrendingUpIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { leaderboard, isFetching, fetchError } = useLeaderboard();
  const { logoutMutation } = useLogout();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const userLeaderboardEntry = leaderboard.find(
    (entry) => entry.userId === authUser?._id || entry.userId.toString() === authUser?._id
  );
  const userPoints = userLeaderboardEntry ? userLeaderboardEntry.totalPoints : 0;
  const userRank = leaderboard.findIndex(entry => 
    entry.userId === authUser?._id || entry.userId.toString() === authUser?._id
  ) + 1;

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-amber-500";
    if (rank === 2) return "from-gray-400 to-gray-600";
    if (rank === 3) return "from-amber-600 to-orange-700";
    return "from-primary to-secondary";
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-base-100/80 backdrop-blur-2xl border-b border-base-300/30 sticky top-0 z-40 h-20 flex items-center shadow-2xl"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          
          {/* Logo Section - Only on Chat Page */}
          <AnimatePresence>
            {isChatPage && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                    <ShipWheelIcon className="size-10 text-primary relative z-10 group-hover:rotate-180 transition-transform duration-700" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
                      CodeZynix
                    </span>
                    <div className="flex items-center gap-1">
                      <ZapIcon className="size-3 text-primary animate-pulse" />
                      <span className="text-xs text-base-content/60 font-medium">AI Powered</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 lg:gap-6 ml-auto">
            
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle relative group" aria-label="View notifications">
                  <BellIcon className="h-6 w-6 text-base-content/70 group-hover:text-primary transition-colors duration-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse ring-2 ring-base-100" />
                </button>
              </Link>
            </motion.div>

            {/* Theme Selector */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeSelector />
            </motion.div>

            {/* User Points & Rank */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/profile" className="flex items-center gap-3 group">
                {/* User Avatar */}
                <div className="relative">
                  <div className="avatar">
                    <div className="w-12 rounded-2xl ring-3 ring-primary/40 ring-offset-2 ring-offset-base-100 shadow-lg group-hover:ring-primary/60 transition-all duration-300">
                      <img
                        src={authUser?.profilePic || "/default-avatar.png"}
                        alt="User Avatar"
                        className="rounded-2xl"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100 animate-pulse shadow-lg" />
                </div>

                {/* Points & Rank */}
                <div className="hidden sm:flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    {isFetching ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-base-300 rounded-full animate-pulse" />
                        <span className="text-sm text-base-content/60">Loading...</span>
                      </div>
                    ) : fetchError ? (
                      <span className="text-sm text-error">Error</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <div className={`p-1 rounded-lg bg-gradient-to-r ${getRankColor(userRank)} shadow-md`}>
                            {userRank <= 3 ? (
                              <CrownIcon className="h-3 w-3 text-white" />
                            ) : (
                              <TrendingUpIcon className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-base-content/70">
                            Rank #{userRank}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1.5 rounded-2xl border border-primary/20 shadow-sm">
                          <StarIcon className="h-4 w-4 text-primary fill-current" />
                          <span className="font-bold text-primary text-sm">
                            {userPoints.toLocaleString()}
                          </span>
                          <span className="text-xs text-base-content/60 ml-1">Points</span>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-base-content/50 font-medium">
                    {authUser?.fullName || "User"}
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(var(--er), 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost btn-circle group relative"
              onClick={logoutMutation}
              aria-label="Log out"
            >
              <LogOutIcon className="h-6 w-6 text-base-content/70 group-hover:text-error transition-colors duration-300" />
              <div className="absolute inset-0 bg-error/0 group-hover:bg-error/10 rounded-full transition-colors duration-300" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Points Display */}
      <div className="sm:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2">
        {!isFetching && !fetchError && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-gradient-to-r from-primary/10 to-secondary/10 px-2 py-1 rounded-xl border border-primary/20"
          >
            <StarIcon className="h-3 w-3 text-primary fill-current" />
            <span className="font-bold text-primary text-xs">
              {userPoints.toLocaleString()}
            </span>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;