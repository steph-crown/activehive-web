import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "./dashboard-layout";
import { DashboardOverviewFilters } from "./dashboard-overview-filters";
import { WelcomeMessage } from "./welcome-message";
import { SectionCards } from "./section-cards";
import { RevenueChart } from "./revenue-chart";
import { MembersChart } from "./members-chart";
import { WeeklyAttendanceChart } from "./weekly-attendance-chart";
import { MembershipMixChart } from "./membership-mix-chart";
import {
  useGymOwnerAnalyticsDashboardQuery,
} from "@/features/dashboard/services";
import { useMembersQuery } from "@/features/members/services";
import { useLocationStore } from "@/store";
import { type ColumnDef } from "@tanstack/react-table";
import type { MemberSubscription } from "@/features/members/types";
import { useMemo, useState } from "react";
import { MembersTableSkeleton, SectionCardsSkeleton } from "./dashboard-skeleton";

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
      const status = String(row.getValue("status"));
      let variant: "default" | "secondary" | "destructive" = "destructive";

      if (status === "active") {
        variant = "default";
      } else if (status === "pending") {
        variant = "secondary";
      }
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

export function DashboardPage() {
  const { selectedLocationId } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const analyticsParams = useMemo(
    () => ({
      locationId: selectedLocationId ?? undefined,
      startDate: rangeStart.trim() || undefined,
      endDate: rangeEnd.trim() || undefined,
    }),
    [selectedLocationId, rangeStart, rangeEnd],
  );

  const { data: analytics, isLoading: analyticsLoading } =
    useGymOwnerAnalyticsDashboardQuery(analyticsParams);
  const { data: membersList, isLoading: membersLoading } = useMembersQuery(
    selectedLocationId || undefined,
  );
  const tableMembers = membersList ?? [];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <WelcomeMessage
            endAdornment={
              <DashboardOverviewFilters
                startDate={rangeStart}
                endDate={rangeEnd}
                onStartDateChange={setRangeStart}
                onEndDateChange={setRangeEnd}
                onClearRange={() => {
                  setRangeStart("");
                  setRangeEnd("");
                }}
              />
            }
          />
        </div>
        {analyticsLoading ? (
          <SectionCardsSkeleton />
        ) : (
          <SectionCards analytics={analytics} />
        )}
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RevenueChart filters={analyticsParams} />
            <MembersChart filters={analyticsParams} />
          </div>
        </div>
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeeklyAttendanceChart filters={analyticsParams} />
            </div>
            <div className="lg:col-span-1">
              <MembershipMixChart />
            </div>
          </div>
        </div>
        <div className="px-4 lg:px-6">
          {membersLoading ? (
            <MembersTableSkeleton />
          ) : (
            <div className="flex flex-col gap-6 !rounded-md border border-[#F4F4F4] bg-white p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-grey-900 text-lg font-semibold">Members</h2>
                <Input
                  type="text"
                  placeholder="Search by name, email..."
                  className="h-10 w-full max-w-[280px]"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <DataTable
                data={tableMembers}
                columns={membersColumns}
                searchQuery={searchQuery}
                enableTabs={false}
                enableDragAndDrop={false}
                enableColumnVisibility={false}
                enableRowSelection={false}
                getRowId={(row) => row.id}
                emptyMessage="No members found."
                defaultPageSize={7}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
