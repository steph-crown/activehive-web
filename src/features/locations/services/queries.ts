import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "./api";
import type { GymLocation } from "../types";

export const locationsQueryKeys = {
  all: ["locations"] as const,
  list: () => [...locationsQueryKeys.all, "list"] as const,
};

export const useLocationsQuery = () =>
  useQuery<GymLocation[]>({
    queryKey: locationsQueryKeys.list(),
    queryFn: () => locationsApi.getLocations(),
  });
