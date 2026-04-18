import { create } from "zustand";
import { useGymOwnerRegistrationStore } from "./gym-owner-registration.store";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
};

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (payload: { user: AuthUser; token: string }) => void;
  logout: () => void;
};

const persistToken = (token: string | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem("activehive_token", token);
    return;
  }

  window.localStorage.removeItem("activehive_token");
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setSession: ({ user, token }) => {
    persistToken(token);
    useGymOwnerRegistrationStore.getState().reset();

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },
  logout: () => {
    persistToken(null);
    useGymOwnerRegistrationStore.getState().reset();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
