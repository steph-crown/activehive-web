import { apiClient } from "@/lib/api-client";
import type {
  GymOwnerSubscriptionPlansResponse,
  MySubscriptionResponse,
  ChangePlanPayload,
  CancelSubscriptionPayload,
} from "../types";

const subscriptionsBasePath = "/api/subscriptions";
const gymOwnerRegistrationBasePath = "/api/gym-owner-registration";
const adminSubscriptionPlansPath = "/api/admin/subscription-plans";

export const billingApi = {
  getMySubscription: (): Promise<MySubscriptionResponse> =>
    apiClient.get<MySubscriptionResponse>(
      `${subscriptionsBasePath}/my-subscription`,
    ),

  getAvailablePlans: (): Promise<GymOwnerSubscriptionPlansResponse> =>
    apiClient.get<GymOwnerSubscriptionPlansResponse>(
      `${gymOwnerRegistrationBasePath}/subscription-plans`,
    ),

  subscribe: (planId: string, promoCode?: string): Promise<unknown> =>
    apiClient.post<unknown>(`${adminSubscriptionPlansPath}/subscribe`, {
      planId,
      ...(promoCode ? { promoCode } : {}),
    }),

  changePlan: (payload: ChangePlanPayload): Promise<unknown> =>
    apiClient.post<unknown>(
      `${adminSubscriptionPlansPath}/change-plan`,
      payload,
    ),

  cancelSubscription: (payload?: CancelSubscriptionPayload): Promise<void> =>
    apiClient.patch<void>(`${adminSubscriptionPlansPath}/cancel`, payload ?? {}),
};
