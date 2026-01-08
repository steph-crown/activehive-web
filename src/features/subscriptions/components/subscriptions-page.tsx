import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { type ColumnDef } from "@tanstack/react-table";
import { useSubscriptionsQuery } from "../services";
import type { Subscription } from "../types";

const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "member.firstName",
    header: "Member",
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
    accessorKey: "membershipPlan.name",
    header: "Plan Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.membershipPlan.name}</div>
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
          : status === "cancelled"
          ? "destructive"
          : "secondary";
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("price") as number;
      return (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "daysRemaining",
    header: "Days Remaining",
    cell: ({ row }) => {
      const days = row.original.daysRemaining;
      const isExpiringSoon = row.original.isExpiringSoon;
      return (
        <div className={isExpiringSoon ? "text-orange-600 font-medium" : ""}>
          {days}
        </div>
      );
    },
  },
];

export function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useSubscriptionsQuery();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Subscriptions</h1>
            <p className="text-muted-foreground mt-2">
              Manage your gym subscriptions and billing.
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
              data={subscriptions || []}
              columns={subscriptionColumns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No subscriptions found."
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
