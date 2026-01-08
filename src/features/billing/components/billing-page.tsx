import { BlockLoader } from "@/components/loader/block-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import * as React from "react";
import { apiClient } from "@/lib/api-client";

interface MySubscriptionResponse {
  subscription: {
    id: string;
    gymOwnerId: string;
    trainerId: string | null;
    gymId: string;
    platformPlanId: string | null;
    plan: string;
    status: string;
    monthlyPrice: number | null;
    trialStartDate: string | null;
    trialEndDate: string | null;
    subscriptionStartDate: string | null;
    subscriptionEndDate: string | null;
    lastPaymentDate: string | null;
    nextPaymentDate: string | null;
    autoRenew: boolean;
    cancellationDate: string | null;
    cancellationReason: string | null;
    subscribedBy: string | null;
    isTrial: boolean;
    createdAt: string;
    updatedAt: string;
    gymOwner: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string | null;
      profileImage: string | null;
    };
    gym: {
      id: string;
      name: string;
      logo: string | null;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      phoneNumber: string;
      email: string;
    };
  };
  isTrial: boolean;
  daysRemaining: number;
  isActive: boolean;
}

export function BillingPage() {
  const [data, setData] = React.useState<MySubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMySubscription = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<MySubscriptionResponse>(
          "/api/subscriptions/my-subscription"
        );
        console.log("My Subscription Response:", response);
        setData(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch subscription";
        console.error("Error fetching subscription:", err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMySubscription();
  }, []);

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
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground mt-2">
            View your subscription and billing information
          </p>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-destructive">Error: {error}</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Subscription Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Subscription Overview</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(data.subscription.status)}>
                        {data.subscription.status.toUpperCase()}
                      </Badge>
                      {data.isTrial && (
                        <Badge variant="outline">Trial</Badge>
                      )}
                      {data.isActive && (
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
                        {data.subscription.plan}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Monthly Price
                      </p>
                      <p className="font-medium">
                        {data.subscription.monthlyPrice
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.subscription.monthlyPrice)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Auto Renew
                      </p>
                      <p className="font-medium">
                        {data.subscription.autoRenew ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Days Remaining
                      </p>
                      <p
                        className={`font-medium ${
                          data.daysRemaining <= 7 ? "text-orange-600" : ""
                        }`}
                      >
                        {data.daysRemaining}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trial Information */}
              {data.isTrial && (
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
                          {formatDateTime(data.subscription.trialStartDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Trial End Date
                        </p>
                        <p className="font-medium">
                          {formatDateTime(data.subscription.trialEndDate)}
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
                        {formatDate(data.subscription.subscriptionStartDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Subscription End Date
                      </p>
                      <p className="font-medium">
                        {formatDate(data.subscription.subscriptionEndDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Payment Date
                      </p>
                      <p className="font-medium">
                        {formatDate(data.subscription.lastPaymentDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Next Payment Date
                      </p>
                      <p className="font-medium">
                        {formatDate(data.subscription.nextPaymentDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Information */}
              {data.subscription.cancellationDate && (
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
                          {formatDate(data.subscription.cancellationDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="font-medium">
                          {data.subscription.cancellationReason || "N/A"}
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
                        {data.subscription.gymOwner.firstName}{" "}
                        {data.subscription.gymOwner.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {data.subscription.gymOwner.email}
                      </p>
                    </div>
                    {data.subscription.gymOwner.phoneNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">
                          {data.subscription.gymOwner.phoneNumber}
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
                        {data.subscription.gym.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {data.subscription.gym.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {data.subscription.gym.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {data.subscription.gym.address.street}
                        <br />
                        {data.subscription.gym.address.city},{" "}
                        {data.subscription.gym.address.state}{" "}
                        {data.subscription.gym.address.zipCode}
                        <br />
                        {data.subscription.gym.address.country}
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
                      {formatDateTime(data.subscription.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">
                      {formatDateTime(data.subscription.updatedAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
