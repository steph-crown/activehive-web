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
