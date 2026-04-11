import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import {
  useClassQuery,
  useClassReportQuery,
  useDeleteClassMutation,
} from "../services";
import {
  AssignTrainerModal,
  classHasAssignedTrainer,
} from "./assign-trainer-modal";
import { AddClassAttendanceModal } from "./add-class-attendance-modal";
import { ReuseClassModal } from "./reuse-class-modal";
import { UpdateClassModal } from "./update-class-modal";
import type { Class } from "../types";
import {
  formatScheduleDateOnly,
  formatScheduleTimeRange12h,
} from "../utils/format-schedule-display";

function LabeledRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function dash(v: string | null | undefined): string {
  if (v == null) return "—";
  const s = String(v).trim();
  return s.length ? s : "—";
}

function ClassDetailsCards({ classItem }: { classItem: Class }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
        <h2 className="text-xl font-semibold">Class details</h2>
        <p className="text-muted-foreground text-xs">
          Schedule, capacity, and assignment for this class.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabeledRow label="Name" value={dash(classItem.name)} />
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Status</p>
            <Badge variant={classItem.isActive ? "default" : "secondary"}>
              {classItem.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <LabeledRow
            label="Category"
            value={dash(classItem.metadata?.category)}
          />
          <LabeledRow
            label="Difficulty"
            value={dash(classItem.metadata?.difficulty)}
          />
          <LabeledRow
            label="Capacity"
            value={String(classItem.capacity ?? "—")}
          />
          <LabeledRow
            label="Duration"
            value={
              classItem.metadata?.duration != null
                ? `${classItem.metadata.duration} minutes`
                : "—"
            }
          />
          <LabeledRow
            label="Location"
            value={dash(classItem.location?.locationName) || "Gym-level"}
          />
          <LabeledRow
            label="Trainer"
            value={
              classItem.trainer
                ? `${classItem.trainer.firstName} ${classItem.trainer.lastName}`.trim()
                : "Not assigned"
            }
          />
        </div>
        {classItem.description?.trim() ? (
          <>
            <Separator className="my-4" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">
                Description
              </p>
              <p className="text-sm text-foreground">
                {classItem.description.trim()}
              </p>
            </div>
          </>
        ) : null}
        {classItem.metadata?.equipment &&
        classItem.metadata.equipment.length > 0 ? (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">Equipment</p>
              <div className="flex flex-wrap gap-2">
                {classItem.metadata.equipment.map((item, index) => (
                  <Badge key={index} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : null}
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabeledRow
            label="Created"
            value={new Date(classItem.createdAt).toLocaleDateString()}
          />
          <LabeledRow
            label="Updated"
            value={new Date(classItem.updatedAt).toLocaleDateString()}
          />
        </div>
      </Card>

      <ClassReportCard classId={classItem.id} />
    </div>
  );
}

function ClassReportCard({ classId }: { classId: string }) {
  const {
    data: report,
    isLoading: reportLoading,
    isError,
  } = useClassReportQuery(classId);

  return (
    <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
      <h2 className="text-xl font-semibold">Class report</h2>
      <p className="text-muted-foreground text-xs">
        Sessions, bookings, attendance, and revenue for this class.
      </p>
      {reportLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      ) : isError || !report ? (
        <p className="text-muted-foreground text-sm">
          Report could not be loaded.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <LabeledRow
            label="Total sessions"
            value={String(report.totalSessions ?? 0)}
          />
          <LabeledRow
            label="Total bookings"
            value={String(report.totalBookings ?? 0)}
          />
          <LabeledRow
            label="Total attendance"
            value={String(report.totalAttendance ?? 0)}
          />
          <LabeledRow
            label="Avg. attendance"
            value={String(report.averageAttendance ?? 0)}
          />
          <LabeledRow
            label="Revenue"
            value={`$${(report.revenue ?? 0).toLocaleString()}`}
          />
        </div>
      )}
    </Card>
  );
}

function SchedulesCard({ classItem }: { classItem: Class }) {
  return (
    <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
      <h2 className="text-xl font-semibold">Schedules</h2>
      <p className="text-muted-foreground text-xs">
        Upcoming and recurring session times.
      </p>
      <div className="space-y-2">
        {classItem.schedules.length === 0 ? (
          <p className="text-muted-foreground text-sm">No schedules yet.</p>
        ) : (
          classItem.schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between rounded-md border border-[#F4F4F4] p-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {formatScheduleDateOnly(schedule.date)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatScheduleTimeRange12h(
                    schedule.startTime,
                    schedule.endTime,
                  )}
                </p>
                {schedule.notes ? (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {schedule.notes}
                  </p>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export function ClassDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isAssignTrainerOpen, setIsAssignTrainerOpen] = React.useState(false);
  const [isReuseOpen, setIsReuseOpen] = React.useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { data: classItem, isLoading, refetch } = useClassQuery(id || "");
  const { mutateAsync: deleteClass, isPending: isDeleting } =
    useDeleteClassMutation();

  const handleConfirmDelete = async () => {
    if (!id) return;
    try {
      await deleteClass(id);
      showSuccess("Class deleted", "The class was removed.");
      setDeleteDialogOpen(false);
      navigate("/dashboard/classes");
    } catch (error) {
      showError(
        "Could not delete class",
        getApiErrorMessage(error, "Failed to delete class."),
      );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between gap-4 px-4 lg:px-6">
            <div>
              <Skeleton className="h-9 w-64" />
              <Skeleton className="mt-2 h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
            <Card className="rounded-md border-[#F4F4F4] p-6 shadow-none">
              <Skeleton className="mb-4 h-6 w-40" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
            <Card className="rounded-md border-[#F4F4F4] p-6 shadow-none">
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!classItem) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 lg:px-6">
          <Card className="rounded-md border-[#F4F4F4] p-6 shadow-none">
            <p className="text-muted-foreground text-sm">Class not found.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/dashboard/classes")}
            >
              Back to classes
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-4 px-4 lg:flex-row lg:items-start lg:justify-between lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">{classItem.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Class details, report, and schedules
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                onClick={() => setIsAddAttendanceOpen(true)}
                disabled={classItem.schedules.length === 0}
                title={
                  classItem.schedules.length === 0
                    ? "Add a schedule before recording attendance"
                    : undefined
                }
              >
                Add attendance
              </Button>
              <Button
                variant="outline"
                className="border-[#F4F4F4]"
                onClick={() => setIsAssignTrainerOpen(true)}
              >
                {classHasAssignedTrainer(classItem)
                  ? "Reassign trainer"
                  : "Assign trainer"}
              </Button>
              <Button
                variant="outline"
                className="border-[#F4F4F4]"
                onClick={() => setIsReuseOpen(true)}
              >
                Reuse
              </Button>
              <Button
                variant="outline"
                className="border-[#F4F4F4]"
                onClick={() => setIsUpdateOpen(true)}
              >
                Update
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 lg:px-6">
          <ClassDetailsCards classItem={classItem} />
          <SchedulesCard classItem={classItem} />
          <Card className="rounded-md border border-destructive/25 bg-white p-6 shadow-none">
            <h2 className="text-lg font-semibold text-destructive">
              Danger zone
            </h2>
            <p className="text-muted-foreground mt-1 max-w-xl text-sm">
              Deleting removes this class and its schedules. Members and history
              may still appear in other reports depending on your backend.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/5"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete class
            </Button>
          </Card>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this class?</DialogTitle>
            <DialogDescription>
              <span className="text-foreground font-medium">
                {classItem.name}
              </span>{" "}
              will be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              loading={isDeleting}
              onClick={() => void handleConfirmDelete()}
            >
              Delete class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AssignTrainerModal
        open={isAssignTrainerOpen}
        onOpenChange={setIsAssignTrainerOpen}
        classItem={classItem}
        onSuccess={() => {
          void refetch();
          setIsAssignTrainerOpen(false);
        }}
      />

      <ReuseClassModal
        open={isReuseOpen}
        onOpenChange={setIsReuseOpen}
        classItem={classItem}
        onSuccess={() => {
          void refetch();
          setIsReuseOpen(false);
        }}
      />

      <UpdateClassModal
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        classItem={classItem}
        onSuccess={() => {
          void refetch();
          setIsUpdateOpen(false);
        }}
      />

      <AddClassAttendanceModal
        open={isAddAttendanceOpen}
        onOpenChange={setIsAddAttendanceOpen}
        classItem={classItem}
        onSuccess={() => {
          void refetch();
          setIsAddAttendanceOpen(false);
        }}
      />
    </DashboardLayout>
  );
}
