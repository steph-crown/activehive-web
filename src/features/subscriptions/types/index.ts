export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  PENDING: "pending",
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const SUBSCRIPTION_TYPE = {
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
  LIFETIME: "lifetime",
} as const;

export type SubscriptionType =
  (typeof SUBSCRIPTION_TYPE)[keyof typeof SUBSCRIPTION_TYPE];

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
  type: SubscriptionType | string;
  status: SubscriptionStatus;
  price: number;
  startDate: string;
  endDate: string;
  autoRenew?: boolean;
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

export type SubscriptionsFilters = {
  status?: SubscriptionStatus;
  membershipPlanId?: string;
  memberId?: string;
  locationId?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  page?: number;
  limit?: number;
};

export type SubscriptionStatistics = {
  total: number;
  active: number;
  expired: number;
  cancelled: number;
  pending: number;
  expiringSoon: number;
  totalRevenue: number;
  monthlyRevenue: number;
};

export type UpdateSubscriptionStatusPayload = {
  status: SubscriptionStatus;
  reason?: string;
  endDate?: string;
};

export type CancelSubscriptionPayload = {
  reason?: string;
};

export type ChangeSubscriptionPlanPayload = {
  newPlanId: string;
  prorate?: boolean;
  extendEndDate?: boolean;
};
