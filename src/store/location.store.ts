import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationStore = {
  selectedLocationId: string | null;
  setSelectedLocation: (locationId: string | null) => void;
  clearSelectedLocation: () => void;
};

const STORAGE_KEY = "activehive_selected_location";

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      selectedLocationId: null,
      setSelectedLocation: (locationId: string | null) => {
        set({ selectedLocationId: locationId });
      },
      clearSelectedLocation: () => {
        set({ selectedLocationId: null });
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
