import { apiClient } from "@/lib/api-client";
import type {
  CheckInsListParams,
  CheckInsListResponse,
  CheckInsStatsParams,
  CheckInsStatsResponse,
  CheckInQrResponse,
  CreateCheckInPayload,
} from "../types";

const checkInsPath = "/api/check-ins";
const locationsPath = "/api/gym-owner/locations";

function statsQueryParams(
  params: CheckInsStatsParams,
): Record<string, string> {
  const query: Record<string, string> = {};
  if (params.locationId) query.locationId = params.locationId;
  if (params.dateFrom) query.dateFrom = params.dateFrom;
  if (params.dateTo) query.dateTo = params.dateTo;
  return query;
}

function listQueryParams(params: CheckInsListParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (params.locationId) query.locationId = params.locationId;
  if (params.memberId) query.memberId = params.memberId;
  if (!params.skipStatusFilter) {
    query.status = params.status ?? "checked_in";
  }
  if (params.dateFrom) query.dateFrom = params.dateFrom;
  if (params.dateTo) query.dateTo = params.dateTo;
  if (params.search) query.search = params.search;
  query.page = String(params.page ?? 1);
  query.limit = String(params.limit ?? 20);
  query.sortBy = params.sortBy ?? "checkInTime";
  query.sortOrder = params.sortOrder ?? "DESC";
  return query;
}

export const checkInsApi = {
  getCheckInQr: (locationId: string): Promise<CheckInQrResponse> =>
    apiClient.get<CheckInQrResponse>(`${locationsPath}/${locationId}/check-in-qr`),

  create: (payload: CreateCheckInPayload): Promise<unknown> =>
    apiClient.post<unknown>(checkInsPath, payload),

  list: (params: CheckInsListParams = {}): Promise<CheckInsListResponse> =>
    apiClient.get<CheckInsListResponse>(checkInsPath, {
      params: listQueryParams(params),
    }),

  stats: (params: CheckInsStatsParams = {}): Promise<CheckInsStatsResponse> =>
    apiClient.get<CheckInsStatsResponse>(`${checkInsPath}/stats`, {
      params: statsQueryParams(params),
    }),
};
