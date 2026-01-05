import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useLocationsQuery } from "../services";
import type { GymLocation } from "../types";
import { CreateLocationModal } from "./create-location-modal";

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

const createLocationsColumnsWithActions = (
  navigate: (path: string) => void
): ColumnDef<GymLocation>[] => [
  ...locationColumns,
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const location = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/locations/${location.id}`)}
            >
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function LocationsPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: locations, isLoading, refetch } = useLocationsQuery();

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  const columns = React.useMemo(
    () => createLocationsColumnsWithActions(navigate),
    [navigate]
  );

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
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={locations || []}
              columns={columns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No locations found."
            />
          )}
        </div>
      </div>

      <CreateLocationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleModalSuccess}
      />
    </DashboardLayout>
  );
}
