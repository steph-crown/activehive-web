import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "./dashboard-layout";
import { WelcomeMessage } from "./welcome-message";
import { SectionCards } from "./section-cards";
import { RevenueChart } from "./revenue-chart";
import { MembersChart } from "./members-chart";
import { WeeklyAttendanceChart } from "./weekly-attendance-chart";
import { MembershipMixChart } from "./membership-mix-chart";
import { useMembersQuery } from "@/features/members/services";
import { useLocationStore } from "@/store";
import { type ColumnDef } from "@tanstack/react-table";
import type { MemberSubscription } from "@/features/members/types";
import { useMemo, useState } from "react";
import {
  ChartsSkeleton,
  InsightsChartsSkeleton,
  MembersTableSkeleton,
  SectionCardsSkeleton,
} from "./dashboard-skeleton";

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

const dummyMembersData: MemberSubscription[] = [
  {
    id: "sub-001",
    memberId: "mem-001",
    member: {
      id: "mem-001",
      email: "ada.okafor@example.com",
      firstName: "Ada",
      lastName: "Okafor",
      phoneNumber: "+2348031112233",
    },
    gymId: "gym-001",
    gym: { id: "gym-001", name: "ActiveHive VI" },
    membershipPlanId: "plan-001",
    membershipPlan: { id: "plan-001", name: "Monthly", price: 45000, duration: "monthly" },
    location: { id: "loc-001", locationName: "Victoria Island" },
    type: "standard",
    status: "active",
    price: 45000,
    startDate: "2026-02-01T00:00:00.000Z",
    endDate: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
    daysRemaining: 21,
    isExpiringSoon: false,
  },
  {
    id: "sub-002",
    memberId: "mem-002",
    member: {
      id: "mem-002",
      email: "tunde.balogun@example.com",
      firstName: "Tunde",
      lastName: "Balogun",
      phoneNumber: "+2348094447788",
    },
    gymId: "gym-001",
    gym: { id: "gym-001", name: "ActiveHive VI" },
    membershipPlanId: "plan-002",
    membershipPlan: { id: "plan-002", name: "Quarterly", price: 120000, duration: "quarterly" },
    location: { id: "loc-002", locationName: "Lekki" },
    type: "premium",
    status: "pending",
    price: 120000,
    startDate: "2026-01-11T00:00:00.000Z",
    endDate: "2026-04-11T00:00:00.000Z",
    createdAt: "2026-01-11T00:00:00.000Z",
    updatedAt: "2026-01-11T00:00:00.000Z",
    daysRemaining: 38,
    isExpiringSoon: false,
  },
  {
    id: "sub-003",
    memberId: "mem-003",
    member: {
      id: "mem-003",
      email: "chika.nwosu@example.com",
      firstName: "Chika",
      lastName: "Nwosu",
      phoneNumber: "+2348162229191",
    },
    gymId: "gym-001",
    gym: { id: "gym-001", name: "ActiveHive VI" },
    membershipPlanId: "plan-003",
    membershipPlan: { id: "plan-003", name: "Weekly", price: 15000, duration: "weekly" },
    location: { id: "loc-003", locationName: "Yaba" },
    type: "trial",
    status: "inactive",
    price: 15000,
    startDate: "2025-12-28T00:00:00.000Z",
    endDate: "2026-01-04T00:00:00.000Z",
    createdAt: "2025-12-28T00:00:00.000Z",
    updatedAt: "2026-01-04T00:00:00.000Z",
    daysRemaining: 0,
    isExpiringSoon: true,
  },
];

export function DashboardPage() {
  const { selectedLocationId } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoading } = useMembersQuery(
    selectedLocationId || undefined,
  );
  const tableMembers = useMemo(() => dummyMembersData, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <WelcomeMessage />
        {isLoading ? <SectionCardsSkeleton /> : <SectionCards />}
        <div className="px-4 lg:px-6">
          {isLoading ? (
            <ChartsSkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RevenueChart />
              <MembersChart />
            </div>
          )}
        </div>
        <div className="px-4 lg:px-6">
          {isLoading ? (
            <InsightsChartsSkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <WeeklyAttendanceChart />
              </div>
              <div className="lg:col-span-1">
                <MembershipMixChart />
              </div>
            </div>
          )}
        </div>
        <div className="px-4 lg:px-6">
          {isLoading ? (
            <MembersTableSkeleton />
          ) : (
            <div className="flex flex-col gap-6 rounded-xl border border-[#F4F4F4] bg-white p-8">
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
