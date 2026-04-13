import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  staffEmail,
  staffFirstName,
  staffFullName,
  staffLastName,
  staffPhone,
} from "../lib/staff-display";
import type { Staff } from "../types";
import { formatDisplayDate } from "@/lib/display-datetime";

interface ViewStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
}

export function ViewStaffModal({
  open,
  onOpenChange,
  staff,
}: ViewStaffModalProps) {
  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
          <DialogDescription>
            View complete information for {staffFullName(staff)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                First Name
              </p>
              <p className="text-sm">{staffFirstName(staff) || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Name
              </p>
              <p className="text-sm">{staffLastName(staff) || "—"}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email
              </p>
              <p className="text-sm">{staffEmail(staff) || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Phone
              </p>
              <p className="text-sm">{staffPhone(staff) || "—"}</p>
            </div>
          </div>

          <Separator />

          {staff.gym?.name ? (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Gym
                </p>
                <p className="text-sm">{staff.gym.name}</p>
              </div>
              <Separator />
            </>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Role
              </p>
              <p className="text-sm">{staff.role?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Department
              </p>
              <p className="text-sm">{staff.department}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Status
            </p>
            <Badge
              variant={
                staff.status === "active"
                  ? "default"
                  : staff.status === "terminated"
                  ? "destructive"
                  : "secondary"
              }
              className="capitalize"
            >
              {staff.status}
            </Badge>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Locations
            </p>
            {staff.locations && staff.locations.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {staff.locations.map((loc) => (
                  <Badge key={loc.id} variant="secondary" className="text-xs">
                    {loc.locationName}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No locations</p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Hire Date
              </p>
              <p className="text-sm">{formatDisplayDate(staff.hireDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p className="text-sm">{formatDisplayDate(staff.createdAt)}</p>
            </div>
          </div>

          {(staff.permissions?.length || staff.permissionIds?.length) ? (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Permissions (
                  {staff.permissions?.length ?? staff.permissionIds?.length ?? 0}
                  )
                </p>
                {staff.permissions && staff.permissions.length > 0 ? (
                  <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
                    {staff.permissions.map((p) => (
                      <li key={p.id}>
                        <span className="font-medium">{p.name}</span>
                        {p.description ? (
                          <span className="text-muted-foreground">
                            {" "}
                            — {p.description}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {staff.permissionIds?.length ?? 0} permission(s) assigned
                    (details not loaded).
                  </p>
                )}
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
