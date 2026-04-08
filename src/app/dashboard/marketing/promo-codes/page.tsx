import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { IconPlus } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduleStyleTablePage } from "@/components/molecules/schedule-style-table-page";
import { AddPromoCodeModal } from "@/features/membership-plans/components/membership-plan-action-modals";
import { useMembershipPlansQuery } from "@/features/membership-plans/services";

type PromoCodeRow = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: string;
  uses: string;
  status: "active" | "expired" | "draft";
  expires: string;
  location: string;
};

const data: PromoCodeRow[] = [
  {
    id: "promo-1",
    code: "WELCOME20",
    type: "percent",
    value: "20%",
    uses: "41",
    status: "active",
    expires: "Apr 30, 2026",
    location: "Downtown",
  },
  {
    id: "promo-2",
    code: "FIT5000",
    type: "fixed",
    value: "₦5,000",
    uses: "9",
    status: "draft",
    expires: "May 12, 2026",
    location: "Westside",
  },
  {
    id: "promo-3",
    code: "JANSTART",
    type: "percent",
    value: "10%",
    uses: "67",
    status: "expired",
    expires: "Feb 01, 2026",
    location: "Downtown",
  },
];

const columns: ColumnDef<PromoCodeRow>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "value", header: "Value" },
  { accessorKey: "uses", header: "Uses" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" = "destructive";
      if (status === "active") {
        variant = "default";
      } else if (status === "draft") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { accessorKey: "expires", header: "Expires" },
];

export default function Page() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: plans, isLoading: plansLoading } = useMembershipPlansQuery();
  const planList = plans ?? [];
  const canAddPromo = !plansLoading && planList.length > 0;

  return (
    <>
      <ScheduleStyleTablePage
        title="Promo Codes"
        description="Manage promotional discount codes."
        columns={columns}
        data={data}
        emptyMessage="No promo codes found."
        headerActions={
          <Button
            disabled={!canAddPromo}
            title={
              !canAddPromo && !plansLoading
                ? "Create a membership plan under Subscriptions first"
                : undefined
            }
            onClick={() => setAddOpen(true)}
          >
            <IconPlus className="h-4 w-4" />
            Add Promo Code
          </Button>
        }
      />
      <AddPromoCodeModal
        open={addOpen}
        onOpenChange={setAddOpen}
        plan={null}
        plansForPicker={planList}
        onSuccess={() => setAddOpen(false)}
      />
    </>
  );
}

