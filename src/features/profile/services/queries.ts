import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./api";
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types";

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: () => [...profileQueryKeys.all, "current"] as const,
};

export const useProfileQuery = () =>
  useQuery<UserProfile>({
    queryKey: profileQueryKeys.current(),
    queryFn: () => profileApi.getProfile(),
  });

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.all,
      });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      profileApi.changePassword(payload),
  });
};
