import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInterview,
  getInterview,
  startInterview,
  endInterview,
  getResult,
} from "../lib/api";
import useAuthUser from "./useAuthUser";

export default function useInterview() {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const userId = authUser?._id;

  return {
    createMutation: useMutation({
      mutationFn: createInterview,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    }),
    listQuery: (uId = userId) =>
      useQuery({
        queryKey: ["interviews", uId],
        queryFn: () => getInterview(uId),
        enabled: !!uId,
      }),
    startMutation: useMutation({
      mutationFn: startInterview,
    }),
    endMutation: useMutation({
      mutationFn: endInterview,
      onSuccess: (_, id) => queryClient.invalidateQueries(["result", id]),
    }),
    resultQuery: (interviewId) =>
      useQuery({
        queryKey: ["result", interviewId],
        queryFn: () => getResult(interviewId),
        enabled: !!interviewId,
      }),
  };
}