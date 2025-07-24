import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoadmap, getRoadmap } from "../lib/api";
import useAuthUser from './useAuthUser';

const useRoadMap = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const createRoadmapMutation = useMutation({
    mutationFn: createRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', authUser?._id] });
    }
  });

  const getRoadmapQuery = useQuery({
    queryKey: ['roadmap', authUser?._id],
    queryFn: () => getRoadmap(authUser?._id),
    enabled: !!authUser?._id,
  });

  return { 
    createRoadmapMutation, 
    getRoadmapQuery,
    userId: authUser?._id 
  };
};

export default useRoadMap;