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

/** GET /api/gym-owner/members/{memberId} — superset of list fields; extras are optional until the API returns them. */
export type MemberTrainerRef = {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
};

export type GymMemberDetailMember = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  fullNameOverride?: string;
  address?: string;
};

export type MemberEmergencyContact = {
  name?: string;
  relationship?: string;
  phone?: string;
};

export type MemberHealthInfo = {
  medicalConditions?: string;
  injuries?: string;
  allergies?: string;
};

export type MemberComplianceInfo = {
  termsAcceptedAt?: string;
  privacyAcceptedAt?: string;
  liabilityWaiver?: string;
  mediaConsent?: string;
};

export type MemberActivityLogEntry = {
  id: string;
  title: string;
  category: string;
  actor: string;
  date: string;
};

export type MemberAttendanceEntry = {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  processedBy: string;
  branch: string;
};

/** Embedded check-in on GET /api/gym-owner/members/:id (raw `checkIns`). */
export type GymMemberCheckInApi = {
  id: string;
  locationId?: string;
  location?: { id: string; locationName: string };
  gymId?: string;
  status?: string;
  checkInTime?: string;
  checkedInBy?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};

/** Derived attendance rows on GET /api/gym-owner/members/:id — use for Attendance tab. */
export type GymMemberAttendanceApi = {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string | null;
  processedBy?: { name: string; id: string };
  branch?: string;
};

export type MemberPaymentEntry = {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: string;
  invoiceRef?: string;
};

export type MemberDocumentEntry = {
  id: string;
  label: string;
  uploaded: boolean;
  url?: string;
};

export type GymMemberDetail = {
  id: string;
  memberId: string;
  member: GymMemberDetailMember;
  gymId: string;
  gym?: { id: string; name: string };
  membershipPlanId: string;
  membershipPlan: {
    id: string;
    name: string;
    price?: number;
    duration?: string;
  };
  location: { id: string; locationName: string };
  trainer?: MemberTrainerRef | null;
  assignedTrainerName?: string;
  membershipIdDisplay?: string;
  preferredWorkoutTime?: string;
  type: string;
  /** Membership row status (e.g. active on the subscription). */
  status: string;
  /** User account status from the member root (e.g. pending). */
  memberAccountStatus?: string;
  price?: number;
  startDate: string;
  endDate: string;
  memberSince?: string;
  createdAt: string;
  updatedAt: string;
  daysRemaining?: number;
  isExpiringSoon?: boolean;
  emergencyContact?: MemberEmergencyContact;
  health?: MemberHealthInfo;
  fitnessGoals?: string[];
  compliance?: MemberComplianceInfo;
  activityLog?: MemberActivityLogEntry[];
  attendance?: MemberAttendanceEntry[];
  payments?: MemberPaymentEntry[];
  documents?: MemberDocumentEntry[];
};

/** Raw JSON from GET /api/gym-owner/members/{id} */
export type GymMemberMembershipPlanApi = {
  id: string;
  name: string;
  locationId?: string;
  location?: { id: string; locationName: string };
  price?: number;
  duration?: string;
};

export type GymMemberMembershipApi = {
  id: string;
  membershipPlanId: string;
  membershipPlan: GymMemberMembershipPlanApi;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  price?: number;
};

export type GymMemberDetailApiResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  fullNameOverride?: string;
  address?: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  memberships: GymMemberMembershipApi[];
  /** Raw visit records; prefer `attendance` for the Attendance tab when present. */
  checkIns?: GymMemberCheckInApi[];
  attendance?: GymMemberAttendanceApi[];
  trainer?: MemberTrainerRef | null;
  assignedTrainerName?: string;
  preferredWorkoutTime?: string;
  emergencyContact?: MemberEmergencyContact;
  health?: MemberHealthInfo;
  fitnessGoals?: string[];
  compliance?: MemberComplianceInfo;
  activityLog?: MemberActivityLogEntry[];
  payments?: MemberPaymentEntry[];
  documents?: MemberDocumentEntry[];
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
