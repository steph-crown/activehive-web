export type MembershipPlan = {
  id: string;
  gymOwnerId: string;
  gymId: string;
  locationId: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  isActive: boolean;
  imageUrl: string | null;
  gracePeriodDays: number;
  hasTrialPeriod: boolean;
  trialPeriodDays: number | null;
  classesPerWeek: number | null;
  location: {
    id: string;
    locationName: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  gym: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateMembershipPlanPayload = {
  locationId: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  isActive: boolean;
  imageUrl?: string;
  gracePeriodDays: number;
  hasTrialPeriod: boolean;
  trialPeriodDays?: number | null;
  classesPerWeek?: number | null;
};

export type UpdateMembershipPlanPayload = {
  name?: string;
  description?: string;
  price?: number;
  duration?: string;
  features?: string[];
  isActive?: boolean;
  imageUrl?: string;
  gracePeriodDays?: number;
  hasTrialPeriod?: boolean;
  trialPeriodDays?: number | null;
  classesPerWeek?: number | null;
};

export type DuplicateMembershipPlanPayload = {
  locationId: string;
};

export type PromoCode = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validUntil: string;
  maxUses?: number;
  currentUses?: number;
  isActive: boolean;
};

export type AddPromoCodePayload = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validUntil: string;
  maxUses?: number;
  isActive?: boolean;
};

export type TogglePromoCodePayload = {
  isActive: boolean;
};

export type MembershipPlanWithPromoCodes = MembershipPlan & {
  promoCodes?: PromoCode[];
};
