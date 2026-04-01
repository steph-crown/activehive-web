import { DataTable } from "@/components/molecules/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useMembersQuery } from "@/features/members/services";
import type { MemberSubscription } from "@/features/members/types";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  useAssignTrainerToMemberMutation,
  useTrainersQuery,
} from "../services";
import type { TrainerListItem } from "../types";

type AssignmentRow = {
  id: string;
  memberName: string;
  trainerName: string;
  plan: string;
  since: string;
};

function memberDisplayName(m: MemberSubscription): string {
  const name =
    `${m.member.firstName} ${m.member.lastName}`.trim() || m.member.email;
  return name;
}

function trainerDisplayName(t: TrainerListItem): string {
  const name = `${t.firstName} ${t.lastName}`.trim();
  return name || t.email;
}

function uniqueMembersByMemberId(rows: MemberSubscription[]): MemberSubscription[] {
  const map = new Map<string, MemberSubscription>();
  for (const row of rows) {
    if (!map.has(row.memberId)) map.set(row.memberId, row);
  }
  return [...map.values()];
}

export function TrainerAssignmentsPage() {
  const { showSuccess, showError } = useToast();
  const { data: locations = [], isLoading: locationsLoading } = useLocationsQuery();
  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [locationId, setLocationId] = React.useState("");
  const [memberId, setMemberId] = React.useState("");
  const [trainerId, setTrainerId] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const { mutateAsync: assignTrainer, isPending: isAssigning } =
    useAssignTrainerToMemberMutation();

  const { data: members = [], isLoading: membersLoading } = useMembersQuery(
    locationId || undefined,
    { enabled: Boolean(locationId) },
  );

  const { data: trainers = [], isLoading: trainersLoading } = useTrainersQuery(
    locationId ? { locationId } : {},
    { enabled: Boolean(locationId) },
  );

  const memberOptions = React.useMemo(
    () => uniqueMembersByMemberId(members),
    [members],
  );

  React.useEffect(() => {
    if (isAssignOpen) {
      setLocationId("");
      setMemberId("");
      setTrainerId("");
      setNotes("");
    }
  }, [isAssignOpen]);

  React.useEffect(() => {
    setMemberId("");
    setTrainerId("");
  }, [locationId]);

  const handleAssign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!locationId || !memberId || !trainerId) {
      showError(
        "Missing fields",
        "Choose a location, member, and trainer.",
      );
      return;
    }
    try {
      await assignTrainer({
        trainerId,
        memberId,
        locationId,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      showSuccess(
        "Trainer assigned",
        "The trainer has been assigned to this member at the selected location.",
      );
      setIsAssignOpen(false);
    } catch (error) {
      showError(
        "Could not assign trainer",
        getApiErrorMessage(error, "Something went wrong. Please try again."),
      );
    }
  };

  const columns: ColumnDef<AssignmentRow>[] = [
    {
      accessorKey: "memberName",
      header: "Member",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.memberName}</div>
      ),
    },
    { accessorKey: "trainerName", header: "Trainer" },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.plan}</span>
      ),
    },
    {
      accessorKey: "since",
      header: "Since",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.since}</span>
      ),
    },
  ];

  const assignDisabled =
    !locationId ||
    !memberId ||
    !trainerId ||
    isAssigning ||
    membersLoading ||
    trainersLoading;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Trainer Assignments</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Assign trainers to members at a gym location.
            </p>
          </div>
          <Button onClick={() => setIsAssignOpen(true)}>
            <IconPlus className="h-4 w-4" />
            Assign Trainer
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <DataTable
            data={[]}
            columns={columns}
            enableTabs={false}
            getRowId={(row) => row.id}
            emptyMessage="No trainer assignments to show yet. Use Assign Trainer to create one."
          />
        </div>
      </div>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-h-[min(90vh,640px)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Trainer</DialogTitle>
            <DialogDescription>
              Link a trainer to a member at a location. The trainer must already
              be assigned to that location.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => void handleAssign(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assign-location">Location</Label>
              <Select
                value={locationId || undefined}
                onValueChange={setLocationId}
                disabled={locationsLoading}
              >
                <SelectTrigger id="assign-location" className="!h-10 w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.locationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-member">Member</Label>
              <Select
                value={memberId || undefined}
                onValueChange={setMemberId}
                disabled={!locationId || membersLoading}
              >
                <SelectTrigger id="assign-member" className="!h-10 w-full">
                  <SelectValue
                    placeholder={
                      !locationId
                        ? "Select a location first"
                        : membersLoading
                          ? "Loading members…"
                          : "Select member"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {memberOptions.map((m) => (
                    <SelectItem key={m.memberId} value={m.memberId}>
                      {memberDisplayName(m)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {locationId && !membersLoading && memberOptions.length === 0 ? (
                <p className="text-muted-foreground text-xs">
                  No members with subscriptions at this location.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-trainer">Trainer</Label>
              <Select
                value={trainerId || undefined}
                onValueChange={setTrainerId}
                disabled={!locationId || trainersLoading}
              >
                <SelectTrigger id="assign-trainer" className="!h-10 w-full">
                  <SelectValue
                    placeholder={
                      !locationId
                        ? "Select a location first"
                        : trainersLoading
                          ? "Loading trainers…"
                          : "Select trainer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {trainerDisplayName(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {locationId && !trainersLoading && trainers.length === 0 ? (
                <p className="text-muted-foreground text-xs">
                  No trainers at this location. Add the trainer to the location
                  first.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-notes">Notes (optional)</Label>
              <Textarea
                id="assign-notes"
                rows={3}
                placeholder="e.g. Focus on strength training and cardio"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isAssigning}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignOpen(false)}
                disabled={isAssigning}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isAssigning} disabled={assignDisabled}>
                Assign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
