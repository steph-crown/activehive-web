import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockLoader } from "@/components/loader/block-loader";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DataTable } from "@/components/molecules/data-table";
import { CreateMembershipPlanModal } from "./create-membership-plan-modal";
import { useMembershipPlansQuery } from "../services";
import type { MembershipPlan } from "../types";
import { type ColumnDef } from "@tanstack/react-table";

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
          ${price.toFixed(2)} / {row.original.duration}
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
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: plans, isLoading } = useMembershipPlansQuery();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Membership Plans</h1>
            <p className="text-muted-foreground mt-2">
              Manage your gym membership plans and pricing.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={plans || []}
              columns={membershipPlanColumns}
              getRowId={(row) => row.id}
              emptyMessage="No membership plans found."
              toolbar={
                <Button variant="outline" size="sm">
                  <IconPlus />
                  <span className="hidden lg:inline">Add Plan</span>
                </Button>
              }
            />
          )}
        </div>
      </div>

      <CreateMembershipPlanModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </DashboardLayout>
  );
}
