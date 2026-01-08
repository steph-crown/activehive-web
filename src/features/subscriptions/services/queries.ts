import { useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "./api";
import type { Subscription } from "../types";

export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionsQueryKeys.all, "list"] as const,
};

export const useSubscriptionsQuery = () =>
  useQuery({
    queryKey: subscriptionsQueryKeys.list(),
    queryFn: () => subscriptionsApi.getSubscriptions(),
    select: (data) => data.data, // Extract the data array from the response
  });
