import { apiClient } from "@/lib/api-client";
import type { SubscriptionsResponse } from "../types";

const subscriptionsPath = "/api/gym-owner/subscriptions";

export const subscriptionsApi = {
  getSubscriptions: (): Promise<SubscriptionsResponse> =>
    apiClient.get<SubscriptionsResponse>(subscriptionsPath),
};
