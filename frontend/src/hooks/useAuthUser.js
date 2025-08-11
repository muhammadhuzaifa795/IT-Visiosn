import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user,
    admin: authUser.data?.user.role==='admin'? true : false,
    isAuthenticated: authUser.data?.user ? true : false,
  };
};

export default useAuthUser;
