export type Subscription = {
  id: string;
  gymOwnerId: string;
  gymId: string;
  planName: string;
  status: "active" | "inactive" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  currency: string;
  nextBillingDate?: string;
  createdAt: string;
  updatedAt: string;
};
