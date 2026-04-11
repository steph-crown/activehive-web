/** Row from GET /api/trainers */
export type TrainerListLocation = {
  id: string;
  locationName: string;
};

export type TrainerListItem = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  status: string;
  specialties?: string[];
  specialization?: string | null;
  bio?: string | null;
  createdAt: string;
  trainerLocations?: TrainerListLocation[];
};

export type TrainersListParams = {
  locationId?: string;
};

/** GET /api/admin/specialties/active */
export type TrainerSpecialty = {
  id: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
};

export type CreateTrainerPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  /** Specialty IDs from `GET /api/admin/specialties/active` (API field `specialties`). */
  specialties: string[];
  bio: string;
  locationIds: string[];
  profileImage?: string;
};

/** POST /api/trainers/assignments */
export type AssignTrainerToMemberPayload = {
  trainerId: string;
  memberId: string;
  locationId: string;
  notes?: string;
};

/** Nested profiles on GET /api/trainers/assignments (may be null until populated). */
export type TrainerAssignmentMemberProfile = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
} | null;

export type TrainerAssignmentTrainerProfile = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
} | null;

export type TrainerAssignmentLocationProfile = {
  id?: string;
  locationName?: string;
} | null;

/** Row from GET /api/trainers/assignments */
export type TrainerAssignment = {
  id: string;
  trainerId: string;
  memberId: string;
  locationId: string;
  assignedBy: string;
  notes: string | null;
  isActive: boolean;
  assignedAt: string;
  unassignedAt: string | null;
  createdAt: string;
  updatedAt: string;
  trainer: TrainerAssignmentTrainerProfile;
  member: TrainerAssignmentMemberProfile;
  location: TrainerAssignmentLocationProfile;
};

export type TrainerAssignmentsListParams = {
  locationId?: string;
  trainerId?: string;
  memberId?: string;
};
