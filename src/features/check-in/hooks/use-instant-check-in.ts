import { useCallback, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

import { useCreateCheckInMutation } from "../services/mutations";

export type InstantCheckInParams = {
  memberId: string;
  locationId: string;
  /** Stable id for the table row (e.g. subscription id) — drives loading UI. */
  rowId: string;
};

/**
 * Calls the same check-in API as Quick Check-In, with per-row loading state
 * for inline actions (e.g. members table QR).
 */
export function useInstantCheckIn() {
  const { mutateAsync } = useCreateCheckInMutation();
  const { showSuccess, showError } = useToast();
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);

  const executeCheckIn = useCallback(
    async (params: InstantCheckInParams) => {
      setLoadingRowId(params.rowId);
      try {
        await mutateAsync({
          memberId: params.memberId.trim(),
          locationId: params.locationId.trim(),
        });
        showSuccess("Check-in recorded", "The member has been checked in.");
      } catch (error) {
        showError(
          "Check-in failed",
          getApiErrorMessage(error, "Failed to create check-in."),
        );
      } finally {
        setLoadingRowId(null);
      }
    },
    [mutateAsync, showError, showSuccess],
  );

  return { executeCheckIn, loadingRowId };
}
