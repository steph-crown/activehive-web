import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  useActivePlatformPlansQuery,
  useSubscribeToPlatformPlanMutation,
} from "../services/queries";
import type { PlatformPlan } from "../types";

type SubscriptionPlanPickerModalProps = {
  onSubscribed: () => void;
};

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: PlatformPlan;
  selected: boolean;
  onSelect: () => void;
}) {
  const price = Number(plan.price);
  const priceDisplay = Number.isFinite(price)
    ? `₦${price.toLocaleString()}`
    : String(plan.price);
  const features = plan.features ?? [];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-xl border-2 p-6 text-left transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40",
      )}
    >
      {plan.isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most popular
        </Badge>
      )}
      {selected && (
        <CheckCircle2 className="text-primary absolute right-4 top-4 size-5" />
      )}
      <div className="mb-2">
        <h3 className="text-base font-bold">{plan.name}</h3>
        {plan.description && (
          <p className="text-muted-foreground mt-0.5 text-sm">
            {plan.description}
          </p>
        )}
      </div>
      <div className="mb-4">
        <span className="text-2xl font-bold">{priceDisplay}</span>
        <span className="text-muted-foreground text-sm">
          /{plan.billingPeriod ?? "month"}
        </span>
      </div>
      {plan.trialDays && plan.trialDays > 0 ? (
        <p className="text-primary mb-3 text-xs font-medium">
          {plan.trialDays}-day free trial included
        </p>
      ) : null}
      {features.length > 0 && (
        <ul className="space-y-1.5">
          {features.slice(0, 5).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
              {f}
            </li>
          ))}
          {features.length > 5 && (
            <li className="text-muted-foreground text-xs">
              +{features.length - 5} more
            </li>
          )}
        </ul>
      )}
    </button>
  );
}

export function SubscriptionPlanPickerModal({
  onSubscribed,
}: SubscriptionPlanPickerModalProps) {
  const { showSuccess, showError } = useToast();
  const { data: plans, isLoading } = useActivePlatformPlansQuery();
  const { mutateAsync: subscribe, isPending } =
    useSubscribeToPlatformPlanMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const selectedPlan = plans?.find((p) => p.id === selectedPlanId) ?? null;
  const isFree = selectedPlan && Number(selectedPlan.price) === 0;
  const hasTrial =
    selectedPlan &&
    selectedPlan.trialDays != null &&
    selectedPlan.trialDays > 0;

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    if (!isFree && !hasTrial) {
      showError(
        "Payment required",
        "Online payment is not available yet. Please contact support to activate your subscription.",
      );
      return;
    }

    try {
      await subscribe(selectedPlanId);
      showSuccess(
        "Subscription activated",
        hasTrial
          ? `Your ${selectedPlan!.trialDays}-day free trial has started.`
          : "Your subscription is now active.",
      );
      onSubscribed();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to subscribe.";
      showError("Error", message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-background flex max-h-screen w-full max-w-4xl flex-col overflow-y-auto rounded-2xl border shadow-2xl p-6 md:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Choose your plan</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Select a subscription plan to get started. You can change or cancel
            at any time.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <span className="text-muted-foreground text-sm">
              Loading plans…
            </span>
          </div>
        ) : !plans || plans.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <span className="text-muted-foreground text-sm">
              No plans available at this time. Please contact support.
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-4",
              plans.length === 1
                ? "max-w-sm mx-auto"
                : plans.length === 2
                  ? "sm:grid-cols-2"
                  : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlanId === plan.id}
                onSelect={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            size="lg"
            className="w-full max-w-xs"
            disabled={!selectedPlanId || isPending}
            loading={isPending}
            onClick={() => void handleContinue()}
          >
            {hasTrial
              ? `Start ${selectedPlan!.trialDays}-day free trial`
              : isFree
                ? "Get started for free"
                : "Continue"}
          </Button>
          {selectedPlan && !isFree && !hasTrial && (
            <p className="text-muted-foreground text-xs text-center max-w-xs">
              Online payment is coming soon. Contact support to activate a paid
              plan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
