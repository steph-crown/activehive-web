export type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  role?: {
    id: string;
    name: string;
  };
  department: string;
  locationIds: string[];
  locations?: Array<{
    id: string;
    locationName: string;
  }>;
  hireDate: string;
  status: "active" | "inactive" | "terminated";
  permissionIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  locationIds: string[];
  hireDate: string;
  status: "active" | "inactive";
  permissionIds: string[];
};

/** Permission object as returned on role `GET .../roles/available`. */
export type RolePermissionDetail = {
  id: string;
  name: string;
  description?: string | null;
  code: string;
  type?: string;
  createdById?: string | null;
  gymId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Role = {
  id: string;
  name: string;
  description?: string | null;
  code: string;
  /** Present on some API responses; prefer `permissions` when populated. */
  permissionIds?: string[];
  permissions?: RolePermissionDetail[];
  isSystem?: boolean;
  type?: string;
  createdById?: string | null;
  gymId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/** POST `/api/gym-owner/staff/roles` */
export type CreateRolePayload = {
  name: string;
  description: string;
  permissionCodes: string[];
};

export type Permission = {
  id: string;
  name: string;
  description?: string;
  code: string;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePermissionPayload = {
  name: string;
  description?: string;
  code: string;
};

export type AssignRolePermissionsPayload = {
  roleId?: string;
  permissionIds: string[];
};

export type AssignLocationsPayload = {
  locationIds: string[];
};
