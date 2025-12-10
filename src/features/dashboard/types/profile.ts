export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  profileImage: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  bio: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};
