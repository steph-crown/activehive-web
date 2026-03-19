import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
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

export function DashboardPage() {
  const { selectedLocationId } = useLocationStore();
  const { data: members, isLoading } = useMembersQuery(
    selectedLocationId || undefined,
  );

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
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Members</h2>
            <p className="text-muted-foreground text-sm mt-1">
              View all gym members
            </p>
          </div>
          {isLoading ? (
            <MembersTableSkeleton />
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
    </DashboardLayout>
  );
}
