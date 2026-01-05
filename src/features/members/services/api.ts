import { apiClient } from "@/lib/api-client";
import type { CreateMemberPayload, CreateMemberResponse, Member } from "../types";

const membersPath = "/api/gym-owner/dashboard/members";

export const membersApi = {
  getMembers: (): Promise<Member[]> =>
    apiClient.get<Member[]>(membersPath),
  createMember: (
    payload: CreateMemberPayload
  ): Promise<CreateMemberResponse> =>
    apiClient.post<CreateMemberResponse>(membersPath, payload),
};
