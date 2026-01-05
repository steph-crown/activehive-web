import { BlockLoader } from "@/components/loader/block-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useClassQuery,
  useDeleteClassMutation,
  useClassReportQuery,
} from "../services";
import { AssignTrainerModal } from "./assign-trainer-modal";
import { ReuseClassModal } from "./reuse-class-modal";
import { UpdateClassModal } from "./update-class-modal";

export function ClassDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isAssignTrainerOpen, setIsAssignTrainerOpen] = React.useState(false);
  const [isReuseOpen, setIsReuseOpen] = React.useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const [showReport, setShowReport] = React.useState(false);

  const { data: classItem, isLoading, refetch } = useClassQuery(id || "");
  const { data: report, isLoading: reportLoading } = useClassReportQuery(
    showReport ? id || "" : ""
  );
  const { mutateAsync: deleteClass, isPending: isDeleting } =
    useDeleteClassMutation();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await deleteClass(id || "");
      showSuccess("Success", "Class deleted successfully!");
      navigate("/dashboard/classes");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete class.";
      showError("Error", message);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <BlockLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (!classItem) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Class not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/classes")}
            className="mb-4"
          >
            ← Back to Classes
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{classItem.name}</h1>
              <p className="text-muted-foreground mt-2">Class Details</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAssignTrainerOpen(true)}
              >
                Assign Trainer
              </Button>
              <Button variant="outline" onClick={() => setIsReuseOpen(true)}>
                Reuse
              </Button>
              <Button variant="outline" onClick={() => setShowReport(true)}>
                Get Report
              </Button>
              <Button variant="outline" onClick={() => setIsUpdateOpen(true)}>
                Update
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
              <CardDescription>Complete details for this class</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm">{classItem.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge variant={classItem.isActive ? "default" : "secondary"}>
                    {classItem.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {classItem.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Description
                    </p>
                    <p className="text-sm">{classItem.description}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {classItem.metadata?.category || "N/A"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Difficulty
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {classItem.metadata?.difficulty || "N/A"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Capacity
                  </p>
                  <p className="text-sm font-semibold">{classItem.capacity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Duration
                  </p>
                  <p className="text-sm font-semibold">
                    {classItem.metadata?.duration || 0} minutes
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="text-sm">
                    {classItem.location?.locationName || "All Locations"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Trainer
                  </p>
                  <p className="text-sm">
                    {classItem.trainer
                      ? `${classItem.trainer.firstName} ${classItem.trainer.lastName}`
                      : "Not assigned"}
                  </p>
                </div>
              </div>

              {classItem.metadata?.equipment && classItem.metadata.equipment.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Equipment
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {classItem.metadata.equipment.map((item, index) => (
                        <Badge key={index} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Schedules
                </p>
                <div className="space-y-2">
                  {classItem.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(schedule.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                        {schedule.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {schedule.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showReport && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Class Report
                    </p>
                    {reportLoading ? (
                      <p className="text-sm text-muted-foreground">
                        Loading report...
                      </p>
                    ) : report ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Sessions
                          </p>
                          <p className="text-sm font-semibold">
                            {report.totalSessions || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Bookings
                          </p>
                          <p className="text-sm font-semibold">
                            {report.totalBookings || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Attendance
                          </p>
                          <p className="text-sm font-semibold">
                            {report.totalAttendance || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Average Attendance
                          </p>
                          <p className="text-sm font-semibold">
                            {report.averageAttendance || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Revenue
                          </p>
                          <p className="text-sm font-semibold">
                            ${(report.revenue || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No report data available
                      </p>
                    )}
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="text-sm">
                    {new Date(classItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Updated At
                  </p>
                  <p className="text-sm">
                    {new Date(classItem.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {classItem && (
        <>
          <AssignTrainerModal
            open={isAssignTrainerOpen}
            onOpenChange={setIsAssignTrainerOpen}
            classItem={classItem}
            onSuccess={() => {
              refetch();
              setIsAssignTrainerOpen(false);
            }}
          />

          <ReuseClassModal
            open={isReuseOpen}
            onOpenChange={setIsReuseOpen}
            classItem={classItem}
            onSuccess={() => {
              refetch();
              setIsReuseOpen(false);
            }}
          />

          <UpdateClassModal
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
            classItem={classItem}
            onSuccess={() => {
              refetch();
              setIsUpdateOpen(false);
            }}
          />
        </>
      )}
    </DashboardLayout>
  );
}
