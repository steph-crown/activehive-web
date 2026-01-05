import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Staff } from "../types";

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
            View complete information for {staff.firstName} {staff.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                First Name
              </p>
              <p className="text-sm">{staff.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Name
              </p>
              <p className="text-sm">{staff.lastName}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email
              </p>
              <p className="text-sm">{staff.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Phone
              </p>
              <p className="text-sm">{staff.phone || "N/A"}</p>
            </div>
          </div>

          <Separator />

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
              <p className="text-sm">
                {new Date(staff.hireDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p className="text-sm">
                {new Date(staff.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {staff.permissionIds && staff.permissionIds.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Permissions ({staff.permissionIds.length})
                </p>
                <p className="text-sm text-muted-foreground">
                  {staff.permissionIds.length} permission(s) assigned
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
