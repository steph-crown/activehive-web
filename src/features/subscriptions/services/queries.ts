import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { subscriptionsApi } from "./api";
import type {
  Subscription,
  SubscriptionsFilters,
  UpdateSubscriptionStatusPayload,
  CancelSubscriptionPayload,
  ChangeSubscriptionPlanPayload,
} from "../types";

export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
  list: (filters?: SubscriptionsFilters) =>
    [...subscriptionsQueryKeys.all, "list", filters] as const,
  statistics: (locationId?: string) =>
    [...subscriptionsQueryKeys.all, "statistics", locationId] as const,
  detail: (id: string) => [...subscriptionsQueryKeys.all, "detail", id] as const,
};

export const useSubscriptionsQuery = (filters?: SubscriptionsFilters) =>
  useQuery({
    queryKey: subscriptionsQueryKeys.list(filters),
    queryFn: () => subscriptionsApi.getSubscriptions(filters),
    select: (data) => data.data, // Extract the data array from the response
  });

export const useSubscriptionStatisticsQuery = (locationId?: string) =>
  useQuery({
    queryKey: subscriptionsQueryKeys.statistics(locationId),
    queryFn: () => subscriptionsApi.getSubscriptionStatistics(locationId),
  });

export const useSubscriptionQuery = (id: string) =>
  useQuery({
    queryKey: subscriptionsQueryKeys.detail(id),
    queryFn: () => subscriptionsApi.getSubscriptionById(id),
    enabled: !!id,
  });

export const useUpdateSubscriptionStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubscriptionStatusPayload;
    }) => subscriptionsApi.updateSubscriptionStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.all,
      });
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload?: CancelSubscriptionPayload;
    }) => subscriptionsApi.cancelSubscription(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.all,
      });
    },
  });
};

export const useChangeSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ChangeSubscriptionPlanPayload;
    }) => subscriptionsApi.changeSubscriptionPlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.all,
      });
    },
  });
};
