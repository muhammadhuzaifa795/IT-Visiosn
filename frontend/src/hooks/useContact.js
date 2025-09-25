// hooks/useContact.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContact, getUserContacts, deleteContact } from "../lib/api";

const useContacts = (userId) => {
  const queryClient = useQueryClient();

  const userContacts = useQuery({
    queryKey: ["userContacts", userId],
    queryFn: () => getUserContacts(userId), // Pass userId to the API function
    enabled: !!userId,
    retry: 1, // Limit retries for failed queries
  });

  const create = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userContacts", userId] });
    },
    onError: (error) => {
      console.error("Error creating contact:", error);
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userContacts", userId] });
      toast.success("✅ Contact deleted successfully!", {
        style: { background: "hsl(var(--su))", color: "hsl(var(--suc))" },
      });
    },
    onError: (error) => {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact", {
        style: { background: "hsl(var(--er))", color: "hsl(var(--erc))" },
      });
    },
  });

  return {
    userContacts,
    createContactMutation: create.mutate,
    isCreating: create.isPending,
    createError: create.error,
    deleteContactMutation: deleteContactMutation.mutate,
    isDeleting: deleteContactMutation.isPending,
    deleteError: deleteContactMutation.error,
  };
};

export default useContacts;