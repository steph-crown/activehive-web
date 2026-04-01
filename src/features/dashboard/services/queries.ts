import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";
import type {
  DashboardDocument,
  GymOwnerDashboardOverview,
  UserProfile,
} from "../types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: () => [...dashboardQueryKeys.all, "documents"] as const,
  profile: () => [...dashboardQueryKeys.all, "profile"] as const,
  gymOwnerOverview: () =>
    [...dashboardQueryKeys.all, "gym-owner-overview"] as const,
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

export const useGymOwnerDashboardOverviewQuery = () =>
  useQuery<GymOwnerDashboardOverview>({
    queryKey: dashboardQueryKeys.gymOwnerOverview(),
    queryFn: () => dashboardApi.getGymOwnerOverview(),
  });
