import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconMapPin, IconDotsVertical } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useMembershipPlansQuery } from "@/features/membership-plans/services";
import { useLocationStore } from "@/store";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import {
  useSubscriptionsQuery,
  useSubscriptionStatisticsQuery,
} from "../services";
import type { Subscription, SubscriptionsFilters } from "../types";
import { SUBSCRIPTION_STATUS } from "../types";
import { SubscriptionsFiltersPanel } from "./subscriptions-filters-panel";
import {
  UpdateSubscriptionStatusModal,
  CancelSubscriptionModal,
  ChangeSubscriptionPlanModal,
} from "./subscription-action-modals";

const createSubscriptionColumns = (
  navigate: (path: string) => void,
  onUpdateStatus: (subscription: Subscription) => void,
  onCancel: (subscription: Subscription) => void,
  onChangePlan: (subscription: Subscription) => void
): ColumnDef<Subscription>[] => [
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
        status === SUBSCRIPTION_STATUS.ACTIVE
          ? "default"
          : status === SUBSCRIPTION_STATUS.CANCELLED
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
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const subscription = row.original;
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
            <DropdownMenuItem
              onClick={() =>
                navigate(`/dashboard/subscriptions/${subscription.id}`)
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(subscription)}>
              Update Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChangePlan(subscription)}>
              Change Plan
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onCancel(subscription)}
            >
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function SubscriptionsPage() {
  const navigate = useNavigate();
  const [localLocationId, setLocalLocationId] = React.useState<
    string | undefined
  >(undefined);
  const [filters, setFilters] = React.useState<SubscriptionsFilters>({
    page: 1,
    limit: 20,
  });
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<Subscription | null>(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = React.useState(false);

  const { selectedLocationId } = useLocationStore();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { data: membershipPlans } = useMembershipPlansQuery();

  // Use global location if set, otherwise use local filter
  const effectiveLocationId = selectedLocationId || localLocationId;

  const selectedLocation = locations?.find(
    (loc) => loc.id === selectedLocationId
  );

  // Build filters with location
  const queryFilters: SubscriptionsFilters = React.useMemo(() => {
    const baseFilters = { ...filters };
    if (effectiveLocationId) {
      baseFilters.locationId = effectiveLocationId;
    }
    return baseFilters;
  }, [filters, effectiveLocationId]);

  const { data: subscriptions, isLoading } =
    useSubscriptionsQuery(queryFilters);
  const { data: statistics, isLoading: statsLoading } =
    useSubscriptionStatisticsQuery(effectiveLocationId);

  const handleUpdateStatus = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsUpdateStatusOpen(true);
  };

  const handleCancel = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsCancelOpen(true);
  };

  const handleChangePlan = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsChangePlanOpen(true);
  };

  const handleActionSuccess = () => {
    setIsUpdateStatusOpen(false);
    setIsCancelOpen(false);
    setIsChangePlanOpen(false);
    setSelectedSubscription(null);
  };

  const columns = React.useMemo(
    () =>
      createSubscriptionColumns(
        navigate,
        handleUpdateStatus,
        handleCancel,
        handleChangePlan
      ),
    [navigate]
  );

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

        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-10">
            <BlockLoader />
          </div>
        ) : statistics ? (
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Subscriptions</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {statistics.total}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Active</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {statistics.active}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(statistics.totalRevenue)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Monthly Revenue</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(statistics.monthlyRevenue)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        ) : null}

        <div className="px-4 lg:px-6">
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            {selectedLocationId && selectedLocation ? (
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <IconMapPin className="h-4 w-4" />
                <span>{selectedLocation.locationName}</span>
              </div>
            ) : (
              <div className="w-max">
                <Select
                  value={localLocationId || "all"}
                  onValueChange={(value) => {
                    const newLocationId = value === "all" ? undefined : value;
                    setLocalLocationId(newLocationId);
                    setFilters((prev) => ({
                      ...prev,
                      locationId: newLocationId,
                    }));
                  }}
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
            <SubscriptionsFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              membershipPlans={membershipPlans || []}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={subscriptions || []}
              columns={columns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No subscriptions found."
            />
          )}
        </div>
      </div>

      <UpdateSubscriptionStatusModal
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        subscription={selectedSubscription}
        onSuccess={handleActionSuccess}
      />

      <CancelSubscriptionModal
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        subscription={selectedSubscription}
        onSuccess={handleActionSuccess}
      />

      <ChangeSubscriptionPlanModal
        open={isChangePlanOpen}
        onOpenChange={setIsChangePlanOpen}
        subscription={selectedSubscription}
        membershipPlans={membershipPlans || []}
        onSuccess={handleActionSuccess}
      />
    </DashboardLayout>
  );
}
