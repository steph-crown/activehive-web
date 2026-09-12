import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "./api";
import type {
  GymOwnerSubscriptionPlansResponse,
  MySubscriptionResponse,
  ChangePlanPayload,
  CancelSubscriptionPayload,
  SubscribeResponse,
  ChangePlanResponse,
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

export const useSubscribeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<SubscribeResponse, Error, { planId: string; promoCode?: string }>({
    mutationFn: ({ planId, promoCode }) => billingApi.subscribe(planId, promoCode),
    onSuccess: (data) => {
      if (!data.paymentUrl) {
        void queryClient.invalidateQueries({
          queryKey: billingQueryKeys.mySubscription(),
        });
      }
    },
  });
};

export const useChangePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ChangePlanResponse, Error, ChangePlanPayload>({
    mutationFn: (payload) => billingApi.changePlan(payload),
    onSuccess: (data) => {
      if (!data.paymentUrl) {
        void queryClient.invalidateQueries({
          queryKey: billingQueryKeys.mySubscription(),
        });
      }
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CancelSubscriptionPayload) =>
      billingApi.cancelSubscription(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: billingQueryKeys.mySubscription(),
      });
    },
  });
};
