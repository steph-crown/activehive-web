import { apiClient } from "@/lib/api-client";
import type {
  GymLocation,
  LocationDetailsResponse,
  CreateLocationPayload,
  Facility,
} from "../types";

const locationsPath = "/api/gym-owner/locations";

export const locationsApi = {
  getLocations: (): Promise<GymLocation[]> =>
    apiClient.get<GymLocation[]>(locationsPath),
  getLocationById: (id: string): Promise<LocationDetailsResponse> =>
    apiClient.get<LocationDetailsResponse>(`${locationsPath}/${id}`),
  createLocation: (payload: CreateLocationPayload): Promise<GymLocation> =>
    apiClient.post<GymLocation>(locationsPath, payload),
  getFacilities: (locationId: string): Promise<Facility[]> =>
    apiClient.get<Facility[]>(`${locationsPath}/${locationId}/facilities`),
  createFacility: (
    locationId: string,
    payload: FormData
  ): Promise<Facility> => {
    return apiClient.post<Facility>(
      `${locationsPath}/${locationId}/facilities`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  updateFacility: (
    facilityId: string,
    payload: FormData
  ): Promise<Facility> => {
    return apiClient.patch<Facility>(
      `${locationsPath}/facilities/${facilityId}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  deleteFacility: (facilityId: string): Promise<void> =>
    apiClient.delete<void>(`${locationsPath}/facilities/${facilityId}`),
};
