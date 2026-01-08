import { apiClient } from "@/lib/api-client";
import type {
  MembershipPlan,
  MembershipPlanWithPromoCodes,
  CreateMembershipPlanPayload,
  UpdateMembershipPlanPayload,
  DuplicateMembershipPlanPayload,
  AddPromoCodePayload,
  TogglePromoCodePayload,
} from "../types";

const membershipPlansPath = "/api/membership-plans";

export const membershipPlansApi = {
  getMembershipPlans: (locationId?: string): Promise<MembershipPlan[]> => {
    const params = locationId ? { locationId } : {};
    return apiClient.get<MembershipPlan[]>(membershipPlansPath, { params });
  },
  getMembershipPlanById: (id: string): Promise<MembershipPlanWithPromoCodes> =>
    apiClient.get<MembershipPlanWithPromoCodes>(`${membershipPlansPath}/${id}`),
  createMembershipPlan: (
    payload: CreateMembershipPlanPayload
  ): Promise<MembershipPlan> =>
    apiClient.post<MembershipPlan>(membershipPlansPath, payload),
  updateMembershipPlan: (
    id: string,
    payload: UpdateMembershipPlanPayload
  ): Promise<MembershipPlan> =>
    apiClient.put<MembershipPlan>(`${membershipPlansPath}/${id}`, payload),
  deleteMembershipPlan: (id: string): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(`${membershipPlansPath}/${id}`),
  duplicateMembershipPlan: (
    id: string,
    payload: DuplicateMembershipPlanPayload
  ): Promise<MembershipPlan> =>
    apiClient.post<MembershipPlan>(
      `${membershipPlansPath}/${id}/duplicate`,
      payload
    ),
  addPromoCode: (
    id: string,
    payload: AddPromoCodePayload
  ): Promise<MembershipPlanWithPromoCodes> =>
    apiClient.post<MembershipPlanWithPromoCodes>(
      `${membershipPlansPath}/${id}/promo-codes`,
      payload
    ),
  removePromoCode: (
    id: string,
    code: string
  ): Promise<MembershipPlanWithPromoCodes> =>
    apiClient.delete<MembershipPlanWithPromoCodes>(
      `${membershipPlansPath}/${id}/promo-codes/${code}`
    ),
  togglePromoCode: (
    id: string,
    code: string,
    payload: TogglePromoCodePayload
  ): Promise<MembershipPlanWithPromoCodes> =>
    apiClient.patch<MembershipPlanWithPromoCodes>(
      `${membershipPlansPath}/${id}/promo-codes/${code}/toggle`,
      payload
    ),
};
