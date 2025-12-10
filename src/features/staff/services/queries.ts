import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "./api";
import type { Staff, CreateStaffPayload } from "../types";

export const staffQueryKeys = {
  all: ["staff"] as const,
  list: () => [...staffQueryKeys.all, "list"] as const,
};

export const useStaffQuery = () =>
  useQuery<Staff[]>({
    queryKey: staffQueryKeys.list(),
    queryFn: () => staffApi.getStaff(),
  });

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffPayload) =>
      staffApi.createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffQueryKeys.all,
      });
    },
  });
};
