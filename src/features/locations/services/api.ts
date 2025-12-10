import { apiClient } from "@/lib/api-client";
import type { GymLocation } from "../types";

const locationsPath = "/api/gym-owner/locations";

export const locationsApi = {
  getLocations: (): Promise<GymLocation[]> =>
    apiClient.get<GymLocation[]>(locationsPath),
};
