import { apiClient } from "@/lib/api-client";
import type {
  DashboardDocument,
  GymOwnerAnalyticsDashboard,
  UserProfile,
} from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/documents";
const profilePath = "/api/profile";
const gymOwnerAnalyticsDashboardPath = "/api/gym-owner/analytics/dashboard";

export type GymOwnerAnalyticsDashboardParams = {
  /** Only when a branch is selected in the header location filter (omit for "Global"). */
  locationId?: string;
  startDate?: string;
  endDate?: string;
};

export const dashboardApi = {
  getGymOwnerAnalyticsDashboard: (
    params: GymOwnerAnalyticsDashboardParams = {},
  ): Promise<GymOwnerAnalyticsDashboard> => {
    const query: Record<string, string> = {};
    if (params.locationId) query.locationId = params.locationId;
    if (params.startDate) query.startDate = params.startDate;
    if (params.endDate) query.endDate = params.endDate;
    return apiClient.get<GymOwnerAnalyticsDashboard>(
      gymOwnerAnalyticsDashboardPath,
      {
        params: query,
      },
    );
  },

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
