import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { checkInsApi } from "./api";
import type {
  CheckInsListParams,
  CheckInsListResponse,
  CheckInsStatsParams,
  CheckInsStatsResponse,
  CheckInQrResponse,
} from "../types";

export const checkInQrQueryKeys = {
  all: ["check-in-qr"] as const,
  byLocation: (locationId: string) =>
    [...checkInQrQueryKeys.all, locationId] as const,
};

export function useCheckInQrQuery(locationId: string | null) {
  return useQuery<CheckInQrResponse>({
    queryKey: checkInQrQueryKeys.byLocation(locationId ?? ""),
    queryFn: () => checkInsApi.getCheckInQr(locationId!),
    enabled: Boolean(locationId),
    staleTime: Infinity,
  });
}

export const checkInsQueryKeys = {
  all: ["check-ins"] as const,
  stats: (params: CheckInsStatsParams) =>
    [
      ...checkInsQueryKeys.all,
      "stats",
      params.locationId ?? "",
      params.dateFrom ?? "",
      params.dateTo ?? "",
    ] as const,
  list: (params: CheckInsListParams) =>
    [
      ...checkInsQueryKeys.all,
      "list",
      params.locationId ?? "",
      params.memberId ?? "",
      params.skipStatusFilter ? "__all_status__" : (params.status ?? "checked_in"),
      params.dateFrom ?? "",
      params.dateTo ?? "",
      params.search ?? "",
      params.page ?? 1,
      params.limit ?? 20,
      params.sortBy ?? "checkInTime",
      params.sortOrder ?? "DESC",
    ] as const,
};

export function useCheckInsQuery(params: CheckInsListParams) {
  return useQuery<CheckInsListResponse>({
    queryKey: checkInsQueryKeys.list(params),
    queryFn: () => checkInsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCheckInsStatsQuery(params: CheckInsStatsParams = {}) {
  return useQuery<CheckInsStatsResponse>({
    queryKey: checkInsQueryKeys.stats(params),
    queryFn: () => checkInsApi.stats(params),
  });
}
