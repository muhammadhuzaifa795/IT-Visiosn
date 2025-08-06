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

// import { useQuery } from "@tanstack/react-query";
// import { axiosInstance } from "../lib/axios";

// const fetchAuthUser = async () => {
//   const res = await axiosInstance.get("/auth/me");
//   return res.data.user; // backend should return { user }
// };

// const useAuthUser = () =>
//   useQuery({
//     queryKey: ["authUser"],
//     queryFn: fetchAuthUser,
//     retry: false,
//   });

// export default useAuthUser;
