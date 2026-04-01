import { apiClient } from "@/lib/api-client";
import type { CreateTrainerPayload } from "../types";

const trainersPath = "/api/trainers";

export const trainersApi = {
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
};
