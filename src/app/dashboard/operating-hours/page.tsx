import { Navigate } from "react-router-dom";

import { useLocationStore } from "@/store/location.store";

/**
 * Legacy route: operating hours are per location. Prefer
 * `/dashboard/locations/:id/operating-hours`.
 */
export default function OperatingHoursRedirectPage() {
  const { selectedLocationId } = useLocationStore();
  if (selectedLocationId) {
    return (
      <Navigate
        to={`/dashboard/locations/${selectedLocationId}/operating-hours`}
        replace
      />
    );
  }
  return <Navigate to="/dashboard/locations" replace />;
}
