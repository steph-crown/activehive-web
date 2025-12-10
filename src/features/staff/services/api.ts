import { apiClient } from "@/lib/api-client";
import type { Staff, CreateStaffPayload } from "../types";

const staffPath = "/api/gym-owner/staff";

export const staffApi = {
  getStaff: (): Promise<Staff[]> =>
    apiClient.get<Staff[]>(staffPath),
  createStaff: (payload: CreateStaffPayload): Promise<Staff> =>
    apiClient.post<Staff>(staffPath, payload),
};
