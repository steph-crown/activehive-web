import { useEffect, useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MemberSearchDropdown } from "@/components/molecules/member-search-dropdown";
import { useLocationsQuery } from "@/features/locations/services";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useLocationStore } from "@/store";
import { useCreateCheckInMutation } from "../services";

type QuickCheckInDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuickCheckInDialog({
  open,
  onOpenChange,
}: Readonly<QuickCheckInDialogProps>) {
  const { showSuccess, showError } = useToast();
  const { selectedLocationId } = useLocationStore();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { mutateAsync: createCheckIn, isPending } = useCreateCheckInMutation();

  const [memberId, setMemberId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setMemberId("");
    setNotes("");
    const nextLocation =
      selectedLocationId ??
      locations?.[0]?.id ??
      "";
    setLocationId(nextLocation);
  }, [open, selectedLocationId, locations]);

  const handleSubmit = async () => {
    if (!memberId.trim()) {
      showError("Missing member", "Select a member to check in.");
      return;
    }
    if (!locationId.trim()) {
      showError("Missing location", "Select a location.");
      return;
    }
    try {
      await createCheckIn({
        memberId: memberId.trim(),
        locationId: locationId.trim(),
        ...(notes.trim() && { notes: notes.trim() }),
      });
      showSuccess("Check-in recorded", "The member has been checked in.");
      onOpenChange(false);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Failed to create check-in.",
      );
      showError("Check-in failed", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#F4F4F4]">
        <DialogHeader>
          <DialogTitle className="text-3xl uppercase">
            Quick Check-In
          </DialogTitle>

          <DialogDescription>
            Search member and record an attendance check-in.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="quick-checkin-member">
              Member *
            </label>
            <MemberSearchDropdown
              value={memberId}
              onValueChange={setMemberId}
              placeholder="Search member…"
            />
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-medium">Check-in method</span>
            <Select value="manual" disabled>
              <SelectTrigger className="w-full" disabled aria-readonly>
                <SelectValue>Manual</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="quick-checkin-location">
              Location *
            </label>
            <Select
              value={locationId || undefined}
              onValueChange={setLocationId}
              disabled={locationsLoading}
            >
              <SelectTrigger id="quick-checkin-location" className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {(locations ?? []).map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="quick-checkin-notes">
              Notes (optional)
            </label>
            <Textarea
              id="quick-checkin-notes"
              rows={2}
              placeholder="e.g. Member arrived early for class"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-3 text-sm text-muted-foreground">
            <IconAlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Members with incomplete profiles will receive a warning during
              check-in.
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isPending}>
            Check In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
