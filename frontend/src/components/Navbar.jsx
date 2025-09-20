import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useLeaderboard from "../hooks/useLeaderboard";
import { BellIcon, LogOutIcon, ShipWheelIcon, StarIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { leaderboard, isFetching, fetchError } = useLeaderboard();
  const { logoutMutation } = useLogout();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // Find the user's points from the leaderboard
  const userLeaderboardEntry = leaderboard.find(
    (entry) => entry.userId === authUser?._id || entry.userId.toString() === authUser?._id
  );
  const userPoints = userLeaderboardEntry ? userLeaderboardEntry.totalPoints : 0;

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Codezynx
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle" aria-label="View notifications">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* User Avatar and Points */}
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <div className="avatar cursor-pointer" aria-label="View profile">
                  <div className="w-9 rounded-full">
                    <img
                      src={authUser?.profilePic || "/default-avatar.png"}
                      alt="User Avatar"
                      rel="noreferrer"
                    />
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-1 text-sm">
                {isFetching ? (
                  <span className="text-base-content/60">Loading...</span>
                ) : fetchError ? (
                  <span className="text-error">Error</span>
                ) : (
                  <>
                    <StarIcon className="h-4 w-4 text-primary fill-current" />
                    <span className="font-semibold text-primary">
                      {userPoints.toLocaleString()} Points
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
              aria-label="Log out"
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;