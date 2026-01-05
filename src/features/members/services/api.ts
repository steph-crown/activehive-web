import { apiClient } from "@/lib/api-client";
import type { CreateMemberPayload, CreateMemberResponse } from "../types";

const membersPath = "/api/gym-owner/dashboard/members";

export const membersApi = {
  createMember: (
    payload: CreateMemberPayload
  ): Promise<CreateMemberResponse> =>
    apiClient.post<CreateMemberResponse>(membersPath, payload),
};
