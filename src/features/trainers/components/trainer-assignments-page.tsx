import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { MemberSearchDropdown } from "@/components/molecules/member-search-dropdown";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useToast } from "@/hooks/use-toast";
import { formatDisplayDateTime } from "@/lib/display-datetime";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  useAssignTrainerToMemberMutation,
  useTrainerAssignmentsQuery,
  useTrainersQuery,
} from "../services";
import type { TrainerAssignment, TrainerListItem } from "../types";

function trainerDisplayName(t: TrainerListItem): string {
  const name = `${t.firstName} ${t.lastName}`.trim();
  return name || t.email;
}

function formatMemberCell(a: TrainerAssignment): string {
  const p = a.member;
  if (p) {
    const name = `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
    if (name) return name;
    if (p.email) return p.email;
  }
  return a.memberId;
}

function formatTrainerCell(a: TrainerAssignment): string {
  const p = a.trainer;
  if (p) {
    const name = `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
    if (name) return name;
    if (p.email) return p.email;
  }
  return a.trainerId;
}

function formatLocationCell(a: TrainerAssignment): string {
  const p = a.location;
  if (p?.locationName) return p.locationName;
  return a.locationId;
}

function notesPreview(notes: string | null, max = 56): string {
  if (!notes?.trim()) return "—";
  const t = notes.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function AssignmentsTableSkeleton() {
  return (
    <div className="rounded-md border border-[#F4F4F4] bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Member</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }, (_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }, (_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full max-w-[140px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TrainerAssignmentsPage() {
  const { showSuccess, showError } = useToast();
  const { data: locations = [], isLoading: locationsLoading } = useLocationsQuery();

  const [filterLocationId, setFilterLocationId] = React.useState("all");
  const [filterTrainerId, setFilterTrainerId] = React.useState("all");
  const [filterMemberId, setFilterMemberId] = React.useState("");

  const listParams = React.useMemo(
    () => ({
      ...(filterLocationId !== "all" ? { locationId: filterLocationId } : {}),
      ...(filterTrainerId !== "all" ? { trainerId: filterTrainerId } : {}),
      ...(filterMemberId ? { memberId: filterMemberId } : {}),
    }),
    [filterLocationId, filterTrainerId, filterMemberId],
  );

  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    isError: assignmentsError,
    error: assignmentsErrorObj,
  } = useTrainerAssignmentsQuery(listParams);

  const { data: filterTrainers = [], isLoading: filterTrainersLoading } =
    useTrainersQuery();

  const trainerFilterOptions = React.useMemo(
    () =>
      filterTrainers.map((t) => ({
        value: t.id,
        label: trainerDisplayName(t),
      })),
    [filterTrainers],
  );

  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [assignLocationId, setAssignLocationId] = React.useState("");
  const [assignMemberId, setAssignMemberId] = React.useState("");
  const [assignTrainerId, setAssignTrainerId] = React.useState("");
  const [assignNotes, setAssignNotes] = React.useState("");

  const { mutateAsync: assignTrainer, isPending: isAssigning } =
    useAssignTrainerToMemberMutation();

  const { data: assignTrainers = [], isLoading: assignTrainersLoading } =
    useTrainersQuery(
      assignLocationId ? { locationId: assignLocationId } : {},
      { enabled: Boolean(assignLocationId) },
    );

  React.useEffect(() => {
    if (isAssignOpen) {
      setAssignLocationId("");
      setAssignMemberId("");
      setAssignTrainerId("");
      setAssignNotes("");
    }
  }, [isAssignOpen]);

  React.useEffect(() => {
    setAssignMemberId("");
    setAssignTrainerId("");
  }, [assignLocationId]);

  const handleAssign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assignLocationId || !assignMemberId || !assignTrainerId) {
      showError(
        "Missing fields",
        "Choose a location, member, and trainer.",
      );
      return;
    }
    try {
      await assignTrainer({
        trainerId: assignTrainerId,
        memberId: assignMemberId,
        locationId: assignLocationId,
        ...(assignNotes.trim() ? { notes: assignNotes.trim() } : {}),
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

  const columns: ColumnDef<TrainerAssignment>[] = [
    {
      id: "member",
      header: "Member",
      cell: ({ row }) => (
        <div className="font-medium">{formatMemberCell(row.original)}</div>
      ),
    },
    {
      id: "trainer",
      header: "Trainer",
      cell: ({ row }) => formatTrainerCell(row.original),
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatLocationCell(row.original)}
        </span>
      ),
    },
    {
      id: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <span className="text-muted-foreground max-w-[220px] truncate text-sm">
          {notesPreview(row.original.notes)}
        </span>
      ),
    },
    {
      id: "assignedAt",
      header: "Assigned",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDisplayDateTime(row.original.assignedAt)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const assignDisabled =
    !assignLocationId ||
    !assignMemberId ||
    !assignTrainerId ||
    isAssigning ||
    assignTrainersLoading;

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
          <TableFilterBar
            showSearch={false}
            showExportButton={false}
            locationValue={filterLocationId}
            onLocationChange={setFilterLocationId}
            locations={(locations ?? []).map((location) => ({
              value: location.id,
              label: location.locationName,
            }))}
            locationDisabled={locationsLoading}
            showTrainerFilter
            trainerValue={filterTrainerId}
            onTrainerChange={setFilterTrainerId}
            trainerOptions={trainerFilterOptions}
            trainerDisabled={filterTrainersLoading}
          />
          <div className="mb-4 -mt-2">
            <MemberSearchDropdown
              value={filterMemberId}
              onValueChange={setFilterMemberId}
              placeholder="All members"
              className="h-10 w-[180px] border-[#F4F4F4] bg-white"
            />
          </div>

          {assignmentsLoading ? (
            <AssignmentsTableSkeleton />
          ) : assignmentsError ? (
            <div className="text-destructive text-sm">
              {getApiErrorMessage(
                assignmentsErrorObj,
                "Could not load assignments. Try again.",
              )}
            </div>
          ) : (
            <DataTable
              data={assignments}
              columns={columns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No trainer assignments match these filters."
            />
          )}
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
                value={assignLocationId || undefined}
                onValueChange={setAssignLocationId}
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
              <Label>Member</Label>
              <MemberSearchDropdown
                value={assignMemberId}
                onValueChange={setAssignMemberId}
                locationId={assignLocationId || undefined}
                disabled={!assignLocationId}
                placeholder={
                  !assignLocationId ? "Select a location first" : "Search members…"
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-trainer">Trainer</Label>
              <Select
                value={assignTrainerId || undefined}
                onValueChange={setAssignTrainerId}
                disabled={!assignLocationId || assignTrainersLoading}
              >
                <SelectTrigger id="assign-trainer" className="!h-10 w-full">
                  <SelectValue
                    placeholder={
                      !assignLocationId
                        ? "Select a location first"
                        : assignTrainersLoading
                          ? "Loading trainers…"
                          : "Select trainer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {assignTrainers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {trainerDisplayName(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {assignLocationId &&
              !assignTrainersLoading &&
              assignTrainers.length === 0 ? (
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
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
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
