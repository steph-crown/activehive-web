import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type RegistrationStepStatus = "pending" | "completed" | "skipped";

/** localStorage key for persisted registration draft (sessionId, email, password, step progress). */
export const GYM_OWNER_REGISTRATION_STORAGE_KEY =
  "activehive:gym-owner-registration";

const createDefaultStatuses = (): Record<number, RegistrationStepStatus> => ({
  1: "pending",
  2: "pending",
  3: "pending",
  4: "pending",
  5: "pending",
  6: "pending",
});

type GymOwnerRegistrationStore = {
  sessionId: string | null;
  email: string | null;
  password: string | null;
  stepStatuses: Record<number, RegistrationStepStatus>;
  setSession: (payload: { sessionId: string; email: string; password: string }) => void;
  setStepStatus: (
    step: number,
    status: RegistrationStepStatus
  ) => void;
  reset: () => void;
};

export const useGymOwnerRegistrationStore =
  create<GymOwnerRegistrationStore>()(
    persist(
      (set) => ({
        sessionId: null,
        email: null,
        password: null,
        stepStatuses: createDefaultStatuses(),
        setSession: ({ sessionId, email, password }) =>
          set({
            sessionId,
            email,
            password,
            stepStatuses: { ...createDefaultStatuses(), 1: "completed" },
          }),
        setStepStatus: (step, status) =>
          set((state) => ({
            stepStatuses: {
              ...state.stepStatuses,
              [step]: status,
            },
          })),
        reset: () =>
          set({
            sessionId: null,
            email: null,
            password: null,
            stepStatuses: createDefaultStatuses(),
          }),
      }),
      {
        name: GYM_OWNER_REGISTRATION_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          sessionId: state.sessionId,
          email: state.email,
          password: state.password,
          stepStatuses: state.stepStatuses,
        }),
      },
    ),
  );
