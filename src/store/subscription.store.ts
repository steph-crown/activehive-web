import { create } from "zustand";
import type { MySubscriptionResponse } from "@/features/billing/types";

type SubscriptionStore = {
  subscription: MySubscriptionResponse | null;
  hasActiveSubscription: boolean;
  setSubscription: (subscription: MySubscriptionResponse | null) => void;
  clearSubscription: () => void;
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: null,
  hasActiveSubscription: false,
  setSubscription: (subscription) =>
    set({
      subscription,
      hasActiveSubscription: !!subscription?.isActive,
    }),
  clearSubscription: () =>
    set({
      subscription: null,
      hasActiveSubscription: false,
    }),
}));
