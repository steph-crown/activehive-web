import { useQuery } from "@tanstack/react-query";
import { billingApi } from "./api";
import type { MySubscriptionResponse } from "../types";
import { useSubscriptionStore } from "@/store";

export const billingQueryKeys = {
  all: ["billing"] as const,
  mySubscription: () => [...billingQueryKeys.all, "my-subscription"] as const,
};

export const useMySubscriptionQuery = () => {
  const setSubscription = useSubscriptionStore((state) => state.setSubscription);

  return useQuery({
    queryKey: billingQueryKeys.mySubscription(),
    queryFn: () => billingApi.getMySubscription(),
    onSuccess: (data: MySubscriptionResponse) => {
      // Treat inactive subscriptions as "no active subscription" in the store
      if (data.isActive) {
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    },
    onError: () => {
      setSubscription(null);
    },
  });
};
