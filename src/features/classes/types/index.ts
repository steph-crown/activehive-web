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
