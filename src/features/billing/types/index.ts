export interface MySubscriptionResponse {
  subscription: {
    id: string;
    gymOwnerId: string;
    trainerId: string | null;
    gymId: string;
    platformPlanId: string | null;
    plan: string;
    status: string;
    monthlyPrice: number | null;
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
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      phoneNumber: string;
      email: string;
    };
  };
  isTrial: boolean;
  daysRemaining: number;
  isActive: boolean;
}

export interface GymOwnerSubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billingPeriod: string;
  features: string[];
  trialDays: number;
  isActive: boolean;
  isDefault: boolean;
  planType: string;
}

export interface GymOwnerSubscriptionPlansResponse {
  plans: GymOwnerSubscriptionPlan[];
}

export interface SwitchPlanPayload {
  subscriptionId: string;
  newPlanId: string;
  reason?: string;
}
