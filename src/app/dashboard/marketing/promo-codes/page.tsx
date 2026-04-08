import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleStyleTablePage } from "@/components/molecules/schedule-style-table-page";
import {
  AddPromoCodeModal,
  RemovePromoCodeModal,
  TogglePromoCodeModal,
} from "@/features/membership-plans/components/membership-plan-action-modals";
import {
  useMembershipPlansQuery,
  usePromoCodesCatalogQuery,
  type PromoCodeCatalogRow,
} from "@/features/membership-plans/services";
import type { MembershipPlanWithPromoCodes } from "@/features/membership-plans/types";

export default function Page() {
  const [addOpen, setAddOpen] = useState(false);
  const [toggleCtx, setToggleCtx] = useState<{
    plan: MembershipPlanWithPromoCodes;
    code: string;
    currentStatus: boolean;
  } | null>(null);
  const [removeCtx, setRemoveCtx] = useState<{
    plan: MembershipPlanWithPromoCodes;
    code: string;
  } | null>(null);

  const { data: plans, isLoading: plansLoading } = useMembershipPlansQuery();
  const planList = plans ?? [];
  const canAddPromo = !plansLoading && planList.length > 0;

  const { rows: catalogRows, isLoading: catalogLoading } =
    usePromoCodesCatalogQuery();

  const columns = useMemo<ColumnDef<PromoCodeCatalogRow>[]>(
    () => [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "planName", header: "Plan" },
      { accessorKey: "typeLabel", header: "Type" },
      { accessorKey: "valueDisplay", header: "Value" },
      { accessorKey: "usesDisplay", header: "Uses" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let variant: "default" | "secondary" | "destructive" = "destructive";
          if (status === "active") {
            variant = "default";
          } else if (status === "inactive") {
            variant = "secondary";
          }
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      { accessorKey: "expiresDisplay", header: "Expires" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const { plan, promo } = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Open actions"
                >
                  <IconDotsVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() =>
                    setToggleCtx({
                      plan,
                      code: promo.code,
                      currentStatus: promo.isActive,
                    })
                  }
                >
                  {promo.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setRemoveCtx({ plan, code: promo.code })}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const closeToggle = () => setToggleCtx(null);
  const closeRemove = () => setRemoveCtx(null);

  return (
    <>
      <ScheduleStyleTablePage
        title="Promo Codes"
        description="Manage promotional discount codes."
        columns={columns}
        data={catalogRows}
        emptyMessage="No promo codes found."
        isLoading={catalogLoading}
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
      <TogglePromoCodeModal
        open={toggleCtx !== null}
        onOpenChange={(open) => {
          if (!open) closeToggle();
        }}
        plan={toggleCtx?.plan ?? null}
        promoCode={toggleCtx?.code ?? ""}
        currentStatus={toggleCtx?.currentStatus ?? false}
        onSuccess={closeToggle}
      />
      <RemovePromoCodeModal
        open={removeCtx !== null}
        onOpenChange={(open) => {
          if (!open) closeRemove();
        }}
        plan={removeCtx?.plan ?? null}
        promoCode={removeCtx?.code ?? ""}
        onSuccess={closeRemove}
      />
    </>
  );
}
