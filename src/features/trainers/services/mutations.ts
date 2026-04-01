import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainersApi } from "./api";
import type { CreateTrainerPayload } from "../types";

export const trainersQueryKeys = {
  all: ["trainers"] as const,
};

export const useCreateTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrainerPayload) => trainersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainersQueryKeys.all });
    },
  });
};
