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

export type CreateTrainerPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  /** API field name for specializations. */
  specialties: string[];
  bio: string;
  locationIds: string[];
  profileImage?: string;
};
