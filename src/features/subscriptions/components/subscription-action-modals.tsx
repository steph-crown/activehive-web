import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as React from "react";
import {
  useUpdateSubscriptionStatusMutation,
  useCancelSubscriptionMutation,
  useChangeSubscriptionPlanMutation,
} from "../services";
import type { Subscription } from "../types";
import { SUBSCRIPTION_STATUS } from "../types";
import { useMembershipPlansQuery } from "@/features/membership-plans/services";

// Update Status Modal
const updateStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf([
      SUBSCRIPTION_STATUS.ACTIVE,
      SUBSCRIPTION_STATUS.EXPIRED,
      SUBSCRIPTION_STATUS.CANCELLED,
      SUBSCRIPTION_STATUS.PENDING,
    ])
    .required(),
  reason: yup.string().optional(),
  endDate: yup.string().optional(),
});

type UpdateStatusFormValues = yup.InferType<typeof updateStatusSchema>;

interface UpdateSubscriptionStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  onSuccess: () => void;
}

export function UpdateSubscriptionStatusModal({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: UpdateSubscriptionStatusModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: updateStatus, isPending } =
    useUpdateSubscriptionStatusMutation();

  const form = useForm<UpdateStatusFormValues>({
    resolver: yupResolver(updateStatusSchema) as any,
    defaultValues: {
      status: subscription?.status || SUBSCRIPTION_STATUS.ACTIVE,
      reason: "",
      endDate: "",
    },
  });

  React.useEffect(() => {
    if (subscription) {
      form.reset({
        status: subscription.status,
        reason: "",
        endDate: subscription.endDate.split("T")[0],
      });
    }
  }, [subscription, form]);

  const onSubmit = async (data: UpdateStatusFormValues) => {
    if (!subscription) return;

    try {
      await updateStatus({
        id: subscription.id,
        payload: {
          status: data.status as any,
          reason: data.reason || undefined,
          endDate: data.endDate
            ? new Date(data.endDate).toISOString()
            : undefined,
        },
      });
      showSuccess("Success", "Subscription status updated successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update status.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Subscription Status</DialogTitle>
          <DialogDescription>
            Update the status of subscription for {subscription?.member.firstName}{" "}
            {subscription?.member.lastName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SUBSCRIPTION_STATUS.ACTIVE}>
                        Active
                      </SelectItem>
                      <SelectItem value={SUBSCRIPTION_STATUS.EXPIRED}>
                        Expired
                      </SelectItem>
                      <SelectItem value={SUBSCRIPTION_STATUS.CANCELLED}>
                        Cancelled
                      </SelectItem>
                      <SelectItem value={SUBSCRIPTION_STATUS.PENDING}>
                        Pending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Reason for status change"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date || "")}
                      placeholder="Select end date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Cancel Subscription Modal
const cancelSchema = yup.object({
  reason: yup.string().optional(),
});

type CancelFormValues = yup.InferType<typeof cancelSchema>;

interface CancelSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  onSuccess: () => void;
}

export function CancelSubscriptionModal({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: CancelSubscriptionModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: cancelSubscription, isPending } =
    useCancelSubscriptionMutation();

  const form = useForm<CancelFormValues>({
    resolver: yupResolver(cancelSchema) as any,
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: CancelFormValues) => {
    if (!subscription) return;

    try {
      await cancelSubscription({
        id: subscription.id,
        payload: data.reason ? { reason: data.reason } : undefined,
      });
      showSuccess("Success", "Subscription cancelled successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to cancel subscription.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel the subscription for{" "}
            {subscription?.member.firstName} {subscription?.member.lastName}? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Reason for cancellation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                No, Keep Subscription
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Cancelling..." : "Yes, Cancel Subscription"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Change Plan Modal
const changePlanSchema = yup.object({
  newPlanId: yup.string().required("Please select a plan"),
  prorate: yup.boolean().default(false),
  extendEndDate: yup.boolean().default(true),
});

type ChangePlanFormValues = yup.InferType<typeof changePlanSchema>;

interface ChangeSubscriptionPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  onSuccess: () => void;
}

export function ChangeSubscriptionPlanModal({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: ChangeSubscriptionPlanModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: changePlan, isPending } =
    useChangeSubscriptionPlanMutation();
  const { data: membershipPlans, isLoading: plansLoading } =
    useMembershipPlansQuery(subscription?.location.id);

  const form = useForm<ChangePlanFormValues>({
    resolver: yupResolver(changePlanSchema) as any,
    defaultValues: {
      newPlanId: "",
      prorate: false,
      extendEndDate: true,
    },
  });

  React.useEffect(() => {
    if (subscription) {
      form.reset({
        newPlanId: subscription.membershipPlanId,
        prorate: false,
        extendEndDate: true,
      });
    }
  }, [subscription, form]);

  const onSubmit = async (data: ChangePlanFormValues) => {
    if (!subscription) return;

    try {
      await changePlan({
        id: subscription.id,
        payload: {
          newPlanId: data.newPlanId,
          prorate: data.prorate,
          extendEndDate: data.extendEndDate,
        },
      });
      showSuccess("Success", "Subscription plan changed successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to change plan.";
      showError("Error", message);
    }
  };

  const availablePlans = (membershipPlans || []).filter(
    (plan) => plan.id !== subscription?.membershipPlanId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
          <DialogDescription>
            Change the membership plan for {subscription?.member.firstName}{" "}
            {subscription?.member.lastName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPlanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Plan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={plansLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plansLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading plans...
                        </SelectItem>
                      ) : availablePlans.length === 0 ? (
                        <SelectItem value="no-plans" disabled>
                          No other plans available
                        </SelectItem>
                      ) : (
                        availablePlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}/{plan.duration}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prorate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Prorate Price</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Adjust price based on remaining time
                    </div>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="extendEndDate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Extend End Date</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Calculate end date from current date using new plan duration
                    </div>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Changing..." : "Change Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
