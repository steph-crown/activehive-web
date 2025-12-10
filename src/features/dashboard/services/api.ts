import { apiClient } from "@/lib/api-client";
import type {
  DashboardDocument,
  UserProfile,
  MembershipPlan,
  CreateMembershipPlanPayload,
  GymLocation,
} from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/documents";
const profilePath = "/api/profile";
const membershipPlansPath = "/api/membership-plans";
const locationsPath = "/api/gym-owner/locations";

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
  getMembershipPlans: (locationId?: string): Promise<MembershipPlan[]> => {
    const params = locationId ? { locationId } : {};
    return apiClient.get<MembershipPlan[]>(membershipPlansPath, { params });
  },
  createMembershipPlan: (
    payload: CreateMembershipPlanPayload
  ): Promise<MembershipPlan> =>
    apiClient.post<MembershipPlan>(membershipPlansPath, payload),
  getLocations: (): Promise<GymLocation[]> =>
    apiClient.get<GymLocation[]>(locationsPath),
};
