import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { type ColumnDef } from "@tanstack/react-table";
import { useLocationsQuery } from "../services";
import type { GymLocation } from "../types";

const locationColumns: ColumnDef<GymLocation>[] = [
  {
    accessorKey: "locationName",
    header: "Location Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("locationName")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div className="text-sm">
          <div>{address.street}</div>
          <div className="text-muted-foreground">
            {address.city}, {address.state} {address.zipCode}
          </div>
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
    accessorKey: "metrics.activeMembers",
    header: "Active Members",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.metrics.activeMembers}
      </div>
    ),
  },
  {
    accessorKey: "metrics.monthlyRevenue",
    header: () => <div className="text-right">Monthly Revenue</div>,
    cell: ({ row }) => {
      const revenue = row.original.metrics.monthlyRevenue;
      return (
        <div className="text-right font-medium">
          ${revenue.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "isHeadquarters",
    header: "Type",
    cell: ({ row }) => {
      const isHeadquarters = row.getValue("isHeadquarters") as boolean;
      return (
        <Badge variant={isHeadquarters ? "default" : "secondary"}>
          {isHeadquarters ? "Headquarters" : "Branch"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
];

export function LocationsPage() {
  const { data: locations, isLoading } = useLocationsQuery();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Locations</h1>
            <p className="text-muted-foreground mt-2">
              Manage your gym locations and their information.
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={locations || []}
              columns={locationColumns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No locations found."
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
