export type Member = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  role: string;
  status: "pending" | "active" | "inactive";
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Membership = {
  id: string;
  memberId: string;
  gymId: string;
  membershipPlanId: string;
  type: string;
  price: string;
  startDate: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MemberSubscription = {
  id: string;
  memberId: string;
  member: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
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
  status: string;
  price: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
};

export type CreateMemberResponse = {
  member: Member;
  membership: Membership;
};

export type CreateMemberPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  membershipPlanId: string;
  locationId?: string;
  startDate?: string;
  promoCode?: string;
};
