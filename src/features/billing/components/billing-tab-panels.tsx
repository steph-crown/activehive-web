import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { MySubscriptionResponse } from "../types";
import {
  formatBillingDate,
  formatBillingDateTime,
  formatMonthlyPriceNgn,
  getSubscriptionStatusBadgeVariant,
} from "../lib/billing-display";

function LabeledRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-bebas text-xl tracking-wide text-foreground uppercase">
      {children}
    </h3>
  );
}

type BillingTabPanelsProps = {
  readonly data: MySubscriptionResponse;
  readonly onChangePlan: () => void;
};

export function BillingTabPanels({
  data,
  onChangePlan,
}: BillingTabPanelsProps) {
  const sub = data.subscription;
  const owner = sub.gymOwner;
  const gym = sub.gym;
  const addr = gym.address;

  const addressBlock = [
    addr.street,
    `${addr.city}, ${addr.state} ${addr.zipCode}`,
    addr.country,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionHeading>At a glance</SectionHeading>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Plan</span>
                <span className="text-right font-medium capitalize">
                  {sub.plan || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={getSubscriptionStatusBadgeVariant(sub.status)}
                  className="capitalize"
                >
                  {sub.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Monthly price</span>
                <span className="text-right font-medium">
                  {formatMonthlyPriceNgn(sub.monthlyPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Auto renew</span>
                <span className="text-right font-medium">
                  {sub.autoRenew ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Days remaining</span>
                <span
                  className={`text-right font-medium ${
                    data.daysRemaining <= 7 ? "text-orange-600" : ""
                  }`}
                >
                  {data.daysRemaining}
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionHeading>Manage plan</SectionHeading>
            <p className="text-muted-foreground mt-2 text-sm">
              {data.isTrial
                ? "Your trial won’t last forever — pick a paid plan to keep every feature when it ends."
                : "Switch to a different plan when your gym’s needs change. Billing updates apply on your next cycle."}
            </p>
            <Button className="mt-6 w-full sm:w-auto" onClick={onChangePlan}>
              Change plan
            </Button>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="plan-dates" className="mt-4 space-y-4">
        {data.isTrial && (
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionHeading>Trial period</SectionHeading>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabeledRow
                label="Trial start"
                value={formatBillingDateTime(sub.trialStartDate)}
              />
              <LabeledRow
                label="Trial end"
                value={formatBillingDateTime(sub.trialEndDate)}
              />
            </div>
          </Card>
        )}

        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Billing cycle</SectionHeading>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LabeledRow
              label="Subscription start"
              value={formatBillingDate(sub.subscriptionStartDate)}
            />
            <LabeledRow
              label="Subscription end"
              value={formatBillingDate(sub.subscriptionEndDate)}
            />
            <LabeledRow
              label="Last payment"
              value={formatBillingDate(sub.lastPaymentDate)}
            />
            <LabeledRow
              label="Next payment"
              value={formatBillingDate(sub.nextPaymentDate)}
            />
          </div>
        </Card>

        {sub.cancellationDate && (
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionHeading>Cancellation</SectionHeading>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabeledRow
                label="Cancellation date"
                value={formatBillingDate(sub.cancellationDate)}
              />
              <LabeledRow
                label="Reason"
                value={sub.cancellationReason?.trim() || "—"}
              />
            </div>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="organization" className="mt-4 space-y-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Gym owner</SectionHeading>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LabeledRow
              label="Name"
              value={`${owner.firstName} ${owner.lastName}`.trim() || "—"}
            />
            <LabeledRow label="Email" value={owner.email || "—"} />
            <LabeledRow
              label="Phone"
              value={owner.phoneNumber?.trim() || "—"}
            />
          </div>
        </Card>

        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Gym</SectionHeading>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LabeledRow label="Gym name" value={gym.name || "—"} />
            <LabeledRow label="Email" value={gym.email || "—"} />
            <LabeledRow label="Phone" value={gym.phoneNumber || "—"} />
            <div className="space-y-1.5 sm:col-span-2">
              <p className="text-xs font-semibold text-foreground">Address</p>
              <div className="min-h-[72px] rounded-md border border-[#F4F4F4] bg-muted/50 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                {addressBlock || "—"}
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </>
  );
}
