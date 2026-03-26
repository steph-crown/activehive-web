import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { IconPlus } from "@tabler/icons-react";
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
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("");
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const effectiveLocationId =
    locationFilter === "all" ? undefined : locationFilter;

  const {
    data: members,
    isLoading,
    refetch,
  } = useMembersQuery(effectiveLocationId);

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  const filteredMembers = React.useMemo(() => {
    const rows = members || [];
    return rows.filter((member) => {
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${member.member.firstName} ${member.member.lastName} ${member.member.email} ${member.membershipPlan.name}`
          .toLowerCase()
          .includes(normalizedSearch);

      if (!dateFilter) return matchesSearch;
      const selectedDate = new Date(dateFilter).toLocaleDateString();
      const rowDate = new Date(member.createdAt).toLocaleDateString();
      return matchesSearch && rowDate === selectedDate;
    });
  }, [dateFilter, members, searchQuery]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Members</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your gym members and their information.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 " />
            Add Member
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <TableFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search members..."
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
            data={filteredMembers}
            columns={membersColumns}
            enableTabs={false}
            getRowId={(row) => row.id}
            emptyMessage="No members found."
            isLoading={isLoading}
          />
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
