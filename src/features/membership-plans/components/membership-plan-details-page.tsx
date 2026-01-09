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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconDotsVertical } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useMembershipPlanQuery } from "../services";
import {
  UpdateMembershipPlanModal,
  DeleteMembershipPlanModal,
  DuplicateMembershipPlanModal,
  AddPromoCodeModal,
  RemovePromoCodeModal,
  TogglePromoCodeModal,
} from "./membership-plan-action-modals";

export function MembershipPlanDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: plan, isLoading } = useMembershipPlanQuery(id || "");
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = React.useState(false);
  const [isAddPromoCodeOpen, setIsAddPromoCodeOpen] = React.useState(false);
  const [isRemovePromoCodeOpen, setIsRemovePromoCodeOpen] = React.useState(false);
  const [isTogglePromoCodeOpen, setIsTogglePromoCodeOpen] = React.useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = React.useState<string>("");
  const [promoCodeStatus, setPromoCodeStatus] = React.useState<boolean>(false);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <BlockLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (!plan) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Membership plan not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleActionSuccess = () => {
    setIsUpdateOpen(false);
    setIsDeleteOpen(false);
    setIsDuplicateOpen(false);
    setIsAddPromoCodeOpen(false);
    setIsRemovePromoCodeOpen(false);
    setIsTogglePromoCodeOpen(false);
    setSelectedPromoCode("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/membership-plans")}
            >
              ← Back to Membership Plans
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <IconDotsVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setIsUpdateOpen(true);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsDuplicateOpen(true);
                  }}
                >
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsAddPromoCodeOpen(true);
                  }}
                >
                  Add Promo Code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setIsDeleteOpen(true);
                  }}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h1 className="text-3xl font-bold">{plan.name}</h1>
          <p className="text-muted-foreground mt-2">
            View detailed information about this membership plan
          </p>
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Plan Overview</CardTitle>
                  <CardDescription>Plan ID: {plan.id}</CardDescription>
                </div>
                <Badge variant={plan.isActive ? "default" : "secondary"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{plan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    ${parseFloat(plan.price).toFixed(2)} / {plan.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium capitalize">{plan.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grace Period</p>
                  <p className="font-medium">{plan.gracePeriodDays} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trial Period</p>
                  <p className="font-medium">
                    {plan.hasTrialPeriod
                      ? `${plan.trialPeriodDays} days`
                      : "No trial"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classes Per Week</p>
                  <p className="font-medium">
                    {plan.classesPerWeek || "Unlimited"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{plan.description}</p>
              </div>
              {plan.imageUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">Image</p>
                  <img
                    src={plan.imageUrl}
                    alt={plan.name}
                    className="mt-2 rounded-lg max-w-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Promo Codes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Promo Codes</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setIsAddPromoCodeOpen(true)}
                >
                  Add Promo Code
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {plan.promoCodes && plan.promoCodes.length > 0 ? (
                <div className="space-y-4">
                  {plan.promoCodes.map((promoCode) => (
                    <div
                      key={promoCode.code}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{promoCode.code}</p>
                          <Badge
                            variant={promoCode.isActive ? "default" : "secondary"}
                          >
                            {promoCode.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {promoCode.discountType === "percentage"
                            ? `${promoCode.discountValue}% off`
                            : `$${promoCode.discountValue} off`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Valid from {new Date(promoCode.validFrom).toLocaleDateString()}{" "}
                          to {new Date(promoCode.validUntil).toLocaleDateString()}
                        </p>
                        {promoCode.maxUses && (
                          <p className="text-xs text-muted-foreground">
                            Uses: {promoCode.currentUses || 0} / {promoCode.maxUses}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPromoCode(promoCode.code);
                              setPromoCodeStatus(promoCode.isActive);
                              setIsTogglePromoCodeOpen(true);
                            }}
                          >
                            {promoCode.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPromoCode(promoCode.code);
                              setIsRemovePromoCodeOpen(true);
                            }}
                            className="text-destructive"
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No promo codes added yet.
                </p>
              )}
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
                <p className="font-medium">{plan.location.locationName}</p>
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
                <p className="font-medium">{plan.gym.name}</p>
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
                  {new Date(plan.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="font-medium">
                  {new Date(plan.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UpdateMembershipPlanModal
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        plan={plan}
        onSuccess={handleActionSuccess}
      />

      <DeleteMembershipPlanModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        plan={plan}
        onSuccess={handleActionSuccess}
      />

      <DuplicateMembershipPlanModal
        open={isDuplicateOpen}
        onOpenChange={setIsDuplicateOpen}
        plan={plan}
        onSuccess={handleActionSuccess}
      />

      <AddPromoCodeModal
        open={isAddPromoCodeOpen}
        onOpenChange={setIsAddPromoCodeOpen}
        plan={plan}
        onSuccess={handleActionSuccess}
      />

      <RemovePromoCodeModal
        open={isRemovePromoCodeOpen}
        onOpenChange={setIsRemovePromoCodeOpen}
        plan={plan}
        promoCode={selectedPromoCode}
        onSuccess={handleActionSuccess}
      />

      <TogglePromoCodeModal
        open={isTogglePromoCodeOpen}
        onOpenChange={setIsTogglePromoCodeOpen}
        plan={plan}
        promoCode={selectedPromoCode}
        currentStatus={promoCodeStatus}
        onSuccess={handleActionSuccess}
      />
    </DashboardLayout>
  );
}
