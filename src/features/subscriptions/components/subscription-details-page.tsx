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
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useSubscriptionQuery } from "../services";
import { SUBSCRIPTION_STATUS } from "../types";

export function SubscriptionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: subscription, isLoading } = useSubscriptionQuery(id || "");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <BlockLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (!subscription) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Subscription not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case SUBSCRIPTION_STATUS.ACTIVE:
        return "default";
      case SUBSCRIPTION_STATUS.CANCELLED:
        return "destructive";
      case SUBSCRIPTION_STATUS.EXPIRED:
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/subscriptions")}
            className="mb-4"
          >
            ← Back to Subscriptions
          </Button>
          <h1 className="text-3xl font-bold">Subscription Details</h1>
          <p className="text-muted-foreground mt-2">
            View detailed information about this subscription
          </p>
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          {/* Subscription Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subscription Overview</CardTitle>
                  <CardDescription>
                    Subscription ID: {subscription.id}
                  </CardDescription>
                </div>
                <Badge variant={getStatusVariant(subscription.status)}>
                  {subscription.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{subscription.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(subscription.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p
                    className={`font-medium ${
                      subscription.isExpiringSoon
                        ? "text-orange-600"
                        : ""
                    }`}
                  >
                    {subscription.daysRemaining}
                  </p>
                </div>
                {subscription.autoRenew !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Auto Renew</p>
                    <p className="font-medium">
                      {subscription.autoRenew ? "Yes" : "No"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Member Information */}
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {subscription.member.firstName} {subscription.member.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{subscription.member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">
                    {subscription.member.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member ID</p>
                  <p className="font-medium">{subscription.member.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan Name</p>
                  <p className="font-medium">
                    {subscription.membershipPlan.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium capitalize">
                    {subscription.membershipPlan.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan Price</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(subscription.membershipPlan.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan ID</p>
                  <p className="font-medium">{subscription.membershipPlan.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Location Name</p>
                <p className="font-medium">
                  {subscription.location.locationName}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gym Information */}
          <Card>
            <CardHeader>
              <CardTitle>Gym</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Gym Name</p>
                <p className="font-medium">{subscription.gym.name}</p>
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
                  {new Date(subscription.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="font-medium">
                  {new Date(subscription.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
