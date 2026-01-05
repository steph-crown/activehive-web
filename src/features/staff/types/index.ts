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
  department: string;
  locationIds: string[];
  hireDate: string;
  status: "active" | "inactive";
  permissionIds: string[];
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  code: string;
  permissionIds: string[];
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateRolePayload = {
  name: string;
  description?: string;
  code: string;
  permissionIds: string[];
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
