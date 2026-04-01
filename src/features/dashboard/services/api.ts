import { apiClient } from "@/lib/api-client";
import type {
  DashboardDocument,
  GymOwnerDashboardOverview,
  UserProfile,
} from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/documents";
const profilePath = "/api/profile";
const gymOwnerOverviewPath = "/api/gym-owner/dashboard/overview";

export const dashboardApi = {
  getGymOwnerOverview: (): Promise<GymOwnerDashboardOverview> =>
    apiClient.get<GymOwnerDashboardOverview>(gymOwnerOverviewPath),

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
