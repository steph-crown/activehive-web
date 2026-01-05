export type ClassSchedule = {
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export type Class = {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  locationId?: string;
  location?: {
    id: string;
    locationName: string;
  };
  trainerId?: string;
  trainer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  schedules: ClassSchedule[];
  category: string;
  difficulty: string;
  duration: number;
  equipment: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  schedules: ClassSchedule[];
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
  schedules?: ClassSchedule[];
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
  schedules: ClassSchedule[];
  category: string;
  difficulty: string;
  duration: number;
  equipment: string[];
};

export type UseTemplatePayload = {
  templateClassId: string;
  locationId: string;
  trainerId?: string;
  schedules: ClassSchedule[];
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
