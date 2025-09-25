import { useQuery } from "@tanstack/react-query";
import { getBannedUsers } from "../lib/api";

const useBannedUsers = () => {
  return useQuery({
    queryKey: ["bannedUsers"],
    queryFn: getBannedUsers,
  });
};

export default useBannedUsers;
