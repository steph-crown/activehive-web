import { apiClient } from "@/lib/api-client";
import type { MySubscriptionResponse } from "../types";

const basePath = "/api/subscriptions";

export const billingApi = {
  getMySubscription: (): Promise<MySubscriptionResponse> =>
    apiClient.get<MySubscriptionResponse>(`${basePath}/my-subscription`),
};
