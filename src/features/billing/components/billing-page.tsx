import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import {
  formatBillingDate,
  formatMonthlyPriceNgn,
  getSubscriptionStatusBadgeVariant,
} from "../lib/billing-display";
import { useMySubscriptionQuery } from "../services";
import { BillingTabPanels } from "./billing-tab-panels";
import { SubscriptionPlanModal } from "./subscription-plan-modal";

const TAB_ITEMS = [
  { value: "overview", label: "Overview" },
  { value: "plan-dates", label: "Plan & dates" },
  { value: "organization", label: "Organization" },
] as const;

export function BillingPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMySubscriptionQuery();
  const subscriptionData = data;
  const errorMessage = error ? error.message : null;
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between gap-4 px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Billing</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isLoading
                ? "Loading subscription…"
                : "Subscription, renewal dates, and account details"}
            </p>
          </div>
          {subscriptionData && (
            <Button variant="outline" onClick={() => setIsPlanModalOpen(true)}>
              Change plan
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
            <Card className="rounded-md border-[#F4F4F4] p-6 shadow-none">
              <Skeleton className="mb-4 h-6 w-40" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
            <Card className="rounded-md border-[#F4F4F4] p-6 shadow-none">
              <Skeleton className="mb-4 h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </Card>
          </div>
        )}

        {errorMessage && (
          <div className="px-4 lg:px-6">
            <Card className="rounded-md border-destructive/30 bg-destructive/5 p-6 shadow-none">
              <p className="text-destructive text-sm font-medium">
                {errorMessage}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard")}
              >
                Back to dashboard
              </Button>
            </Card>
          </div>
        )}

        {!isLoading && !errorMessage && !subscriptionData && (
          <div className="px-4 lg:px-6">
            <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
              <h2 className="text-lg font-semibold">No subscription on file</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                We couldn&apos;t load billing details for your gym. Refresh the
                page or contact support if this continues.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </Card>
          </div>
        )}

        {subscriptionData && !isLoading && !errorMessage && (
          <>
            <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
              <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
                <h2 className="text-lg font-semibold">Current subscription</h2>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={getSubscriptionStatusBadgeVariant(
                      subscriptionData.subscription.status,
                    )}
                    className="capitalize"
                  >
                    {subscriptionData.subscription.status}
                  </Badge>
                  {subscriptionData.isTrial && (
                    <Badge variant="outline">Trial</Badge>
                  )}
                  {subscriptionData.isActive && !subscriptionData.isTrial && (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="text-right font-medium capitalize">
                      {subscriptionData.subscription.plan || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Monthly price</span>
                    <span className="text-right font-medium">
                      {formatMonthlyPriceNgn(
                        subscriptionData.subscription.monthlyPrice,
                      )}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
                <h2 className="text-lg font-semibold">Renewal & payments</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Next payment</span>
                    <span className="text-right font-medium">
                      {formatBillingDate(
                        subscriptionData.subscription.nextPaymentDate,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Last payment</span>
                    <span className="text-right font-medium">
                      {formatBillingDate(
                        subscriptionData.subscription.lastPaymentDate,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Auto renew</span>
                    <span className="text-right font-medium">
                      {subscriptionData.subscription.autoRenew ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Days remaining</span>
                    <span
                      className={`text-right font-medium ${
                        subscriptionData.daysRemaining <= 7
                          ? "text-orange-600"
                          : ""
                      }`}
                    >
                      {subscriptionData.daysRemaining}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="px-4 lg:px-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-muted text-muted-foreground flex h-auto min-h-9 w-full flex-wrap justify-start gap-1 rounded-lg p-[3px]">
                  {TAB_ITEMS.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <BillingTabPanels
                  data={subscriptionData}
                  onChangePlan={() => setIsPlanModalOpen(true)}
                />
              </Tabs>
            </div>
          </>
        )}
      </div>

      <SubscriptionPlanModal
        open={isPlanModalOpen}
        onOpenChange={setIsPlanModalOpen}
        subscription={subscriptionData}
      />
    </DashboardLayout>
  );
}
