import { useQuery } from "@tanstack/react-query";
import { dashboardApi, type GymOwnerAnalyticsDashboardParams } from "./api";
import type {
  DashboardDocument,
  GymOwnerAnalyticsDashboard,
  MemberGrowthChartResponse,
  RevenueTrendChartResponse,
  UserProfile,
  WeeklyAttendanceChartResponse,
} from "../types";

function analyticsParamsKey(params: GymOwnerAnalyticsDashboardParams) {
  return [
    params.locationId ?? "all",
    params.startDate ?? "",
    params.endDate ?? "",
  ] as const;
}

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: () => [...dashboardQueryKeys.all, "documents"] as const,
  profile: () => [...dashboardQueryKeys.all, "profile"] as const,
  gymOwnerAnalyticsDashboard: (params: GymOwnerAnalyticsDashboardParams) =>
    [
      ...dashboardQueryKeys.all,
      "gym-owner-analytics-dashboard",
      ...analyticsParamsKey(params),
    ] as const,
  memberGrowthChart: (params: GymOwnerAnalyticsDashboardParams) =>
    [
      ...dashboardQueryKeys.all,
      "member-growth-chart",
      ...analyticsParamsKey(params),
    ] as const,
  revenueTrendChart: (params: GymOwnerAnalyticsDashboardParams) =>
    [
      ...dashboardQueryKeys.all,
      "revenue-trend-chart",
      ...analyticsParamsKey(params),
    ] as const,
  weeklyAttendanceChart: (params: GymOwnerAnalyticsDashboardParams) =>
    [
      ...dashboardQueryKeys.all,
      "weekly-attendance-chart",
      ...analyticsParamsKey(params),
    ] as const,
};

export const useDashboardDocumentsQuery = () =>
  useQuery<DashboardDocument[]>({
    queryKey: dashboardQueryKeys.documents(),
    queryFn: () => dashboardApi.getDocuments(),
  });

export const useProfileQuery = () =>
  useQuery<UserProfile>({
    queryKey: dashboardQueryKeys.profile(),
    queryFn: () => dashboardApi.getProfile(),
  });

export const useGymOwnerAnalyticsDashboardQuery = (
  params: GymOwnerAnalyticsDashboardParams = {},
) =>
  useQuery<GymOwnerAnalyticsDashboard>({
    queryKey: dashboardQueryKeys.gymOwnerAnalyticsDashboard(params),
    queryFn: () => dashboardApi.getGymOwnerAnalyticsDashboard(params),
  });

export const useMemberGrowthChartQuery = (
  params: GymOwnerAnalyticsDashboardParams = {},
) =>
  useQuery<MemberGrowthChartResponse>({
    queryKey: dashboardQueryKeys.memberGrowthChart(params),
    queryFn: () => dashboardApi.getMemberGrowthChart(params),
  });

export const useRevenueTrendChartQuery = (
  params: GymOwnerAnalyticsDashboardParams = {},
) =>
  useQuery<RevenueTrendChartResponse>({
    queryKey: dashboardQueryKeys.revenueTrendChart(params),
    queryFn: () => dashboardApi.getRevenueTrendChart(params),
  });

export const useWeeklyAttendanceChartQuery = (
  params: GymOwnerAnalyticsDashboardParams = {},
) =>
  useQuery<WeeklyAttendanceChartResponse>({
    queryKey: dashboardQueryKeys.weeklyAttendanceChart(params),
    queryFn: () => dashboardApi.getWeeklyAttendanceChart(params),
  });

export type { GymOwnerAnalyticsDashboardParams } from "./api";
