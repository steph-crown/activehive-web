import { apiClient } from "@/lib/api-client";
import type {
  Staff,
  CreateStaffPayload,
  Role,
  CreateRolePayload,
  Permission,
  CreatePermissionPayload,
  AssignStaffRolePayload,
  AssignLocationsPayload,
} from "../types";

const staffPath = "/api/gym-owner/staff";
const rolesPath = "/api/gym-owner/staff/roles";
const permissionsPath = "/api/gym-owner/staff/permissions";

export const staffApi = {
  getStaff: (): Promise<Staff[]> =>
    apiClient.get<Staff[]>(staffPath),
  createStaff: (payload: CreateStaffPayload): Promise<Staff> =>
    apiClient.post<Staff>(staffPath, payload),
  assignStaffRole: (
    staffId: string,
    payload: AssignStaffRolePayload,
  ): Promise<Staff> =>
    apiClient.patch<Staff>(`${staffPath}/${staffId}/role`, payload),
  assignLocations: (
    staffId: string,
    payload: AssignLocationsPayload
  ): Promise<Staff> =>
    apiClient.patch<Staff>(`${staffPath}/${staffId}/locations`, payload),
};

export const rolesApi = {
  getAvailableRoles: (): Promise<Role[]> =>
    apiClient.get<Role[]>(`${rolesPath}/available`),
  createRole: (payload: CreateRolePayload): Promise<Role> =>
    apiClient.post<Role>(rolesPath, payload),
};

export const permissionsApi = {
  getAvailablePermissions: (): Promise<Permission[]> =>
    apiClient.get<Permission[]>(`${permissionsPath}/available`),
  createPermission: (payload: CreatePermissionPayload): Promise<Permission> =>
    apiClient.post<Permission>(permissionsPath, payload),
};
