import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconMapPin,
  IconDotsVertical,
  IconUsers,
  IconCircleCheck,
  IconCurrencyNaira,
  IconChartBar,
} from "@tabler/icons-react";
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
import { SummaryMetricCard } from "@/features/dashboard/components/summary-metric-card";

const createSubscriptionColumns = (
  navigate: (path: string) => void,
  onUpdateStatus: (subscription: Subscription) => void,
  onCancel: (subscription: Subscription) => void,
  onChangePlan: (subscription: Subscription) => void,
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
            currency: "NGN",
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
    (loc) => loc.id === selectedLocationId,
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
        handleChangePlan,
      ),
    [navigate],
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold">Subscriptions</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your gym subscriptions and billing.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {[
              "stats-card-skeleton-0",
              "stats-card-skeleton-1",
              "stats-card-skeleton-2",
              "stats-card-skeleton-3",
            ].map((key) => (
              <Card
                key={key}
                className="gap-0 border border-[#F4F4F4] bg-white p-0 shadow-none"
              >
                <div className="p-5">
                  <Skeleton className="mb-5 h-12 w-12 rounded-[10px]" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="mt-3 h-8 w-28" />
                </div>
              </Card>
            ))}
          </div>
        ) : statistics ? (
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <SummaryMetricCard
              title="Total Subscriptions"
              value={`${statistics.total}`}
              icon={<IconUsers className="size-6" stroke={1.8} />}
              valueColorClass="text-[#7E52FF]"
              iconBgClass="bg-[#F2EEFF]"
              iconColorClass="text-[#7E52FF]"
              hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]"
            />
            <SummaryMetricCard
              title="Active"
              value={`${statistics.active}`}
              icon={<IconCircleCheck className="size-6" stroke={1.8} />}
              valueColorClass="text-[#4342FF]"
              iconBgClass="bg-[#ECECFF]"
              iconColorClass="text-[#4342FF]"
              hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]"
            />
            <SummaryMetricCard
              title="Total Revenue"
              value={new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "NGN",
              }).format(statistics.totalRevenue)}
              icon={<IconCurrencyNaira className="size-6" stroke={1.8} />}
              valueColorClass="text-[#FF5B04]"
              iconBgClass="bg-[#FFEFE6]"
              iconColorClass="text-[#FF5B04]"
              hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]"
            />
            <SummaryMetricCard
              title="Monthly Revenue"
              value={new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "NGN",
              }).format(statistics.monthlyRevenue)}
              icon={<IconChartBar className="size-6" stroke={1.8} />}
              valueColorClass="text-[#D32F2F]"
              iconBgClass="bg-[#FBEAEA]"
              iconColorClass="text-[#D32F2F]"
              hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]"
            />
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

          <DataTable
            data={subscriptions || []}
            columns={columns}
            enableTabs={false}
            getRowId={(row) => row.id}
            emptyMessage="No subscriptions found."
            isLoading={isLoading}
          />
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
        onSuccess={handleActionSuccess}
      />
    </DashboardLayout>
  );
}
