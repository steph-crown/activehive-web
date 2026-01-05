import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi, rolesApi, permissionsApi } from "./api";
import type {
  Staff,
  CreateStaffPayload,
  Role,
  CreateRolePayload,
  Permission,
  CreatePermissionPayload,
  AssignRolePermissionsPayload,
  AssignLocationsPayload,
} from "../types";

export const staffQueryKeys = {
  all: ["staff"] as const,
  list: () => [...staffQueryKeys.all, "list"] as const,
  detail: (id: string) => [...staffQueryKeys.all, "detail", id] as const,
};

export const rolesQueryKeys = {
  all: ["roles"] as const,
  available: () => [...rolesQueryKeys.all, "available"] as const,
};

export const permissionsQueryKeys = {
  all: ["permissions"] as const,
  available: () => [...permissionsQueryKeys.all, "available"] as const,
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

export const useAssignRolePermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      payload,
    }: {
      staffId: string;
      payload: AssignRolePermissionsPayload;
    }) => staffApi.assignRolePermissions(staffId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffQueryKeys.all,
      });
    },
  });
};

export const useAssignLocationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      payload,
    }: {
      staffId: string;
      payload: AssignLocationsPayload;
    }) => staffApi.assignLocations(staffId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffQueryKeys.all,
      });
    },
  });
};

export const useAvailableRolesQuery = () =>
  useQuery<Role[]>({
    queryKey: rolesQueryKeys.available(),
    queryFn: () => rolesApi.getAvailableRoles(),
  });

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) =>
      rolesApi.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesQueryKeys.all,
      });
    },
  });
};

export const useAvailablePermissionsQuery = () =>
  useQuery<Permission[]>({
    queryKey: permissionsQueryKeys.available(),
    queryFn: () => permissionsApi.getAvailablePermissions(),
  });

export const useCreatePermissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePermissionPayload) =>
      permissionsApi.createPermission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: permissionsQueryKeys.all,
      });
    },
  });
};
