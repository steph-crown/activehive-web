import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { IconCheck, IconDotsVertical, IconPlus } from "@tabler/icons-react";
import * as React from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useMembershipPlansQuery } from "../services";
import type { MembershipPlan } from "../types";
import { CreateMembershipPlanModal } from "./create-membership-plan-modal";
import {
  AddPromoCodeModal,
  DeleteMembershipPlanModal,
  DuplicateMembershipPlanModal,
  UpdateMembershipPlanModal,
} from "./membership-plan-action-modals";

function isSafeDashboardReturnPath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (path.includes("?") || path.includes("#")) return false;
  return path.startsWith("/dashboard/");
}

function formatPlanPriceNgn(amount: string | number): string {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function MembershipPlansPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("");
  const [selectedPlan, setSelectedPlan] = React.useState<MembershipPlan | null>(
    null,
  );
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = React.useState(false);
  const [isAddPromoCodeOpen, setIsAddPromoCodeOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const effectiveLocationId =
    locationFilter === "all" ? undefined : locationFilter;

  const { data: plans, isLoading } =
    useMembershipPlansQuery(effectiveLocationId);

  React.useEffect(() => {
    if (searchParams.get("createPlan") === "1") {
      setIsCreateModalOpen(true);
    }
  }, [searchParams]);

  const consumeCreatePlanDeepLink = React.useCallback(() => {
    if (searchParams.get("createPlan") !== "1") return;
    const returnTo = searchParams.get("returnTo");
    if (returnTo && isSafeDashboardReturnPath(returnTo)) {
      navigate(returnTo, { replace: true });
      return;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("createPlan");
        next.delete("returnTo");
        return next;
      },
      { replace: true },
    );
  }, [navigate, searchParams, setSearchParams]);

  const handleActionSuccess = () => {
    setIsUpdateOpen(false);
    setIsDeleteOpen(false);
    setIsDuplicateOpen(false);
    setIsAddPromoCodeOpen(false);
    setIsViewOpen(false);
    setSelectedPlan(null);
  };

  const filteredPlans = React.useMemo(() => {
    const rows = plans || [];
    return rows.filter((plan) => {
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${plan.name} ${plan.description} ${plan.location.locationName}`
          .toLowerCase()
          .includes(normalizedSearch);

      if (!dateFilter) return matchesSearch;
      const selectedDate = new Date(dateFilter).toLocaleDateString();
      const planCreatedAt = (plan as { createdAt?: string }).createdAt;
      if (!planCreatedAt) return matchesSearch;
      return (
        matchesSearch &&
        new Date(planCreatedAt).toLocaleDateString() === selectedDate
      );
    });
  }, [dateFilter, plans, searchQuery]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Membership Plans</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your gym membership plans and pricing.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 " />
            Create Plan
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <TableFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search plans..."
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

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`plan-skeleton-${idx}`}
                  className="rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none"
                >
                  <div className="mb-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-6 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No membership plans found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredPlans.map((plan) => {
                return (
                  <div
                    key={plan.id}
                    className="rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-3">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <Badge
                            variant={plan.isActive ? "default" : "secondary"}
                          >
                            {plan.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {plan.location.locationName}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>

                      <div className="mb-4 space-y-2">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <div
                            key={`${plan.id}-feature-${idx}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <IconCheck className="h-3.5 w-3.5" />
                            <span>{feature}</span>
                            {idx === 2 && plan.features.length > 3 ? (
                              <button
                                type="button"
                                className="text-xs font-medium text-primary hover:underline"
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  setIsViewOpen(true);
                                }}
                              >
                                +{plan.features.length - 3}
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xl font-semibold">
                          ₦{formatPlanPriceNgn(plan.price)}
                        </span>
                        <span className="text-xs text-black/60 capitalize">
                          {plan.duration}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <IconDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsViewOpen(true);
                            }}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsUpdateOpen(true);
                            }}
                          >
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsDuplicateOpen(true);
                            }}
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsAddPromoCodeOpen(true);
                            }}
                          >
                            Add Promo Code
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsDeleteOpen(true);
                            }}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CreateMembershipPlanModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            consumeCreatePlanDeepLink();
          }
        }}
      />

      <UpdateMembershipPlanModal
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        plan={selectedPlan}
        onSuccess={handleActionSuccess}
      />

      <DeleteMembershipPlanModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        plan={selectedPlan}
        onSuccess={handleActionSuccess}
      />

      <DuplicateMembershipPlanModal
        open={isDuplicateOpen}
        onOpenChange={setIsDuplicateOpen}
        plan={selectedPlan}
        onSuccess={handleActionSuccess}
      />

      <AddPromoCodeModal
        open={isAddPromoCodeOpen}
        onOpenChange={setIsAddPromoCodeOpen}
        plan={selectedPlan}
        onSuccess={handleActionSuccess}
      />

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPlan?.name || "Plan Details"}</DialogTitle>
            <DialogDescription>
              Membership plan overview and benefits.
            </DialogDescription>
          </DialogHeader>

          {selectedPlan ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm">{selectedPlan.location.locationName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{selectedPlan.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-sm">
                    ₦{formatPlanPriceNgn(selectedPlan.price)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm capitalize">{selectedPlan.duration}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Benefits</p>
                <ul className="space-y-1.5">
                  {selectedPlan.features.map((feature, idx) => (
                    <li
                      key={`${selectedPlan.id}-benefit-${idx}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <IconCheck className="h-3.5 w-3.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
