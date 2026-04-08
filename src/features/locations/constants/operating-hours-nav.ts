/** Passed via `navigate(..., { state })` when opening operating hours so the back button matches entry. */
export type OperatingHoursLocationState = {
  operatingHoursFrom?: "locations" | "location-detail";
};
