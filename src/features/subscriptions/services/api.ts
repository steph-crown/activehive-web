import { apiClient } from "@/lib/api-client";
import type { Subscription } from "../types";

const subscriptionsPath = "/api/gym-owner/subscriptions";

export const subscriptionsApi = {
  getSubscriptions: (): Promise<Subscription[]> =>
    apiClient.get<Subscription[]>(subscriptionsPath),
};
