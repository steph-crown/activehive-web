import { useEffect, useMemo, useState, type FC } from "react";
import { Check, ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  GymOwnerSubscriptionPlan,
  GymOwnerSubscriptionPlansResponse,
  MySubscriptionResponse,
} from "../types";
import { useGymOwnerPlansQuery, useSwitchPlanMutation } from "../services";
import { useToast } from "@/hooks/use-toast";

type SubscriptionPlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: MySubscriptionResponse | undefined;
};

const FREE_TRIAL_ROW_ID = "__free_trial__";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount / 100 || amount);

const formatBillingPeriodLabel = (period: string) => period.replace(/_/g, " ");

const getCurrentPlanId = (subscription?: MySubscriptionResponse | undefined) =>
  subscription?.subscription.platformPlanId ?? null;

const isTrialWithoutPlan = (
  subscription?: MySubscriptionResponse | undefined,
) =>
  !!subscription &&
  !subscription.subscription.platformPlanId &&
  subscription.isTrial;

const getPlansFromResponse = (
  data: GymOwnerSubscriptionPlansResponse | undefined,
) => data?.plans ?? [];

type FreeTrialPlanRowProps = {
  readonly daysRemaining: number;
  readonly expanded: boolean;
  readonly onExpandedChange: (open: boolean) => void;
};

const FreeTrialPlanRow: FC<FreeTrialPlanRowProps> = ({
  daysRemaining,
  expanded,
  onExpandedChange,
}) => {
  const features = [
    "Full access during trial period",
    "Explore all core gym management features",
    "Add locations, staff, and members",
  ];

  return (
    <Card
      className={cn(
        "w-full overflow-hidden border shadow-none !py-0",
        "border-primary ring-2 ring-primary/30",
      )}
    >
      <Collapsible open={expanded} onOpenChange={onExpandedChange}>
        <div className="flex items-start gap-2 p-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="hover:bg-muted/60 flex min-w-0 flex-1 items-start gap-3 rounded-md py-0.5 pr-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronDown
                className={cn(
                  "text-muted-foreground mt-0.5 size-5 shrink-0 transition-transform duration-200",
                  expanded && "rotate-180",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold">Free trial</span>
                  <Badge variant="outline" className="text-xs">
                    Current plan
                  </Badge>
                </div>
                <p className="text-lg font-semibold">Free</p>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  Full platform access until your trial ends — then choose a
                  paid plan to continue.
                </p>
                {!expanded && (
                  <p className="text-muted-foreground text-xs">
                    {daysRemaining} day{daysRemaining === 1 ? "" : "s"} left ·{" "}
                    {features.length} benefits — tap to see all
                  </p>
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-0.5 shrink-0"
            disabled
          >
            Current plan
          </Button>
        </div>

        <CollapsibleContent className="overflow-hidden">
          <div className="border-t border-[#F4F4F4] px-4 pt-3 pb-4 pl-[3.25rem]">
            <ul className="space-y-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <Check className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Badge variant="secondary" className="mt-3 text-xs">
              {daysRemaining} day{daysRemaining === 1 ? "" : "s"} remaining in
              trial
            </Badge>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

type PaidPlanRowProps = {
  readonly plan: GymOwnerSubscriptionPlan;
  readonly isCurrent: boolean;
  readonly isPending: boolean;
  readonly expanded: boolean;
  readonly onExpandedChange: (open: boolean) => void;
  readonly onSelect: () => void;
};

const PaidPlanRow: FC<PaidPlanRowProps> = ({
  plan,
  isCurrent,
  isPending,
  expanded,
  onExpandedChange,
  onSelect,
}) => {
  const isFree = plan.price === 0;
  const priceLine = isFree
    ? "Free"
    : `${formatCurrency(plan.price)} / ${formatBillingPeriodLabel(plan.billingPeriod)}`;

  const teaser =
    plan.description?.trim() ||
    (plan.features.length > 0
      ? `${plan.features.length} feature${plan.features.length === 1 ? "" : "s"} included`
      : "Paid plan for your gym");

  return (
    <Card
      className={cn(
        "w-full overflow-hidden border shadow-none !py-0",
        isCurrent && "border-primary ring-2 ring-primary/30",
      )}
    >
      <Collapsible open={expanded} onOpenChange={onExpandedChange}>
        <div className="flex items-start gap-2 p-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="hover:bg-muted/60 flex min-w-0 flex-1 items-start gap-3 rounded-md py-0.5 pr-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronDown
                className={cn(
                  "text-muted-foreground mt-0.5 size-5 shrink-0 transition-transform duration-200",
                  expanded && "rotate-180",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold">{plan.name}</span>
                  {isCurrent && (
                    <Badge variant="outline" className="text-xs">
                      Current plan
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-semibold">{priceLine}</p>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {teaser}
                </p>
                {!expanded && plan.trialDays > 0 && (
                  <p className="text-muted-foreground text-xs">
                    Includes {plan.trialDays}-day free trial · expand for full
                    details
                  </p>
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          <Button
            type="button"
            size="sm"
            className="mt-0.5 shrink-0"
            variant={isCurrent ? "outline" : "default"}
            disabled={isCurrent || isPending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void onSelect();
            }}
          >
            {isCurrent ? "Current plan" : "Select"}
          </Button>
        </div>

        <CollapsibleContent className="overflow-hidden">
          <div className="border-t border-[#F4F4F4] px-4 pt-3 pb-4 pl-[3.25rem]">
            {plan.description?.trim() && (
              <p className="text-muted-foreground mb-3 text-sm">
                {plan.description.trim()}
              </p>
            )}
            {plan.features.length > 0 ? (
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <Check className="text-primary mt-0.5 size-4 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No feature list provided for this plan.
              </p>
            )}
            {plan.trialDays > 0 && (
              <Badge variant="secondary" className="mt-3 text-xs">
                {plan.trialDays}-day free trial
              </Badge>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export const SubscriptionPlanModal: FC<
  Readonly<SubscriptionPlanModalProps>
> = ({ open, onOpenChange, subscription }) => {
  const { data, isLoading, error } = useGymOwnerPlansQuery();
  const { switchPlan, isPending } = useSwitchPlanMutation();
  const { showError, showSuccess } = useToast();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setExpandedId(null);
  }, [open]);

  const plans = useMemo(() => getPlansFromResponse(data), [data]);

  const currentPlanId = getCurrentPlanId(subscription);
  const showFreeTrialCard = isTrialWithoutPlan(subscription);

  const setPlanExpanded = (id: string, next: boolean) => {
    setExpandedId(next ? id : null);
  };

  const handleChoosePlan = async (plan: GymOwnerSubscriptionPlan) => {
    if (!subscription?.subscription.id) {
      showError(
        "Unable to change plan",
        "We could not determine your current subscription. Please refresh and try again.",
      );
      return;
    }

    try {
      await switchPlan({
        subscriptionId: subscription.subscription.id,
        newPlanId: plan.id,
      });
      showSuccess("Plan updated", "Your subscription plan has been updated.");
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update subscription plan.";
      showError("Error", message);
    }
  };

  const currentPlanLabel = subscription?.subscription.plan ?? "Free Trial";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,720px)] !max-w-lg flex-col gap-0 p-0 sm:!max-w-xl">
        <DialogHeader className="shrink-0 space-y-1 border-b border-[#F4F4F4] px-6 py-4 text-left">
          <DialogTitle className="font-heading text-2xl font-semibold tracking-wide uppercase">
            Adjust your plan
          </DialogTitle>
          <DialogDescription className="text-left">
            Current plan:{" "}
            <span className="font-medium text-foreground">
              {currentPlanLabel}
            </span>
          </DialogDescription>
          <p className="text-muted-foreground pt-1 text-xs">
            Tap a row to expand features. Use{" "}
            <span className="font-medium">Select</span> to switch plans.
          </p>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {isLoading && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Card
                  key={`plans-skeleton-${idx}`}
                  className="shadow-none border-[#F4F4F4]"
                >
                  <div className="flex items-start gap-3 p-4">
                    <Skeleton className="mt-1 size-5 shrink-0 rounded" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-9 w-20 shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && error && (
            <p className="text-destructive text-sm">
              Failed to load plans. Please try again later.
            </p>
          )}
          {!isLoading && !error && plans.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No subscription plans are currently available.
            </p>
          )}
          {!isLoading && !error && plans.length > 0 && (
            <div className="flex flex-col gap-4">
              {showFreeTrialCard && (
                <FreeTrialPlanRow
                  daysRemaining={subscription?.daysRemaining ?? 0}
                  expanded={expandedId === FREE_TRIAL_ROW_ID}
                  onExpandedChange={(next) =>
                    setPlanExpanded(FREE_TRIAL_ROW_ID, next)
                  }
                />
              )}
              {plans.map((plan) => {
                const isCurrent = Boolean(
                  currentPlanId && plan.id === currentPlanId,
                );

                return (
                  <PaidPlanRow
                    key={plan.id}
                    plan={plan}
                    isCurrent={isCurrent}
                    isPending={isPending}
                    expanded={expandedId === plan.id}
                    onExpandedChange={(next) => setPlanExpanded(plan.id, next)}
                    onSelect={() => void handleChoosePlan(plan)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
