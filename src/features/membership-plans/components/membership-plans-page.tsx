import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useMembershipPlansQuery } from "../services";
import type { MembershipPlan } from "../types";
import { CreateMembershipPlanModal } from "./create-membership-plan-modal";
import {
  AddPromoCodeModal,
  DeleteMembershipPlanModal,
  DuplicateMembershipPlanModal,
  UpdateMembershipPlanModal,
} from "./membership-plan-action-modals";

const membershipPlanColumns: ColumnDef<MembershipPlan>[] = [
  {
    accessorKey: "name",
    header: "Plan Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "location.locationName",
    header: "Location",
    cell: ({ row }) => row.original.location.locationName,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-md truncate text-sm text-muted-foreground">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <div className="text-right font-medium">
          ₦{price.toFixed(2)} / {row.original.duration}
        </div>
      );
    },
  },
  {
    accessorKey: "features",
    header: "Features",
    cell: ({ row }) => {
      const features = row.getValue("features") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {features.slice(0, 2).map((feature, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {features.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{features.length - 2} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
];

export function MembershipPlansPage() {
  const navigate = useNavigate();
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

  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const effectiveLocationId =
    locationFilter === "all" ? undefined : locationFilter;

  const { data: plans, isLoading } =
    useMembershipPlansQuery(effectiveLocationId);

  const handleActionSuccess = () => {
    setIsUpdateOpen(false);
    setIsDeleteOpen(false);
    setIsDuplicateOpen(false);
    setIsAddPromoCodeOpen(false);
    setSelectedPlan(null);
  };

  const actionsColumn: ColumnDef<MembershipPlan> = React.useMemo(
    () => ({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <IconDotsVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/dashboard/membership-plans/${plan.id}`)
                  }
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
        );
      },
    }),
    [navigate],
  );

  const columnsWithActions = React.useMemo(
    () => [...membershipPlanColumns, actionsColumn],
    [actionsColumn],
  );

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

          <DataTable
            data={filteredPlans}
            columns={columnsWithActions}
            getRowId={(row) => row.id}
            enableTabs={false}
            emptyMessage="No membership plans found."
            isLoading={isLoading}
          />
        </div>
      </div>

      <CreateMembershipPlanModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
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
    </DashboardLayout>
  );
}
