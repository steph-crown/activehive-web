export type PlatformPlan = {
  id: string;
  name: string;
  description: string | null;
  planType: "gym_owner" | "trainer";
  price: number | string;
  billingPeriod: string;
  features: string[] | null;
  trialDays: number | null;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number | null;
};

export type PlatformSubscription = {
  id: string;
  status: "trial" | "active" | "expired" | "cancelled" | "suspended";
  gymOwnerId: string | null;
  trainerId: string | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  platformPlan: PlatformPlan | null;
};
