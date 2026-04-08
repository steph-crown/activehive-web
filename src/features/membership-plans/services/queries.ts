import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as React from "react";
import { membershipPlansApi } from "./api";
import type {
  MembershipPlan,
  MembershipPlanWithPromoCodes,
  CreateMembershipPlanPayload,
  UpdateMembershipPlanPayload,
  DuplicateMembershipPlanPayload,
  AddPromoCodePayload,
  TogglePromoCodePayload,
  PromoCode,
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

/** All promo codes across plans, for marketing list (GET plan list + GET each plan detail). */
export type PromoCodeCatalogRow = {
  id: string;
  location: string;
  planName: string;
  code: string;
  typeLabel: string;
  valueDisplay: string;
  usesDisplay: string;
  status: "active" | "inactive" | "expired";
  expiresDisplay: string;
  plan: MembershipPlanWithPromoCodes;
  promo: PromoCode;
};

function catalogStatus(promo: PromoCode): "active" | "inactive" | "expired" {
  const now = Date.now();
  const end = new Date(promo.validUntil).getTime();
  if (Number.isNaN(end) || now > end) return "expired";
  if (!promo.isActive) return "inactive";
  const start = new Date(promo.validFrom).getTime();
  if (Number.isNaN(start) || now < start) return "inactive";
  return "active";
}

function formatPromoValue(promo: PromoCode): string {
  if (promo.discountType === "percentage") {
    return `${promo.discountValue}%`;
  }
  return `₦${Number(promo.discountValue).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function usePromoCodesCatalogQuery() {
  const { data: plans, isPending: plansPending } = useMembershipPlansQuery();
  const planIds = React.useMemo(
    () => (plans ?? []).map((p) => p.id),
    [plans],
  );

  const detailQueries = useQueries({
    queries: planIds.map((id) => ({
      queryKey: membershipPlansQueryKeys.detail(id),
      queryFn: () => membershipPlansApi.getMembershipPlanById(id),
      enabled: planIds.length > 0,
    })),
  });

  const detailsPending =
    planIds.length > 0 && detailQueries.some((q) => q.isPending);

  const rows = React.useMemo((): PromoCodeCatalogRow[] => {
    const out: PromoCodeCatalogRow[] = [];
    for (let i = 0; i < planIds.length; i++) {
      const plan = detailQueries[i]?.data;
      if (!plan?.promoCodes?.length) continue;
      for (const promo of plan.promoCodes) {
        const uses = promo.currentUses ?? 0;
        const max = promo.maxUses;
        out.push({
          id: `${plan.id}::${promo.code}`,
          location: plan.location.locationName,
          planName: plan.name,
          code: promo.code,
          typeLabel:
            promo.discountType === "percentage" ? "Percentage" : "Fixed",
          valueDisplay: formatPromoValue(promo),
          usesDisplay:
            max != null ? `${uses} / ${max}` : String(uses),
          status: catalogStatus(promo),
          expiresDisplay: new Date(promo.validUntil).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          ),
          plan,
          promo,
        });
      }
    }
    return out;
  }, [planIds, detailQueries]);

  return {
    rows,
    isLoading: plansPending || detailsPending,
  };
}

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
