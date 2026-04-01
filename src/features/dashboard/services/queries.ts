import { useQuery } from "@tanstack/react-query";
import { dashboardApi, type GymOwnerAnalyticsDashboardParams } from "./api";
import type {
  DashboardDocument,
  GymOwnerAnalyticsDashboard,
  UserProfile,
} from "../types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: () => [...dashboardQueryKeys.all, "documents"] as const,
  profile: () => [...dashboardQueryKeys.all, "profile"] as const,
  gymOwnerAnalyticsDashboard: (params: GymOwnerAnalyticsDashboardParams) =>
    [
      ...dashboardQueryKeys.all,
      "gym-owner-analytics-dashboard",
      params.locationId ?? "all",
      params.startDate ?? "",
      params.endDate ?? "",
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

export type { GymOwnerAnalyticsDashboardParams } from "./api";
