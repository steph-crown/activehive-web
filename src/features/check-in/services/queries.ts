import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { checkInsApi } from "./api";
import type { CheckInsListParams, CheckInsListResponse } from "../types";

export const checkInsQueryKeys = {
  all: ["check-ins"] as const,
  list: (params: CheckInsListParams) =>
    [
      ...checkInsQueryKeys.all,
      "list",
      params.locationId ?? "",
      params.memberId ?? "",
      params.status ?? "checked_in",
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
