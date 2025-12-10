import { apiClient } from "@/lib/api-client";
import type { DashboardDocument, UserProfile } from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/documents";
const profilePath = "/api/profile";

export const dashboardApi = {
  getDocuments: async (): Promise<DashboardDocument[]> => {
    try {
      return await apiClient.get<DashboardDocument[]>(basePath);
    } catch {
      return mockData;
    }
  },
  getProfile: (): Promise<UserProfile> =>
    apiClient.get<UserProfile>(profilePath),
};
