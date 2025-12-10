import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { type ColumnDef } from "@tanstack/react-table";
import { useSubscriptionsQuery } from "../services";
import type { Subscription } from "../types";

const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "planName",
    header: "Plan Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("planName")}</div>
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
    accessorKey: "billingCycle",
    header: "Billing Cycle",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("billingCycle")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const currency = row.original.currency || "USD";
      return (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
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
    accessorKey: "nextBillingDate",
    header: "Next Billing",
    cell: ({ row }) => {
      const date = row.original.nextBillingDate;
      if (!date) return <div className="text-muted-foreground">-</div>;
      return <div>{new Date(date).toLocaleDateString()}</div>;
    },
  },
];

export function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useSubscriptionsQuery();

  void subscriptions;
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
              data={[]}
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
