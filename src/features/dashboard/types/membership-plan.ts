export type MembershipPlan = {
  id: string;
  gymOwnerId: string;
  gymId: string;
  locationId: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  isActive: boolean;
  imageUrl: string | null;
  gracePeriodDays: number;
  hasTrialPeriod: boolean;
  trialPeriodDays: number | null;
  classesPerWeek: number | null;
  location: {
    id: string;
    locationName: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  gym: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateMembershipPlanPayload = {
  locationId: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  isActive: boolean;
  imageUrl?: string;
  gracePeriodDays: number;
  hasTrialPeriod: boolean;
  trialPeriodDays?: number | null;
  classesPerWeek?: number | null;
};

export type GymLocation = {
  id: string;
  locationName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  images: string[];
  isHeadquarters: boolean;
  isActive: boolean;
  paymentAccount: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountType: string;
  };
  createdAt: string;
  updatedAt: string;
  metrics: {
    totalMembers: number;
    activeMembers: number;
    totalTrainers: number;
    activeTrainers: number;
    monthlyRevenue: number;
    todaysCheckIns: number;
  };
};
