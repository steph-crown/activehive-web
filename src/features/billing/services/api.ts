import { apiClient } from "@/lib/api-client";
import type {
  GymOwnerSubscriptionPlansResponse,
  MySubscriptionResponse,
  ChangePlanPayload,
  CancelSubscriptionPayload,
  SubscribeResponse,
  ChangePlanResponse,
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

  subscribe: (planId: string, promoCode?: string): Promise<SubscribeResponse> =>
    apiClient.post<SubscribeResponse>(`${adminSubscriptionPlansPath}/subscribe`, {
      planId,
      ...(promoCode ? { promoCode } : {}),
    }),

  changePlan: (payload: ChangePlanPayload): Promise<ChangePlanResponse> =>
    apiClient.post<ChangePlanResponse>(
      `${adminSubscriptionPlansPath}/change-plan`,
      payload,
    ),

  cancelSubscription: (payload?: CancelSubscriptionPayload): Promise<void> =>
    apiClient.patch<void>(`${adminSubscriptionPlansPath}/cancel`, payload ?? {}),
};
