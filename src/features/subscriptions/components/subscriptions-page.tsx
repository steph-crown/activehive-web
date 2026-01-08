import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
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
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
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
  const [localLocationId, setLocalLocationId] = React.useState<
    string | undefined
  >(undefined);
  const { selectedLocationId } = useLocationStore();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  // Use global location if set, otherwise use local filter
  const effectiveLocationId = selectedLocationId || localLocationId;

  // Filter subscriptions client-side based on location
  const { data: allSubscriptions, isLoading } = useSubscriptionsQuery();

  const subscriptions = React.useMemo(() => {
    if (!allSubscriptions) return [];
    if (!effectiveLocationId) return allSubscriptions;
    return allSubscriptions.filter(
      (sub) => sub.location.id === effectiveLocationId
    );
  }, [allSubscriptions, effectiveLocationId]);

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
                Location filter is controlled globally from the sidebar
              </p>
            )}
          </div>

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
