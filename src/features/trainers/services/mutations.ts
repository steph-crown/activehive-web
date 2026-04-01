import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainersApi } from "./api";
import { trainersQueryKeys } from "./queries";
import type { CreateTrainerPayload } from "../types";

export const useCreateTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrainerPayload) => trainersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainersQueryKeys.all });
    },
  });
};
