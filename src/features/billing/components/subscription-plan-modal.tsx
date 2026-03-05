import { useMemo, type FC } from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  GymOwnerSubscriptionPlan,
  GymOwnerSubscriptionPlansResponse,
  MySubscriptionResponse,
} from "../types";
import { useGymOwnerPlansQuery, useSwitchPlanMutation } from "../services";
import { BlockLoader } from "@/components/loader/block-loader";
import { useToast } from "@/hooks/use-toast";

type SubscriptionPlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: MySubscriptionResponse | undefined;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount / 100 || amount);

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

const FreeTrialCard: FC<{ readonly daysRemaining: number }> = ({
  daysRemaining,
}) => {
  const features = [
    "Full access during trial period",
    "Explore all core gym management features",
    "Add locations, staff, and members",
  ];

  return (
    <Card className="relative flex h-full flex-col justify-between border border-primary ring-2 ring-primary/30">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold">Free Trial</CardTitle>
          <Badge variant="outline" className="text-xs">
            Current plan
          </Badge>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">Free</span>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          You&apos;re currently on a free trial. Choose a paid plan to keep
          using ActiveHive after your trial ends.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <Badge variant="secondary" className="mt-2 text-xs">
          {daysRemaining} day{daysRemaining === 1 ? "" : "s"} remaining in trial
        </Badge>
        <div className="mt-4 flex">
          <Button className="w-full" variant="outline" disabled>
            Current plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SubscriptionPlanModal: FC<
  Readonly<SubscriptionPlanModalProps>
> = ({ open, onOpenChange, subscription }) => {
  const { data, isLoading, error } = useGymOwnerPlansQuery();
  const { switchPlan, isPending } = useSwitchPlanMutation();
  const { showError, showSuccess } = useToast();

  const plans = useMemo(() => getPlansFromResponse(data), [data]);

  const currentPlanId = getCurrentPlanId(subscription);
  const showFreeTrialCard = isTrialWithoutPlan(subscription);

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
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Adjust your plan
          </DialogTitle>
          <DialogDescription className="mt-1">
            Current plan:{" "}
            <span className="font-medium">{currentPlanLabel}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <BlockLoader />
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {showFreeTrialCard && (
              <FreeTrialCard
                daysRemaining={subscription?.daysRemaining ?? 0}
              />
            )}
            {plans.map((plan) => {
              let isCurrent = false;
              if (currentPlanId) {
                isCurrent = plan.id === currentPlanId;
              }

              const isFree = plan.price === 0;

              return (
                <Card
                  key={plan.id}
                  className={`relative flex h-full flex-col justify-between border ${
                    isCurrent ? "border-primary ring-2 ring-primary/30" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <CardTitle className="text-xl font-semibold">
                        {plan.name}
                      </CardTitle>
                      {isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          Current plan
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {isFree ? "Free" : formatCurrency(plan.price)}
                      </span>
                      {!isFree && (
                        <span className="text-muted-foreground text-sm">
                          /{plan.billingPeriod}
                        </span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="text-muted-foreground mt-2 text-sm">
                        {plan.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.trialDays > 0 && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {plan.trialDays}-day free trial
                      </Badge>
                    )}

                    <div className="mt-4 flex">
                      <Button
                        className="w-full"
                        variant={isCurrent ? "outline" : "default"}
                        disabled={isCurrent || isPending}
                        onClick={() => handleChoosePlan(plan)}
                      >
                        {isCurrent ? "Current plan" : "Choose plan"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
