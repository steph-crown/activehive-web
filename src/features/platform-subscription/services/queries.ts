import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { platformSubscriptionApi } from "./api";

export const platformSubscriptionQueryKeys = {
  all: ["platform-subscription"] as const,
  mySubscription: () =>
    [...platformSubscriptionQueryKeys.all, "my-subscription"] as const,
  activePlans: () =>
    [...platformSubscriptionQueryKeys.all, "active-plans"] as const,
};

export const useMyPlatformSubscriptionQuery = (enabled = true) =>
  useQuery({
    queryKey: platformSubscriptionQueryKeys.mySubscription(),
    queryFn: platformSubscriptionApi.getMySubscription,
    enabled,
    retry: false,
  });

export const useActivePlatformPlansQuery = (enabled = true) =>
  useQuery({
    queryKey: platformSubscriptionQueryKeys.activePlans(),
    queryFn: platformSubscriptionApi.getActivePlans,
    enabled,
  });

export const useSubscribeToPlatformPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: platformSubscriptionApi.subscribeToPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: platformSubscriptionQueryKeys.mySubscription(),
      });
    },
  });
};
