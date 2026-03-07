import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "./api";
import type {
  GymOwnerSubscriptionPlansResponse,
  MySubscriptionResponse,
  SwitchPlanPayload,
} from "../types";
import { useSubscriptionStore } from "@/store";

export const billingQueryKeys = {
  all: ["billing"] as const,
  mySubscription: () => [...billingQueryKeys.all, "my-subscription"] as const,
  plans: () => [...billingQueryKeys.all, "plans"] as const,
};

export const useMySubscriptionQuery = () => {
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription,
  );

  const queryResult = useQuery<MySubscriptionResponse>({
    queryKey: billingQueryKeys.mySubscription(),
    queryFn: () => billingApi.getMySubscription(),
  });

  useEffect(() => {
    if (queryResult.status === "success" && queryResult.data) {
      const data = queryResult.data;
      console.log({ data });

      // Treat users as having access if they have either an active subscription or an active trial
      if (data.isActive || data.isTrial) {
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    }

    if (queryResult.status === "error") {
      setSubscription(null);
    }
  }, [queryResult.status, queryResult.data, setSubscription]);

  return queryResult;
};

export const useGymOwnerPlansQuery = () =>
  useQuery<GymOwnerSubscriptionPlansResponse>({
    queryKey: billingQueryKeys.plans(),
    queryFn: () => billingApi.getAvailablePlans(),
  });

export const useSwitchPlanMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SwitchPlanPayload) => billingApi.switchPlan(payload),
  });

  const switchPlan = async (payload: SwitchPlanPayload) => {
    await mutation.mutateAsync(payload);
    await queryClient.invalidateQueries({
      queryKey: billingQueryKeys.mySubscription(),
    });
  };

  return {
    ...mutation,
    switchPlan,
  };
};
