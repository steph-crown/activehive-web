export type Subscription = {
  id: string;
  memberId: string;
  member: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  gymId: string;
  gym: {
    id: string;
    name: string;
  };
  membershipPlanId: string;
  membershipPlan: {
    id: string;
    name: string;
    price: number;
    duration: string;
  };
  location: {
    id: string;
    locationName: string;
  };
  type: string;
  status: "active" | "inactive" | "cancelled" | "expired";
  price: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
};

export type SubscriptionsResponse = {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
