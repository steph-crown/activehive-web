import { DataTable } from "@/components/molecules/data-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useAvailableRolesQuery } from "../services";
import type { Role } from "../types";
import { CreateRoleModal } from "./create-role-modal";
import { EditRoleModal } from "./edit-role-modal";
import { ViewRoleDetailsModal } from "./view-role-details-modal";

function PermissionNamesCell({ role }: { role: Role }) {
  const perms = role.permissions ?? [];
  if (perms.length === 0) {
    const n = role.permissionIds?.length ?? 0;
    return (
      <span className="text-muted-foreground text-sm">
        {n > 0 ? `${n} permission(s)` : "—"}
      </span>
    );
  }
  return (
    <div className="max-w-xl min-w-0">
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
        {perms.map((p, i) => (
          <React.Fragment key={p.id}>
            {i > 0 ? ", " : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="border-muted-foreground/50 cursor-default border-b border-dotted">
                  {p.name}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {p.description?.trim() || "No description"}
              </TooltipContent>
            </Tooltip>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function RolesTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [viewingRole, setViewingRole] = React.useState<Role | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const { data: roles, isLoading, refetch } = useAvailableRolesQuery();

  const openDetails = React.useCallback((role: Role) => {
    setViewingRole(role);
    setDetailsOpen(true);
  }, []);

  const openEdit = React.useCallback((role: Role) => {
    setEditingRole(role);
    setEditOpen(true);
  }, []);

  const columns = React.useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.original.description;
          const text =
            description != null && String(description).trim().length
              ? String(description)
              : null;
          return (
            <div
              className="text-muted-foreground max-w-md truncate text-sm"
              title={text ?? undefined}
            >
              {text ?? "—"}
            </div>
          );
        },
      },
      {
        id: "permissions",
        header: "Permissions",
        cell: ({ row }) => <PermissionNamesCell role={row.original} />,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        size: 96,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => openEdit(row.original)}
            >
              <IconEdit className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label={`View ${row.original.name}`}
              onClick={() => openDetails(row.original)}
            >
              <IconEye className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [openDetails, openEdit],
  );

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  return (
    <TooltipProvider delayDuration={250}>
      <>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Role List</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Create and maintain role definitions for staff.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4" />
            Create Role
          </Button>
        </div>

        <DataTable
          data={roles || []}
          columns={columns}
          enableTabs={false}
          getRowId={(row) => row.id}
          emptyMessage="No roles found."
          isLoading={isLoading}
        />

        <CreateRoleModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={handleModalSuccess}
        />

        <ViewRoleDetailsModal
          role={viewingRole}
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open);
            if (!open) setViewingRole(null);
          }}
        />

        <EditRoleModal
          role={editingRole}
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) setEditingRole(null);
          }}
          onSuccess={refetch}
        />
      </>
    </TooltipProvider>
  );
}
