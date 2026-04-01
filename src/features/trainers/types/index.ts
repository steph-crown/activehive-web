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
