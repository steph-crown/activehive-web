import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  useAvailablePermissionsQuery,
} from "../services";
import type { Permission } from "../types";
import { CreatePermissionModal } from "./create-permission-modal";

const permissionsColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("code")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | undefined;
      return (
        <div className="text-sm">
          {description || <span className="text-muted-foreground">N/A</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "isSystem",
    header: "Type",
    cell: ({ row }) => {
      const isSystem = row.getValue("isSystem") as boolean;
      return (
        <Badge variant={isSystem ? "default" : "secondary"}>
          {isSystem ? "System" : "Custom"}
        </Badge>
      );
    },
  },
];

export function PermissionsTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: permissions, isLoading, refetch } =
    useAvailablePermissionsQuery();

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Permissions</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage staff permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          Create Permission
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <BlockLoader />
        </div>
      ) : (
        <DataTable
          data={permissions || []}
          columns={permissionsColumns}
          enableTabs={false}
          getRowId={(row) => row.id}
          emptyMessage="No permissions found."
        />
      )}

      <CreatePermissionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
