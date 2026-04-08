import { apiClient } from "@/lib/api-client";
import type {
  GymLocation,
  GymOwnerProfile,
  GymOwnerProfilePatchPayload,
  LocationDetailsResponse,
  CreateLocationPayload,
  Facility,
  LocationOperatingHoursDay,
  PutLocationOperatingHoursPayload,
} from "../types";

const locationsPath = "/api/gym-owner/locations";
const gymOwnerGymProfilePath = "/api/gym-owner/gym-profile";

export const gymProfileApi = {
  get: (): Promise<GymOwnerProfile> =>
    apiClient.get<GymOwnerProfile>(gymOwnerGymProfilePath),
  patch: (
    payload: GymOwnerProfilePatchPayload,
  ): Promise<GymOwnerProfile> =>
    apiClient.patch<GymOwnerProfile>(gymOwnerGymProfilePath, payload),
};

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
  uploadLocationImage: (
    locationId: string,
    image: File
  ): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("image", image);
    return apiClient.post<{ imageUrl: string }>(
      `${locationsPath}/${locationId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  deleteLocationImage: (
    locationId: string,
    imageIndex: string
  ): Promise<void> =>
    apiClient.delete<void>(
      `${locationsPath}/${locationId}/images/${imageIndex}`
    ),
  uploadCoverImage: (locationId: string, image: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("image", image);
    return apiClient.post<{ imageUrl: string }>(
      `${locationsPath}/${locationId}/cover-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  getCoverImage: (locationId: string): Promise<{ imageUrl: string }> =>
    apiClient.get<{ imageUrl: string }>(`${locationsPath}/${locationId}/cover-image`),
  getOperatingHours: (
    locationId: string,
  ): Promise<LocationOperatingHoursDay[]> =>
    apiClient.get<LocationOperatingHoursDay[]>(
      `${locationsPath}/${locationId}/operating-hours`,
    ),
  putOperatingHours: (
    locationId: string,
    payload: PutLocationOperatingHoursPayload,
  ): Promise<unknown> =>
    apiClient.put<unknown>(
      `${locationsPath}/${locationId}/operating-hours`,
      payload,
    ),
};
