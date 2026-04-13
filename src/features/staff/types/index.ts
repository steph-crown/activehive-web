/** Permission object as returned on role `GET .../roles/available` and staff list. */
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

/** User profile as nested on `GET /staff` list item. */
export type StaffListUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role?: string;
  status?: string;
  gymId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type StaffListLocation = {
  id: string;
  gymId?: string;
  locationName: string;
  isHeadquarters?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type StaffListGym = {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
};

export type Staff = {
  id: string;
  userId?: string;
  gymId?: string;
  roleId: string;
  department: string;
  hireDate: string;
  status: "active" | "inactive" | "terminated" | string;
  createdAt: string;
  updatedAt: string;
  user?: StaffListUser;
  gym?: StaffListGym;
  locations?: StaffListLocation[];
  role?: Role;
  permissions?: RolePermissionDetail[];
  /** Legacy / alternate shape when `locations` is omitted */
  locationIds?: string[];
  permissionIds?: string[];
  /** Legacy flat profile fields */
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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
  permissionCodes: string[];
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

/** PATCH `/api/gym-owner/staff/{id}/role` */
export type AssignStaffRolePayload = {
  roleId: string;
};

export type AssignLocationsPayload = {
  locationIds: string[];
};
