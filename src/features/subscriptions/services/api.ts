import { apiClient } from "@/lib/api-client";
import type {
  SubscriptionsResponse,
  SubscriptionsFilters,
  Subscription,
  SubscriptionStatistics,
  UpdateSubscriptionStatusPayload,
  CancelSubscriptionPayload,
  ChangeSubscriptionPlanPayload,
} from "../types";

const subscriptionsPath = "/api/gym-owner/subscriptions";

export const subscriptionsApi = {
  getSubscriptions: (
    filters?: SubscriptionsFilters
  ): Promise<SubscriptionsResponse> => {
    const params: Record<string, string | number> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.membershipPlanId) params.membershipPlanId = filters.membershipPlanId;
    if (filters?.memberId) params.memberId = filters.memberId;
    if (filters?.locationId) params.locationId = filters.locationId;
    if (filters?.search) params.search = filters.search;
    if (filters?.startDateFrom) params.startDateFrom = filters.startDateFrom;
    if (filters?.startDateTo) params.startDateTo = filters.startDateTo;
    if (filters?.endDateFrom) params.endDateFrom = filters.endDateFrom;
    if (filters?.endDateTo) params.endDateTo = filters.endDateTo;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    return apiClient.get<SubscriptionsResponse>(subscriptionsPath, { params });
  },
  getSubscriptionStatistics: (
    locationId?: string
  ): Promise<SubscriptionStatistics> => {
    const params = locationId ? { locationId } : {};
    return apiClient.get<SubscriptionStatistics>(
      `${subscriptionsPath}/statistics`,
      { params }
    );
  },
  getSubscriptionById: (id: string): Promise<Subscription> =>
    apiClient.get<Subscription>(`${subscriptionsPath}/${id}`),
  updateSubscriptionStatus: (
    id: string,
    payload: UpdateSubscriptionStatusPayload
  ): Promise<Subscription> =>
    apiClient.patch<Subscription>(
      `${subscriptionsPath}/${id}/status`,
      payload
    ),
  cancelSubscription: (
    id: string,
    payload?: CancelSubscriptionPayload
  ): Promise<Subscription> =>
    apiClient.post<Subscription>(
      `${subscriptionsPath}/${id}/cancel`,
      payload || {}
    ),
  changeSubscriptionPlan: (
    id: string,
    payload: ChangeSubscriptionPlanPayload
  ): Promise<Subscription> =>
    apiClient.patch<Subscription>(
      `${subscriptionsPath}/${id}/change-plan`,
      payload
    ),
};
