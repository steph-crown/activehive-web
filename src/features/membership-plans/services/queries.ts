import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipPlansApi } from "./api";
import type {
  MembershipPlan,
  MembershipPlanWithPromoCodes,
  CreateMembershipPlanPayload,
  UpdateMembershipPlanPayload,
  DuplicateMembershipPlanPayload,
  AddPromoCodePayload,
  TogglePromoCodePayload,
} from "../types";

export const membershipPlansQueryKeys = {
  all: ["membership-plans"] as const,
  list: (locationId?: string) =>
    [...membershipPlansQueryKeys.all, "list", locationId] as const,
  detail: (id: string) => [...membershipPlansQueryKeys.all, "detail", id] as const,
};

export const useMembershipPlansQuery = (locationId?: string) =>
  useQuery<MembershipPlan[]>({
    queryKey: membershipPlansQueryKeys.list(locationId),
    queryFn: () => membershipPlansApi.getMembershipPlans(locationId),
  });

export const useMembershipPlanQuery = (id: string) =>
  useQuery<MembershipPlanWithPromoCodes>({
    queryKey: membershipPlansQueryKeys.detail(id),
    queryFn: () => membershipPlansApi.getMembershipPlanById(id),
    enabled: !!id,
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

export const useUpdateMembershipPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMembershipPlanPayload;
    }) => membershipPlansApi.updateMembershipPlan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteMembershipPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membershipPlansApi.deleteMembershipPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.all,
      });
    },
  });
};

export const useDuplicateMembershipPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: DuplicateMembershipPlanPayload;
    }) => membershipPlansApi.duplicateMembershipPlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.all,
      });
    },
  });
};

export const useAddPromoCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddPromoCodePayload;
    }) => membershipPlansApi.addPromoCode(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.all,
      });
    },
  });
};

export const useRemovePromoCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) =>
      membershipPlansApi.removePromoCode(id, code),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.all,
      });
    },
  });
};

export const useTogglePromoCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      code,
      payload,
    }: {
      id: string;
      code: string;
      payload: TogglePromoCodePayload;
    }) => membershipPlansApi.togglePromoCode(id, code, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: membershipPlansQueryKeys.all,
      });
    },
  });
};
