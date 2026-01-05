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

export type LocationDetailsResponse = {
  location: {
    id: string;
    locationName: string;
    email: string;
    phone: string;
    address: {
      city: string;
      state: string;
      street: string;
      country: string;
      zipCode: string;
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
    fullAddress: string;
  };
  metrics: {
    totalMembers: number;
    activeMembers: number;
    totalTrainers: number;
    activeTrainers: number;
    totalClasses: number;
    activeClasses: number;
    monthlyRevenue: number;
    todaysCheckIns: number;
    averageAttendance: number;
    subscriptionPlan: string;
  };
};

export type PaymentAccount = {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: "checking" | "savings";
};

export type CreateLocationPayload = {
  locationName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
  paymentAccount: PaymentAccount;
};

export type Facility = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  locationId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateFacilityPayload = {
  name: string;
  description?: string;
  image?: File;
};

export type UpdateFacilityPayload = {
  name?: string;
  description?: string;
  image?: File;
};
