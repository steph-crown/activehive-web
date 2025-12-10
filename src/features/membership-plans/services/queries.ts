import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipPlansApi } from "./api";
import type {
  MembershipPlan,
  CreateMembershipPlanPayload,
} from "../types";

export const membershipPlansQueryKeys = {
  all: ["membership-plans"] as const,
  list: (locationId?: string) =>
    [...membershipPlansQueryKeys.all, "list", locationId] as const,
};

export const useMembershipPlansQuery = (locationId?: string) =>
  useQuery<MembershipPlan[]>({
    queryKey: membershipPlansQueryKeys.list(locationId),
    queryFn: () => membershipPlansApi.getMembershipPlans(locationId),
  });

export const useCreateMembershipPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMembershipPlanPayload) =>
      membershipPlansApi.createMembershipPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.all,
      });
    },
  });
};
