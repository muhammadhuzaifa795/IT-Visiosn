import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminContacts, updateContactStatus, deleteContact } from "../lib/api";

const useAdminContacts = () => {
  const queryClient = useQueryClient();

  const adminContacts = useQuery({
    queryKey: ["adminContacts"],
    queryFn: getAdminContacts,
  });

  const updateStatus = useMutation({
    mutationFn: updateContactStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContacts"] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContacts"] });
    },
  });

  return {
    adminContacts,
    updateStatusMutation: updateStatus.mutate,
    deleteContactMutation: deleteContactMutation.mutate,
    isUpdating: updateStatus.isPending,
    isDeleting: deleteContactMutation.isPending,
    updateError: updateStatus.error,
    deleteError: deleteContactMutation.error,
  };
};

export default useAdminContacts;