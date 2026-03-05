import { useState } from "react";
import { BlockLoader } from "@/components/loader/block-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useMySubscriptionQuery } from "../services";
import { SubscriptionPlanModal } from "./subscription-plan-modal";

export function BillingPage() {
  const { data, isLoading, error } = useMySubscriptionQuery();
  const subscriptionData = data;
  const errorMessage = error ? error.message : null;
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "trial":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground mt-2">
              View your subscription and billing information
            </p>
          </div>
          {subscriptionData && (
            <Button
              variant="outline"
              onClick={() => setIsPlanModalOpen(true)}
            >
              Change plan
            </Button>
          )}
        </div>

        <div className="px-4 lg:px-6">
          {(() => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center py-10">
                  <BlockLoader />
                </div>
              );
            }

            if (errorMessage) {
              return (
                <div className="flex items-center justify-center py-10">
                  <p className="text-destructive">Error: {errorMessage}</p>
                </div>
              );
            }

            if (!subscriptionData) {
              return null;
            }

            return (
              <div className="space-y-6">
              {/* Subscription Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Subscription Overview</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getStatusVariant(
                          subscriptionData.subscription.status
                        )}
                      >
                        {subscriptionData.subscription.status.toUpperCase()}
                      </Badge>
                      {subscriptionData.isTrial && (
                        <Badge variant="outline">Trial</Badge>
                      )}
                      {subscriptionData.isActive && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <p className="font-medium capitalize">
                        {subscriptionData.subscription.plan}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Monthly Price
                      </p>
                      <p className="font-medium">
                        {subscriptionData.subscription.monthlyPrice
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(
                              subscriptionData.subscription.monthlyPrice
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Auto Renew
                      </p>
                      <p className="font-medium">
                          {subscriptionData.subscription.autoRenew
                            ? "Yes"
                            : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Days Remaining
                      </p>
                      <p
                        className={`font-medium ${
                          subscriptionData.daysRemaining <= 7
                            ? "text-orange-600"
                            : ""
                        }`}
                      >
                        {subscriptionData.daysRemaining}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trial Information */}
              {subscriptionData.isTrial && (
                <Card>
                  <CardHeader>
                    <CardTitle>Trial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Trial Start Date
                        </p>
                        <p className="font-medium">
                          {formatDateTime(
                            subscriptionData.subscription.trialStartDate
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Trial End Date
                        </p>
                        <p className="font-medium">
                          {formatDateTime(
                            subscriptionData.subscription.trialEndDate
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Subscription Dates */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Subscription Start Date
                      </p>
                      <p className="font-medium">
                          {formatDate(
                            subscriptionData.subscription.subscriptionStartDate
                          )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Subscription End Date
                      </p>
                      <p className="font-medium">
                          {formatDate(
                            subscriptionData.subscription.subscriptionEndDate
                          )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Payment Date
                      </p>
                      <p className="font-medium">
                          {formatDate(
                            subscriptionData.subscription.lastPaymentDate
                          )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Next Payment Date
                      </p>
                      <p className="font-medium">
                          {formatDate(
                            subscriptionData.subscription.nextPaymentDate
                          )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Information */}
              {subscriptionData.subscription.cancellationDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cancellation Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Cancellation Date
                        </p>
                        <p className="font-medium">
                          {formatDate(
                            subscriptionData.subscription.cancellationDate
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="font-medium">
                          {subscriptionData.subscription.cancellationReason ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gym Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Gym Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {subscriptionData.subscription.gymOwner.firstName}{" "}
                        {subscriptionData.subscription.gymOwner.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {subscriptionData.subscription.gymOwner.email}
                      </p>
                    </div>
                    {subscriptionData.subscription.gymOwner.phoneNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">
                          {subscriptionData.subscription.gymOwner.phoneNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gym Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Gym</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Gym Name</p>
                      <p className="font-medium">
                        {subscriptionData.subscription.gym.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {subscriptionData.subscription.gym.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {subscriptionData.subscription.gym.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {subscriptionData.subscription.gym.address.street}
                        <br />
                        {subscriptionData.subscription.gym.address.city},{" "}
                        {subscriptionData.subscription.gym.address.state}{" "}
                        {subscriptionData.subscription.gym.address.zipCode}
                        <br />
                        {subscriptionData.subscription.gym.address.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle>Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">
                      {formatDateTime(
                        subscriptionData.subscription.createdAt
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">
                      {formatDateTime(
                        subscriptionData.subscription.updatedAt
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            );
          })()}
        </div>
      </div>

      <SubscriptionPlanModal
        open={isPlanModalOpen}
        onOpenChange={setIsPlanModalOpen}
        subscription={subscriptionData}
      />
    </DashboardLayout>
  );
}
