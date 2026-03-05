import { apiClient } from "@/lib/api-client";
import type {
  GymOwnerSubscriptionPlansResponse,
  MySubscriptionResponse,
  SwitchPlanPayload,
} from "../types";

const subscriptionsBasePath = "/api/subscriptions";
const gymOwnerRegistrationBasePath = "/api/gym-owner-registration";

export const billingApi = {
  getMySubscription: (): Promise<MySubscriptionResponse> =>
    apiClient.get<MySubscriptionResponse>(
      `${subscriptionsBasePath}/my-subscription`
    ),
  getAvailablePlans: (): Promise<GymOwnerSubscriptionPlansResponse> =>
    apiClient.get<GymOwnerSubscriptionPlansResponse>(
      `${gymOwnerRegistrationBasePath}/subscription-plans`
    ),
  switchPlan: (payload: SwitchPlanPayload): Promise<void> =>
    apiClient.post<void>(
      `${gymOwnerRegistrationBasePath}/switch-plan`,
      payload
    ),
};
