import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "./api";
import type { MySubscriptionResponse } from "../types";
import { useSubscriptionStore } from "@/store";

export const billingQueryKeys = {
  all: ["billing"] as const,
  mySubscription: () => [...billingQueryKeys.all, "my-subscription"] as const,
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
