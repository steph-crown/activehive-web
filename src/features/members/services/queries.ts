import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "./api";
import type {
  CreateMemberPayload,
  GymMemberDetail,
  MemberSubscription,
} from "../types";

export const membersQueryKeys = {
  all: ["members"] as const,
  list: (locationId?: string, search?: string) =>
    [...membersQueryKeys.all, "list", locationId ?? null, search ?? null] as const,
  detail: (memberId: string) =>
    [...membersQueryKeys.all, "detail", memberId] as const,
};

export const useMembersQuery = (
  locationId?: string,
  options?: { enabled?: boolean; search?: string },
) =>
  useQuery<MemberSubscription[]>({
    queryKey: membersQueryKeys.list(locationId, options?.search),
    queryFn: () => membersApi.getMembers({ locationId, search: options?.search }),
    enabled: options?.enabled ?? true,
  });

export const useMemberByIdQuery = (memberId: string | undefined) =>
  useQuery<GymMemberDetail>({
    queryKey: membersQueryKeys.detail(memberId ?? ""),
    queryFn: () => membersApi.getMemberById(memberId!),
    enabled: Boolean(memberId),
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
