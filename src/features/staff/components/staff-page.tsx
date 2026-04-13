import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  staffEmail,
  staffFullName,
  staffPhone,
  staffSearchBlob,
} from "../lib/staff-display";
import { useStaffQuery } from "../services";
import type { Staff } from "../types";
import { CreateStaffModal } from "./create-staff-modal";
import { ChangeRoleModal } from "./change-role-modal";
import { AssignLocationsModal } from "./assign-locations-modal";
import { ViewStaffModal } from "./view-staff-modal";
import { formatDisplayDate, localCalendarDateKey } from "@/lib/display-datetime";

const staffColumns: ColumnDef<Staff>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{staffFullName(row.original)}</div>
    ),
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm">{staffEmail(row.original) || "—"}</div>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-sm">{staffPhone(row.original) || "—"}</div>
    ),
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
    cell: ({ row }) => (
      <div className="text-sm">{formatDisplayDate(row.getValue("hireDate"))}</div>
    ),
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
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = React.useState(false);
  const [isAssignLocationsOpen, setIsAssignLocationsOpen] =
    React.useState(false);
  const [isViewStaffOpen, setIsViewStaffOpen] = React.useState(false);
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("");
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { data: allStaff, isLoading, refetch } = useStaffQuery();

  const effectiveLocationId =
    locationFilter === "all" ? undefined : locationFilter;

  // Filter staff client-side based on location
  const staff = React.useMemo(() => {
    if (!allStaff) return [];
    let rows = allStaff;
    if (effectiveLocationId) {
      rows = rows.filter((s) =>
        s.locations?.some((loc) => loc.id === effectiveLocationId),
      );
    }

    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (normalizedSearch) {
      rows = rows.filter((s) =>
        staffSearchBlob(s).includes(normalizedSearch),
      );
    }

    if (dateFilter) {
      const selectedKey = localCalendarDateKey(`${dateFilter}T12:00:00`);
      rows = rows.filter((s) => {
        const rowKey = localCalendarDateKey(s.hireDate);
        return (
          selectedKey != null && rowKey != null && rowKey === selectedKey
        );
      });
    }

    return rows;
  }, [allStaff, dateFilter, effectiveLocationId, searchQuery]);

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  const handleChangeRole = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsChangeRoleOpen(true);
  };

  const handleAssignLocations = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsAssignLocationsOpen(true);
  };

  const handleViewStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsViewStaffOpen(true);
  };

  const handleActionSuccess = () => {
    refetch();
    setIsChangeRoleOpen(false);
    setIsAssignLocationsOpen(false);
  };

  // Add actions column
  const columnsWithActions: ColumnDef<Staff>[] = [
    ...staffColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const staffMember = row.original;
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleViewStaff(staffMember)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleChangeRole(staffMember)}>
                Change role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAssignLocations(staffMember)}
              >
                Assign Locations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Staff Management</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your gym staff members and assignments.
            </p>
          </div>
        </div> */}

        <div className="px-4 lg:px-6 ">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Staff Members</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your gym staff members and their assignments
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <IconPlus className="h-4 w-4 " />
              Add Staff
            </Button>
          </div>

          <TableFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search staff..."
            locationValue={locationFilter}
            onLocationChange={setLocationFilter}
            locations={(locations ?? []).map((location) => ({
              value: location.id,
              label: location.locationName,
            }))}
            locationDisabled={locationsLoading}
            dateValue={dateFilter}
            onDateChange={setDateFilter}
          />

          <DataTable
            data={staff || []}
            columns={columnsWithActions}
            enableTabs={false}
            getRowId={(row) => row.id}
            emptyMessage="No staff members found."
            isLoading={isLoading}
          />
        </div>
      </div>

      <CreateStaffModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleModalSuccess}
      />

      <ChangeRoleModal
        open={isChangeRoleOpen}
        onOpenChange={setIsChangeRoleOpen}
        staff={selectedStaff}
        onSuccess={handleActionSuccess}
      />

      <AssignLocationsModal
        open={isAssignLocationsOpen}
        onOpenChange={setIsAssignLocationsOpen}
        staff={selectedStaff}
        onSuccess={handleActionSuccess}
      />

      <ViewStaffModal
        open={isViewStaffOpen}
        onOpenChange={setIsViewStaffOpen}
        staff={selectedStaff}
      />
    </DashboardLayout>
  );
}
