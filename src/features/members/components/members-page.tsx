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
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useLocationStore } from "@/store";
import { IconPlus, IconMapPin } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useMembersQuery } from "../services";
import type { MemberSubscription } from "../types";
import { CreateMemberModal } from "./create-member-modal";

const membersColumns: ColumnDef<MemberSubscription>[] = [
  {
    accessorKey: "member.firstName",
    header: "Name",
    cell: ({ row }) => {
      const member = row.original.member;
      return (
        <div className="font-medium">
          {member.firstName} {member.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "member.email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.member.email}</div>
    ),
  },
  {
    accessorKey: "member.phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.member.phoneNumber;
      return <div className="text-sm">{phone || "N/A"}</div>;
    },
  },
  {
    accessorKey: "membershipPlan.name",
    header: "Membership Plan",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.membershipPlan.name}</div>
    ),
  },
  {
    accessorKey: "location.locationName",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.location.locationName}</div>
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
          : status === "pending"
          ? "secondary"
          : "destructive";
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
];

export function MembersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [localLocationId, setLocalLocationId] = React.useState<
    string | undefined
  >(undefined);
  const { selectedLocationId } = useLocationStore();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  // Use global location if set, otherwise use local filter
  const effectiveLocationId = selectedLocationId || localLocationId;

  const selectedLocation = locations?.find(
    (loc) => loc.id === selectedLocationId
  );

  const { data: members, isLoading, refetch } = useMembersQuery(
    effectiveLocationId
  );

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="text-muted-foreground mt-2">
              Manage your gym members and their information.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <div className="mb-4 flex items-center gap-4">
            {selectedLocationId && selectedLocation ? (
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <IconMapPin className="h-4 w-4" />
                <span>{selectedLocation.locationName}</span>
              </div>
            ) : (
              <div className="w-64">
                <Select
                  value={localLocationId || "all"}
                  onValueChange={(value) =>
                    setLocalLocationId(value === "all" ? undefined : value)
                  }
                  disabled={locationsLoading}
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
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={members || []}
              columns={membersColumns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No members found."
            />
          )}
        </div>
      </div>

      <CreateMemberModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleModalSuccess}
      />
    </DashboardLayout>
  );
}
