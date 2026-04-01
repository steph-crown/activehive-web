import { apiClient } from "@/lib/api-client";
import type {
  AssignTrainerToMemberPayload,
  CreateTrainerPayload,
  TrainerAssignment,
  TrainerAssignmentsListParams,
  TrainerListItem,
  TrainersListParams,
} from "../types";

const trainersPath = "/api/trainers";

export const trainersApi = {
  list: (params: TrainersListParams = {}): Promise<TrainerListItem[]> => {
    const query: Record<string, string> = {};
    if (params.locationId) query.locationId = params.locationId;
    return apiClient.get<TrainerListItem[]>(trainersPath, { params: query });
  },

  create: (payload: CreateTrainerPayload): Promise<unknown> => {
    const body: Record<string, unknown> = {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      specialties: payload.specialties,
      bio: payload.bio,
      locationIds: payload.locationIds,
    };
    if (payload.profileImage?.trim()) {
      body.profileImage = payload.profileImage.trim();
    }
    return apiClient.post<unknown>(trainersPath, body);
  },

  assignTrainer: (payload: AssignTrainerToMemberPayload): Promise<unknown> => {
    const body: Record<string, string> = {
      trainerId: payload.trainerId,
      memberId: payload.memberId,
      locationId: payload.locationId,
    };
    const notes = payload.notes?.trim();
    if (notes) body.notes = notes;
    return apiClient.post<unknown>(`${trainersPath}/assignments`, body);
  },

  listAssignments: (
    params: TrainerAssignmentsListParams = {},
  ): Promise<TrainerAssignment[]> => {
    const query: Record<string, string> = {};
    if (params.locationId) query.locationId = params.locationId;
    if (params.trainerId) query.trainerId = params.trainerId;
    if (params.memberId) query.memberId = params.memberId;
    return apiClient.get<TrainerAssignment[]>(`${trainersPath}/assignments`, {
      params: query,
    });
  },
};
