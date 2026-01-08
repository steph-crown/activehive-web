import { apiClient } from "@/lib/api-client";
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types";

const profilePath = "/api/profile";

export const profileApi = {
  getProfile: (): Promise<UserProfile> =>
    apiClient.get<UserProfile>(profilePath),
  updateProfile: (payload: UpdateProfilePayload): Promise<UserProfile> =>
    apiClient.put<UserProfile>(profilePath, payload),
  changePassword: (payload: ChangePasswordPayload): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>(`${profilePath}/change-password`, payload),
};
