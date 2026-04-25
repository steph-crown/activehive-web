import { apiClient } from "@/lib/api-client";
import { normalizeGymMemberDetail } from "../lib/normalize-member-detail";
import type {
  CreateMemberPayload,
  CreateMemberResponse,
  GymMemberDetail,
  GymMemberDetailApiResponse,
  MemberSubscription,
} from "../types";

const membersPath = "/api/gym-owner/dashboard/members/with-payment";
const subscriptionsMembersPath = "/api/gym-owner/subscriptions/members";

export const membersApi = {
  getMembers: (params?: { locationId?: string; search?: string }): Promise<MemberSubscription[]> => {
    const q: Record<string, string> = {};
    if (params?.locationId) q.locationId = params.locationId;
    if (params?.search?.trim()) q.search = params.search.trim();
    return apiClient.get<MemberSubscription[]>(subscriptionsMembersPath, { params: q });
  },
  getMemberById: async (
    routeId: string,
  ): Promise<GymMemberDetail> => {
    const raw = await apiClient.get<GymMemberDetailApiResponse>(
      `/api/gym-owner/members/${routeId}`,
    );
    return normalizeGymMemberDetail(raw, routeId);
  },
  createMember: (
    payload: CreateMemberPayload
  ): Promise<CreateMemberResponse> =>
    apiClient.post<CreateMemberResponse>(membersPath, payload),
};
