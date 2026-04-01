import { apiClient } from "@/lib/api-client";
import type {
  DashboardDocument,
  GymOwnerAnalyticsDashboard,
  MemberGrowthChartResponse,
  RevenueTrendChartResponse,
  UserProfile,
} from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/documents";
const profilePath = "/api/profile";
const gymOwnerAnalyticsDashboardPath = "/api/gym-owner/analytics/dashboard";
const memberGrowthChartPath =
  "/api/gym-owner/analytics/charts/member-growth";
const revenueTrendChartPath =
  "/api/gym-owner/analytics/charts/revenue-trend";

export type GymOwnerAnalyticsDashboardParams = {
  /** Only when a branch is selected in the header location filter (omit for "Global"). */
  locationId?: string;
  startDate?: string;
  endDate?: string;
};

function analyticsQueryParams(
  params: GymOwnerAnalyticsDashboardParams,
): Record<string, string> {
  const query: Record<string, string> = {};
  if (params.locationId) query.locationId = params.locationId;
  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;
  return query;
}

export const dashboardApi = {
  getGymOwnerAnalyticsDashboard: (
    params: GymOwnerAnalyticsDashboardParams = {},
  ): Promise<GymOwnerAnalyticsDashboard> =>
    apiClient.get<GymOwnerAnalyticsDashboard>(
      gymOwnerAnalyticsDashboardPath,
      { params: analyticsQueryParams(params) },
    ),

  getMemberGrowthChart: (
    params: GymOwnerAnalyticsDashboardParams = {},
  ): Promise<MemberGrowthChartResponse> =>
    apiClient.get<MemberGrowthChartResponse>(memberGrowthChartPath, {
      params: analyticsQueryParams(params),
    }),

  getRevenueTrendChart: (
    params: GymOwnerAnalyticsDashboardParams = {},
  ): Promise<RevenueTrendChartResponse> =>
    apiClient.get<RevenueTrendChartResponse>(revenueTrendChartPath, {
      params: analyticsQueryParams(params),
    }),

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
