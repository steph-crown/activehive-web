import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInsApi } from "./api";
import { checkInsQueryKeys } from "./queries";
import type { CreateCheckInPayload } from "../types";

export const useCreateCheckInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCheckInPayload) => checkInsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkInsQueryKeys.all });
    },
  });
};
