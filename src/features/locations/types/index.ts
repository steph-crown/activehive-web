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
