import { useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "./api";
import type { Subscription } from "../types";

export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionsQueryKeys.all, "list"] as const,
};

export const useSubscriptionsQuery = () =>
  useQuery<Subscription[]>({
    queryKey: subscriptionsQueryKeys.list(),
    queryFn: () => subscriptionsApi.getSubscriptions(),
  });
