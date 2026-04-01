import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainersApi } from "./api";
import { trainersQueryKeys } from "./queries";
import type {
  AssignTrainerToMemberPayload,
  CreateTrainerPayload,
} from "../types";

export const useCreateTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrainerPayload) => trainersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainersQueryKeys.all });
    },
  });
};

export const useAssignTrainerToMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignTrainerToMemberPayload) =>
      trainersApi.assignTrainer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainersQueryKeys.all });
    },
  });
};
