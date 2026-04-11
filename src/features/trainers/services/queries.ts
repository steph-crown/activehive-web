import { useQuery } from "@tanstack/react-query";
import { trainerSpecialtiesApi, trainersApi } from "./api";
import type {
  TrainerAssignment,
  TrainerAssignmentsListParams,
  TrainerListItem,
  TrainersListParams,
} from "../types";

export const trainerSpecialtiesQueryKeys = {
  active: ["trainer-specialties", "active"] as const,
};

export function useActiveTrainerSpecialtiesQuery() {
  return useQuery({
    queryKey: trainerSpecialtiesQueryKeys.active,
    queryFn: () => trainerSpecialtiesApi.getActive(),
    staleTime: 1000 * 60 * 30,
  });
}

export const trainersQueryKeys = {
  all: ["trainers"] as const,
  list: (params: TrainersListParams) =>
    [...trainersQueryKeys.all, "list", params.locationId ?? "all"] as const,
  assignments: (params: TrainerAssignmentsListParams) =>
    [
      ...trainersQueryKeys.all,
      "assignments",
      params.locationId ?? "all",
      params.trainerId ?? "all",
      params.memberId ?? "all",
    ] as const,
};

export function useTrainersQuery(
  params: TrainersListParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery<TrainerListItem[]>({
    queryKey: trainersQueryKeys.list(params),
    queryFn: () => trainersApi.list(params),
    enabled: options?.enabled ?? true,
  });
}

export function useTrainerAssignmentsQuery(
  params: TrainerAssignmentsListParams = {},
) {
  return useQuery<TrainerAssignment[]>({
    queryKey: trainersQueryKeys.assignments(params),
    queryFn: () => trainersApi.listAssignments(params),
  });
}
