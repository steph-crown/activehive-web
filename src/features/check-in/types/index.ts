export type CreateCheckInPayload = {
  memberId: string;
  locationId: string;
  notes?: string;
};

export type CheckInsListParams = {
  locationId?: string;
  memberId?: string;
  /**
   * When true, omit `status` from the request so the API can return any status
   * (e.g. to read nested `gym` from the latest check-in row).
   */
  skipStatusFilter?: boolean;
  /** Defaults to `checked_in` when {@link skipStatusFilter} is not set. */
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

/** Nested gym on check-in list items when returned by the API. */
export type CheckInListGym = {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  address?: {
    city?: string;
    state?: string;
    street?: string;
    country?: string;
    zipCode?: string;
  } | null;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
};

export type CheckInListItem = {
  id: string;
  memberId: string;
  locationId: string;
  status: string;
  checkInTime: string;
  checkOutTime: string | null;
  notes: string | null;
  checkedInBy?: { id: string; name: string };
  checkedOutBy?: string | null;
  /** API may omit nested member until hydrated. */
  member: CheckInListMember | null;
  /** API may omit nested location until hydrated. */
  location: CheckInListLocation | null;
  gym?: CheckInListGym | null;
};

export type CheckInsListResponse = {
  data: CheckInListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CheckInsStatsParams = {
  locationId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type CheckInsByLocationStat = {
  locationId: string;
  locationName: string;
  count: number;
};

export type CheckInsByDateStat = {
  date: string;
  count: number;
};

export type CheckInsStatsResponse = {
  todayCheckIns: number;
  totalCheckIns: number;
  totalCheckOuts: number;
  activeCheckIns: number;
  checkInsByLocation: CheckInsByLocationStat[];
  checkInsByDate: CheckInsByDateStat[];
};
