import { useQuery } from "@tanstack/react-query";
import { trainersApi } from "./api";
import type { TrainerListItem, TrainersListParams } from "../types";

export const trainersQueryKeys = {
  all: ["trainers"] as const,
  list: (params: TrainersListParams) =>
    [...trainersQueryKeys.all, "list", params.locationId ?? "all"] as const,
};

export function useTrainersQuery(params: TrainersListParams = {}) {
  return useQuery<TrainerListItem[]>({
    queryKey: trainersQueryKeys.list(params),
    queryFn: () => trainersApi.list(params),
  });
}
