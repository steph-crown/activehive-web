import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useLocationStore } from "@/store";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useStaffQuery } from "../services";
import type { Staff } from "../types";
import { CreateStaffModal } from "./create-staff-modal";
import { AssignPermissionsModal } from "./assign-permissions-modal";
import { AssignLocationsModal } from "./assign-locations-modal";
import { ViewStaffModal } from "./view-staff-modal";
import { RolesTab } from "./roles-tab";
import { PermissionsTab } from "./permissions-tab";

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
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null);
  const [isAssignPermissionsOpen, setIsAssignPermissionsOpen] =
    React.useState(false);
  const [isAssignLocationsOpen, setIsAssignLocationsOpen] =
    React.useState(false);
  const [isViewStaffOpen, setIsViewStaffOpen] = React.useState(false);
  const [localLocationId, setLocalLocationId] = React.useState<
    string | undefined
  >(undefined);
  const { selectedLocationId } = useLocationStore();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { data: allStaff, isLoading, refetch } = useStaffQuery();

  // Use global location if set, otherwise use local filter
  const effectiveLocationId = selectedLocationId || localLocationId;

  // Filter staff client-side based on location
  const staff = React.useMemo(() => {
    if (!allStaff) return [];
    if (!effectiveLocationId) return allStaff;
    return allStaff.filter((s) =>
      s.locations?.some((loc) => loc.id === effectiveLocationId)
    );
  }, [allStaff, effectiveLocationId]);

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  const handleAssignPermissions = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsAssignPermissionsOpen(true);
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
    setIsAssignPermissionsOpen(false);
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
              <DropdownMenuItem
                onClick={() => handleAssignPermissions(staffMember)}
              >
                Assign Permissions
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
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your gym staff members, roles, and permissions.
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          <Tabs defaultValue="staff" className="w-full">
            <TabsList>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Staff Members</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Manage your gym staff members and their assignments
                  </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="w-64">
                  <Select
                    value={localLocationId || "all"}
                    onValueChange={(value) =>
                      setLocalLocationId(value === "all" ? undefined : value)
                    }
                    disabled={locationsLoading || !!selectedLocationId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations?.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.locationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedLocationId && (
                  <p className="text-sm text-muted-foreground">
                    Location filter is controlled globally from the header
                  </p>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <BlockLoader />
                </div>
              ) : (
                <DataTable
                  data={staff || []}
                  columns={columnsWithActions}
                  enableTabs={false}
                  getRowId={(row) => row.id}
                  emptyMessage="No staff members found."
                />
              )}
            </TabsContent>

            <TabsContent value="roles" className="mt-6">
              <RolesTab />
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <PermissionsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateStaffModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleModalSuccess}
      />

      <AssignPermissionsModal
        open={isAssignPermissionsOpen}
        onOpenChange={setIsAssignPermissionsOpen}
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
