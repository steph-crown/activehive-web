import { apiClient } from "@/lib/api-client";
import type {
  CreateMemberPayload,
  CreateMemberResponse,
  MemberSubscription,
} from "../types";

const membersPath = "/api/gym-owner/dashboard/members";
const subscriptionsMembersPath = "/api/gym-owner/subscriptions/members";

export const membersApi = {
  getMembers: (locationId?: string): Promise<MemberSubscription[]> => {
    const params = locationId ? { locationId } : {};
    return apiClient.get<MemberSubscription[]>(subscriptionsMembersPath, {
      params,
    });
  },
  createMember: (
    payload: CreateMemberPayload
  ): Promise<CreateMemberResponse> =>
    apiClient.post<CreateMemberResponse>(membersPath, payload),
};
