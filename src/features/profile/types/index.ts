export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  profileImage: string | null;
  role: string;
  status: string;
  isEmailVerified: boolean;
  bio: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
