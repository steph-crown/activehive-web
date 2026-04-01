import { apiClient } from "@/lib/api-client";
import type { CreateCheckInPayload } from "../types";

const checkInsPath = "/api/check-ins";

export const checkInsApi = {
  create: (payload: CreateCheckInPayload): Promise<unknown> =>
    apiClient.post<unknown>(checkInsPath, payload),
};
