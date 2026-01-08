import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconFilter, IconX } from "@tabler/icons-react";
import * as React from "react";
import type { SubscriptionsFilters } from "../types";
import { SUBSCRIPTION_STATUS, type SubscriptionStatus } from "../types";
import type { MembershipPlan } from "@/features/membership-plans/types";
import { useMembersQuery } from "@/features/members/services";

interface SubscriptionsFiltersPanelProps {
  filters: SubscriptionsFilters;
  onFiltersChange: (filters: SubscriptionsFilters) => void;
  membershipPlans: MembershipPlan[];
}

export function SubscriptionsFiltersPanel({
  filters,
  onFiltersChange,
  membershipPlans,
}: SubscriptionsFiltersPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localFilters, setLocalFilters] =
    React.useState<SubscriptionsFilters>(filters);
  const { data: members, isLoading: membersLoading } = useMembersQuery();

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared: SubscriptionsFilters = {
      page: 1,
      limit: 20,
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
    setIsOpen(false);
  };

  const hasActiveFilters = Boolean(
    filters.status ||
      filters.membershipPlanId ||
      filters.memberId ||
      filters.search ||
      filters.startDateFrom ||
      filters.startDateTo ||
      filters.endDateFrom ||
      filters.endDateTo
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconFilter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-1.5 py-0.5 text-xs w-5 h-5">
              {
                [
                  filters.status,
                  filters.membershipPlanId,
                  filters.memberId,
                  filters.search,
                  filters.startDateFrom,
                  filters.startDateTo,
                  filters.endDateFrom,
                  filters.endDateTo,
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Subscriptions</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={localFilters.status || "all"}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    status:
                      value === "all"
                        ? undefined
                        : (value as SubscriptionStatus),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.ACTIVE}>
                    Active
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.EXPIRED}>
                    Expired
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.CANCELLED}>
                    Cancelled
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.PENDING}>
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Membership Plan
              </label>
              <Select
                value={localFilters.membershipPlanId || "all"}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    membershipPlanId: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {membershipPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              placeholder="Search by member name or email"
              value={localFilters.search || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  search: e.target.value || undefined,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Member</label>
            <Select
              value={localFilters.memberId || "all"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  memberId: value === "all" ? undefined : value,
                }))
              }
              disabled={membersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {members?.map((member) => (
                  <SelectItem key={member.member.id} value={member.member.id}>
                    {member.member.firstName} {member.member.lastName} (
                    {member.member.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Start Date From
              </label>
              <Input
                type="date"
                value={localFilters.startDateFrom || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    startDateFrom: e.target.value || undefined,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Start Date To
              </label>
              <Input
                type="date"
                value={localFilters.startDateTo || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    startDateTo: e.target.value || undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                End Date From
              </label>
              <Input
                type="date"
                value={localFilters.endDateFrom || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    endDateFrom: e.target.value || undefined,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                End Date To
              </label>
              <Input
                type="date"
                value={localFilters.endDateTo || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    endDateTo: e.target.value || undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClear}>
              <IconX className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
