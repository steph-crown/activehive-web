import { apiClient } from "@/lib/api-client";
import type {
  MembershipPlan,
  CreateMembershipPlanPayload,
} from "../types";

const membershipPlansPath = "/api/membership-plans";

export const membershipPlansApi = {
  getMembershipPlans: (locationId?: string): Promise<MembershipPlan[]> => {
    const params = locationId ? { locationId } : {};
    return apiClient.get<MembershipPlan[]>(membershipPlansPath, { params });
  },
  createMembershipPlan: (
    payload: CreateMembershipPlanPayload
  ): Promise<MembershipPlan> =>
    apiClient.post<MembershipPlan>(membershipPlansPath, payload),
};
