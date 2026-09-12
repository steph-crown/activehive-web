export interface MySubscriptionResponse {
  hasSubscription?: boolean;
  subscription: {
    id: string;
    gymOwnerId: string;
    trainerId: string | null;
    gymId: string;
    platformPlanId: string | null;
    plan: string | null;
    status: string;
    monthlyPrice: string | number | null;
    trialStartDate: string | null;
    trialEndDate: string | null;
    subscriptionStartDate: string | null;
    subscriptionEndDate: string | null;
    lastPaymentDate: string | null;
    nextPaymentDate: string | null;
    autoRenew: boolean;
    cancellationDate: string | null;
    cancellationReason: string | null;
    subscribedBy: string | null;
    isTrial: boolean;
    createdAt: string;
    updatedAt: string;
    gymOwner: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string | null;
      profileImage: string | null;
    };
    gym: {
      id: string;
      name: string;
      logo: string | null;
      address: {
        street: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string | null;
      } | null;
      phoneNumber: string | null;
      email: string | null;
    } | null;
    platformPlan: {
      id: string;
      name: string;
      description: string | null;
      price: string;
      billingPeriod: string;
      features: string[] | null;
      trialDays: number | null;
      maxStaff: number | null;
      maxLocations: number | null;
      maxClassesPerMonth: number | null;
      isActive: boolean;
      isDefault: boolean;
      isPopular: boolean;
    } | null;
  } | null;
  isExpired?: boolean;
  daysUntilExpiration?: number;
  isTrial?: boolean;
  daysRemaining?: number;
  isActive?: boolean;
}

export interface GymOwnerSubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billingPeriod: string;
  features: string[] | null;
  trialDays: number | null;
  isActive: boolean;
  isDefault: boolean;
  planType: string;
}

export interface GymOwnerSubscriptionPlansResponse {
  plans: GymOwnerSubscriptionPlan[];
}

export interface ChangePlanPayload {
  newPlanId: string;
  promoCode?: string;
  prorate?: boolean;
  extendEndDate?: boolean;
}

export type CancellationReason =
  | "too_expensive"
  | "not_using_enough"
  | "missing_features"
  | "switching_provider"
  | "technical_issues"
  | "poor_support"
  | "closing_business"
  | "other";

export interface CancelSubscriptionPayload {
  reason?: CancellationReason;
  note?: string;
}
