import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Role } from "../types";

type ViewRoleDetailsModalProps = {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ViewRoleDetailsModal({
  role,
  open,
  onOpenChange,
}: ViewRoleDetailsModalProps) {
  const perms = role?.permissions ?? [];
  const fallbackCount = role?.permissionIds?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role?.name ?? "Role"}</DialogTitle>
        </DialogHeader>
        {role ? (
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium">
                Description
              </p>
              <p className="text-sm">
                {role.description?.trim() ? role.description : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">
                Permissions ({perms.length > 0 ? perms.length : fallbackCount})
              </p>
              {perms.length > 0 ? (
                <ul className="space-y-3 border-t border-[#F4F4F4] pt-3">
                  {perms.map((p) => (
                    <li key={p.id} className="space-y-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {p.description?.trim() ? p.description : "—"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {fallbackCount > 0
                    ? "Permission details were not included in this response."
                    : "No permissions assigned."}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
