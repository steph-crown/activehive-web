import { create } from "zustand";
import type { MySubscriptionResponse } from "@/features/billing/types";

type SubscriptionStore = {
  subscription: MySubscriptionResponse | null;
  hasActiveSubscription: boolean;
  lastRedirectPath: string | null;
  setSubscription: (subscription: MySubscriptionResponse | null) => void;
  clearSubscription: () => void;
  setLastRedirectPath: (path: string | null) => void;
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: null,
  hasActiveSubscription: true,
  lastRedirectPath: null,
  setSubscription: (subscription) => {
    console.log({
      subscription,
      kaii: !!(subscription?.isActive || subscription?.isTrial),
    });
    return set({
      subscription,
      // Consider both paid subscriptions and active trials as granting access
      hasActiveSubscription: !!(
        subscription?.isActive || subscription?.isTrial
      ),
    });
  },
  clearSubscription: () =>
    set({
      subscription: null,
      hasActiveSubscription: false,
      lastRedirectPath: null,
    }),
  setLastRedirectPath: (path) =>
    set({
      lastRedirectPath: path,
    }),
}));
