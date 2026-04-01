export type CreateCheckInPayload = {
  memberId: string;
  locationId: string;
  notes?: string;
};

export type CheckInsListParams = {
  locationId?: string;
  memberId?: string;
  /** Defaults to `checked_in` when listing active check-ins. */
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

export type CheckInListLocation = {
  id: string;
  locationName: string;
};

export type CheckInListMember = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  status?: string;
  onboardingCompleted?: boolean;
};

export type CheckInListItem = {
  id: string;
  memberId: string;
  locationId: string;
  status: string;
  checkInTime: string;
  checkOutTime: string | null;
  notes: string | null;
  checkedInBy?: string | null;
  checkedOutBy?: string | null;
  member: CheckInListMember;
  location: CheckInListLocation;
};

export type CheckInsListResponse = {
  data: CheckInListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
