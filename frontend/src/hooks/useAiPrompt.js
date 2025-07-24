import { useMutation } from "@tanstack/react-query";
import { aiPrompt } from "../lib/api";

const useAiPrompt = (setResponse) => {
  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: aiPrompt,
    onSuccess: (data) => {
      console.log("AI response received:", data);
      setResponse(data.result); // Match backend's structure: { result: "...text..." }
    },
    onError: (err) => {
      console.error("AI prompt error:", err.message);
    },
  });

  return { aiMutation: mutate, isPending, error };
};

export default useAiPrompt;