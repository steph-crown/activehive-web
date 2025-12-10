import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "./api";
import type {
  DashboardDocument,
  UserProfile,
  MembershipPlan,
  CreateMembershipPlanPayload,
  GymLocation,
} from "../types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: () => [...dashboardQueryKeys.all, "documents"] as const,
  profile: () => [...dashboardQueryKeys.all, "profile"] as const,
  membershipPlans: (locationId?: string) =>
    [...dashboardQueryKeys.all, "membership-plans", locationId] as const,
  locations: () => [...dashboardQueryKeys.all, "locations"] as const,
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

export const useMembershipPlansQuery = (locationId?: string) =>
  useQuery<MembershipPlan[]>({
    queryKey: dashboardQueryKeys.membershipPlans(locationId),
    queryFn: () => dashboardApi.getMembershipPlans(locationId),
  });

export const useLocationsQuery = () =>
  useQuery<GymLocation[]>({
    queryKey: dashboardQueryKeys.locations(),
    queryFn: () => dashboardApi.getLocations(),
  });

export const useCreateMembershipPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMembershipPlanPayload) =>
      dashboardApi.createMembershipPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.membershipPlans(),
      });
    },
  });
};
