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
