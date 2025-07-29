// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { createRoadmap, getRoadmap, deleteRoadmap } from "../lib/api";
// import useAuthUser from './useAuthUser';

// const useRoadMap = () => {
//   const queryClient = useQueryClient();
//   const { authUser } = useAuthUser();

//   const createRoadmapMutation = useMutation({
//     mutationFn: createRoadmap,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['roadmap', authUser?._id] });
//     }
//   });

//   const getRoadmapQuery = useQuery({
//     queryKey: ['roadmap', authUser?._id],
//     queryFn: () => getRoadmap(authUser?._id),
//     enabled: !!authUser?._id,
//   });

//   const deleteRoadmapMutation = useMutation({
//     mutationFn: deleteRoadmap,
//     onSuccess: () => {
//       queryClient.setQueryData(['roadmap', authUser?._id], (oldData) => {
//         if (!Array.isArray(oldData)) return [];
//         return oldData.filter((roadmap) => roadmap._id !== deleteRoadmapMutation.variables);
//       });
//     }
//   });

//   return { 
//     createRoadmapMutation, 
//     getRoadmapQuery,
//     deleteRoadmapMutation,
//     userId: authUser?._id 
//   };
// };

// export default useRoadMap;




import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoadmap, getRoadmap, deleteRoadmap } from "../lib/api";
import useAuthUser from './useAuthUser';

const useRoadMap = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const createRoadmapMutation = useMutation({
    mutationFn: createRoadmap,
    onSuccess: (data) => {
      // Add new roadmap to query cache
      queryClient.setQueryData(['roadmap', authUser?._id], (oldData) => {
        if (!Array.isArray(oldData)) return [data.roadmap];
        return [...oldData, data.roadmap];
      });
    },
    onError: (error) => {
      console.error("Error in createRoadmapMutation:", error.response?.data, error.message);
    }
  });

  const getRoadmapQuery = useQuery({
    queryKey: ['roadmap', authUser?._id],
    queryFn: () => getRoadmap(authUser?._id),
    enabled: !!authUser?._id,
  });

  const deleteRoadmapMutation = useMutation({
    mutationFn: deleteRoadmap,
    onSuccess: (data, variables) => {
      // Remove deleted roadmap from query cache
      queryClient.setQueryData(['roadmap', authUser?._id], (oldData) => {
        if (!Array.isArray(oldData)) return [];
        return oldData.filter((roadmap) => roadmap._id !== variables);
      });
    },
    onError: (error) => {
      console.error("Error in deleteRoadmapMutation:", error.response?.data, error.message);
    }
  });

  return { 
    createRoadmapMutation, 
    getRoadmapQuery,
    deleteRoadmapMutation,
    userId: authUser?._id 
  };
};

export default useRoadMap;