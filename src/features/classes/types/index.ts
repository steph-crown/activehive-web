export type ClassSchedule = {
  id: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClassScheduleInput = {
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export type Class = {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  locationId: string | null;
  gymId: string;
  trainerId: string | null;
  createdById: string;
  isTemplate: boolean;
  isActive: boolean;
  metadata: {
    category: string;
    duration: number;
    equipment: string[];
    difficulty: string;
  };
  createdAt: string;
  updatedAt: string;
  location: {
    id: string;
    gymId: string;
    locationName: string;
    address: {
      city: string;
      state: string;
      street: string;
      country: string;
      zipCode: string;
    };
    phone: string;
    email: string;
    images: string[];
    paymentAccount: any | null;
    isHeadquarters: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  gym: {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    coverImage: string | null;
    address: {
      city: string;
      state: string;
      street: string;
      country: string;
      zipCode: string;
    };
    phoneNumber: string;
    email: string;
    website: string | null;
    operatingHours: any | null;
    amenities: any | null;
    facilities: any | null;
    ownerId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  trainer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  schedules: ClassSchedule[];
};

export type ClassTemplate = {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  schedules: ClassSchedule[];
  category: string;
  difficulty: string;
  duration: number;
  equipment: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateClassPayload = {
  name: string;
  description?: string;
  capacity: number;
  locationId?: string;
  trainerId?: string;
  schedules: ClassScheduleInput[];
  category: string;
  difficulty: string;
  duration: number;
  equipment: string[];
};

export type UpdateClassPayload = {
  name?: string;
  description?: string;
  capacity?: number;
  trainerId?: string;
  schedules?: ClassScheduleInput[];
  category?: string;
  difficulty?: string;
  duration?: number;
  equipment?: string[];
  isActive?: boolean;
};

export type CreateTemplatePayload = {
  name: string;
  description?: string;
  capacity: number;
  schedules: ClassScheduleInput[];
  category: string;
  difficulty: string;
  duration: number;
  equipment: string[];
};

export type UseTemplatePayload = {
  templateClassId: string;
  locationId: string;
  trainerId?: string;
  schedules: ClassScheduleInput[];
};

export type AssignTrainerPayload = {
  trainerId: string;
};

export type ReuseClassPayload = {
  locationIds: string[];
};

export type ClassReport = {
  totalSessions: number;
  totalBookings: number;
  totalAttendance: number;
  averageAttendance: number;
  revenue: number;
  // Add more fields as needed based on actual API response
};

/** POST `/api/gym-owner/class-attendance/{classScheduleId}/attendance` */
export type AddClassAttendancePayload = {
  memberIds: string[];
  notes?: string;
};

/** GET `/api/gym-owner/class-attendance` query */
export type ClassAttendanceListQuery = {
  page?: number;
  limit?: number;
  locationId?: string;
  classId?: string;
  memberId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
};

/** GET `/api/gym-owner/class-attendance/{classScheduleId}/attendance` query */
export type ScheduleAttendanceQuery = {
  page?: number;
  limit?: number;
  /** Single session day (legacy / full-page filter). */
  date?: string;
  /** Optional range; used by class detail attendance tab when a session is selected. */
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  hasCheckedIn?: boolean;
  memberSearch?: string;
};

/** Normalized row for the attendance table (both list + schedule endpoints). */
export type ClassAttendanceTableRow = {
  id: string;
  className: string;
  member: string;
  date: string;
  status: string;
  location: string;
  checkedIn?: string;
};

export type ClassAttendancePaginated = {
  rows: ClassAttendanceTableRow[];
  total: number;
  totalPages: number;
};
