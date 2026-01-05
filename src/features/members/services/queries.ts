import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "./api";
import type { CreateMemberPayload, MemberSubscription } from "../types";

export const membersQueryKeys = {
  all: ["members"] as const,
  list: (locationId?: string) =>
    [...membersQueryKeys.all, "list", locationId] as const,
};

export const useMembersQuery = (locationId?: string) =>
  useQuery<MemberSubscription[]>({
    queryKey: membersQueryKeys.list(locationId),
    queryFn: () => membersApi.getMembers(locationId),
  });

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
