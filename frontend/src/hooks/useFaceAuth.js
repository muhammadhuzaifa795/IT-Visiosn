// src/hooks/useFaceAuth.js
import { useMutation } from '@tanstack/react-query';
import { addFace, loginWithFace } from '../lib/api';
import { useQueryClient } from "@tanstack/react-query";

export const useAddFace = () =>
  useMutation({ mutationFn: addFace });

export const useLoginWithFace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithFace,
    onSuccess: ({ token, user }) => {
      localStorage.setItem("token", token);
      // force the "authUser" query to use the new data
      queryClient.setQueryData(["authUser"], { user });
      window.location.replace("/");
    },
  });
}