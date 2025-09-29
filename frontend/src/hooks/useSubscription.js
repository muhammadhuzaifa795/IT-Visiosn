// hooks/useSubscription.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  activateSubscription, 
  cancelSubscription, 
  clearSubscriptionByAdmin 
} from "../lib/api";

// USER activate subscription
export const useActivateSubscription = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: activateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { activate: mutate, isPending, error };
};

// USER cancel subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { cancel: mutate, isPending, error };
};

// ADMIN clear subscription of a user
export const useAdminClearSubscription = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: clearSubscriptionByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { clear: mutate, isPending, error };
};
