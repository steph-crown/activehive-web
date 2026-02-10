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
  hasActiveSubscription: false,
  lastRedirectPath: null,
  setSubscription: (subscription) =>
    set({
      subscription,
      hasActiveSubscription: !!subscription?.isActive,
    }),
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
