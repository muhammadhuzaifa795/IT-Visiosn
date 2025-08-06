import { Navigate } from "react-router";
import useAuthUser from "./hooks/useAuthUser"; // path adjust karo agar hooks folder aur jagah ho

const AdminRoute = ({ children }) => {
  const { authUser, isLoading, isAuthenticated } = useAuthUser();

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!authUser?.isOnboarded) {
    return <Navigate to="/onboarding" />;
  }

  if (authUser?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
