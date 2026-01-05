import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "./api";
import type { CreateMemberPayload } from "../types";

export const membersQueryKeys = {
  all: ["members"] as const,
  list: () => [...membersQueryKeys.all, "list"] as const,
};

export const useCreateMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMemberPayload) =>
      membersApi.createMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: membersQueryKeys.all,
      });
    },
  });
};
