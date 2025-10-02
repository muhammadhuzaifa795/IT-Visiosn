import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadResume,
  analyzeResume,
  getReports,
  getReportById,
} from "../lib/api";

// Upload PDF Hook
export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
    },
  });
};

// Analyze Text Hook
export const useAnalyzeResume = () => {
  return useMutation({
    mutationFn: analyzeResume,
  });
};

// Get All Reports Hook
export const useGetReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
};

// Get Single Report Hook
export const useGetReportById = (id) => {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => getReportById(id),
    enabled: !!id,
  });
};
