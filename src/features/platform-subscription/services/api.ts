import { apiClient } from "@/lib/api-client";
import type { PlatformPlan, PlatformSubscription } from "../types";

const mySubscriptionPath = "/api/admin/subscription-plans/my-subscription";
const activePlansPath = "/api/subscription-plans/active";
const subscribePath = "/api/admin/subscription-plans/subscribe";

export const platformSubscriptionApi = {
  getMySubscription: (): Promise<PlatformSubscription | null> =>
    apiClient.get<PlatformSubscription | null>(mySubscriptionPath),

  getActivePlans: async (): Promise<PlatformPlan[]> => {
    const res = await apiClient.get<PlatformPlan[] | { data: PlatformPlan[] }>(
      activePlansPath,
      { params: { planType: "gym_owner" } },
    );
    return Array.isArray(res)
      ? res
      : ((res as { data: PlatformPlan[] }).data ?? []);
  },

  subscribeToPlan: (planId: string): Promise<PlatformSubscription> =>
    apiClient.post<PlatformSubscription>(subscribePath, { planId }),
};
