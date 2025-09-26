import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket, getTicket, deleteTicket, getTicketById, addSolutionToTicket } from "../lib/api";

const useTickets = () => {
  const queryClient = useQueryClient();

  const { data, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTicket,
  });

  const { mutate: createTicketMutation, isPending: isCreating, error: createError } = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  const { mutate: deleteTicketMutation, isPending: isDeleting, error: deleteError } = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  const { mutate: addSolutionMutation, isPending: isAddingSolution, error: addSolutionError } = useMutation({
    mutationFn: ({ ticketId, solutionText }) => addSolutionToTicket(ticketId, solutionText),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });


 const useTicketById = (id) =>
  useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const ticket = await getTicketById(id);

      // Clean helpfulNotes
      if (ticket?.helpfulNotes) {
        ticket.helpfulNotes = ticket.helpfulNotes
          .replace(/(\*\*|\/\/|\/\*|\*\/)/g, "") // bold markers, comments
          .replace(/<[^>]*>/g, "") // HTML tags remove
          .replace(/\p{Emoji}/gu, "") // emojis remove
          .replace(/\s+/g, " ") // multiple spaces → single
          .trim();
      }

      return ticket;
    },
    enabled: !!id,
  });

  return {
    tickets: data?.tickets || [],
    isFetching,
    fetchError,
    createTicket: createTicketMutation,
    isCreating,
    createError,
    deleteTicket: deleteTicketMutation,
    isDeleting,
    deleteError,
    addSolution: addSolutionMutation,
    isAddingSolution,
    addSolutionError,
    useTicketById,
  };
};

export default useTickets;