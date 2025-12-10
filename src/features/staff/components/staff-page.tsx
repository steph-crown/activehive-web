import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconPlus } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useStaffQuery } from "../services";
import type { Staff } from "../types";
import { CreateStaffModal } from "./create-staff-modal";

const staffColumns: ColumnDef<Staff>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      const lastName = row.original.lastName;
      return (
        <div className="font-medium">
          {firstName} {lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="text-sm">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("department")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return <div className="text-sm">{role?.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "locations",
    header: "Locations",
    cell: ({ row }) => {
      const locations = row.original.locations;
      if (!locations || locations.length === 0) {
        return (
          <div className="text-sm text-muted-foreground">No locations</div>
        );
      }
      return (
        <div className="flex flex-wrap gap-1">
          {locations.slice(0, 2).map((loc) => (
            <Badge key={loc.id} variant="secondary" className="text-xs">
              {loc.locationName}
            </Badge>
          ))}
          {locations.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{locations.length - 2} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "hireDate",
    header: "Hire Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("hireDate"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "active"
          ? "default"
          : status === "terminated"
          ? "destructive"
          : "secondary";
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
];

export function StaffPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: staff, isLoading, refetch } = useStaffQuery();

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Staff</h1>
            <p className="text-muted-foreground mt-2">
              Manage your gym staff members and their assignments.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={staff || []}
              columns={staffColumns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No staff members found."
            />
          )}
        </div>
      </div>

      <CreateStaffModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleModalSuccess}
      />
    </DashboardLayout>
  );
}
