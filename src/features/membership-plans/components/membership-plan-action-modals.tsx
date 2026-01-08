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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as React from "react";
import {
  useUpdateMembershipPlanMutation,
  useDeleteMembershipPlanMutation,
  useDuplicateMembershipPlanMutation,
  useAddPromoCodeMutation,
  useRemovePromoCodeMutation,
  useTogglePromoCodeMutation,
} from "../services";
import type { MembershipPlan, MembershipPlanWithPromoCodes } from "../types";
import { useLocationsQuery } from "@/features/locations/services";

// Update Plan Modal
const updatePlanSchema = yup.object({
  name: yup.string().optional(),
  description: yup.string().optional(),
  price: yup.number().optional().min(0),
  duration: yup.string().optional(),
  features: yup.array().of(yup.string()).optional(),
  isActive: yup.boolean().optional(),
  imageUrl: yup.string().url().optional().nullable(),
  gracePeriodDays: yup.number().optional().min(0),
  hasTrialPeriod: yup.boolean().optional(),
  trialPeriodDays: yup.number().nullable().optional(),
  classesPerWeek: yup.number().nullable().optional(),
});

type UpdatePlanFormValues = yup.InferType<typeof updatePlanSchema>;

interface UpdateMembershipPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MembershipPlan | null;
  onSuccess: () => void;
}

export function UpdateMembershipPlanModal({
  open,
  onOpenChange,
  plan,
  onSuccess,
}: UpdateMembershipPlanModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: updatePlan, isPending } =
    useUpdateMembershipPlanMutation();

  const form = useForm<UpdatePlanFormValues>({
    resolver: yupResolver(updatePlanSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: "",
      features: [],
      isActive: true,
      imageUrl: "",
      gracePeriodDays: 0,
      hasTrialPeriod: false,
      trialPeriodDays: null,
      classesPerWeek: null,
    },
  });

  React.useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        description: plan.description,
        price: parseFloat(plan.price),
        duration: plan.duration,
        features: plan.features,
        isActive: plan.isActive,
        imageUrl: plan.imageUrl || "",
        gracePeriodDays: plan.gracePeriodDays,
        hasTrialPeriod: plan.hasTrialPeriod,
        trialPeriodDays: plan.trialPeriodDays,
        classesPerWeek: plan.classesPerWeek,
      });
    }
  }, [plan, form]);

  const onSubmit = async (data: UpdatePlanFormValues) => {
    if (!plan) return;

    try {
      await updatePlan({
        id: plan.id,
        payload: {
          ...data,
          imageUrl: data.imageUrl || undefined,
          trialPeriodDays: data.trialPeriodDays || undefined,
          classesPerWeek: data.classesPerWeek || undefined,
        },
      });
      showSuccess("Success", "Membership plan updated successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update plan.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Membership Plan</DialogTitle>
          <DialogDescription>
            Update the details of {plan?.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="lifetime">Lifetime</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/image.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gracePeriodDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grace Period (Days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classesPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classes Per Week</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hasTrialPeriod"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has Trial Period</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {form.watch("hasTrialPeriod") && (
              <FormField
                control={form.control}
                name="trialPeriodDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trial Period Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Plan Modal
interface DeleteMembershipPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MembershipPlan | null;
  onSuccess: () => void;
}

export function DeleteMembershipPlanModal({
  open,
  onOpenChange,
  plan,
  onSuccess,
}: DeleteMembershipPlanModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deletePlan, isPending } =
    useDeleteMembershipPlanMutation();

  const onSubmit = async () => {
    if (!plan) return;

    try {
      await deletePlan(plan.id);
      showSuccess("Success", "Membership plan deleted successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete plan.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Membership Plan</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{plan?.name}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Duplicate Plan Modal
const duplicatePlanSchema = yup.object({
  locationId: yup.string().required("Please select a location"),
});

type DuplicatePlanFormValues = yup.InferType<typeof duplicatePlanSchema>;

interface DuplicateMembershipPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MembershipPlan | null;
  onSuccess: () => void;
}

export function DuplicateMembershipPlanModal({
  open,
  onOpenChange,
  plan,
  onSuccess,
}: DuplicateMembershipPlanModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: duplicatePlan, isPending } =
    useDuplicateMembershipPlanMutation();
  const { data: locations } = useLocationsQuery();

  const form = useForm<DuplicatePlanFormValues>({
    resolver: yupResolver(duplicatePlanSchema) as any,
    defaultValues: {
      locationId: "",
    },
  });

  const onSubmit = async (data: DuplicatePlanFormValues) => {
    if (!plan) return;

    try {
      await duplicatePlan({
        id: plan.id,
        payload: {
          locationId: data.locationId,
        },
      });
      showSuccess("Success", "Membership plan duplicated successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to duplicate plan.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate Membership Plan</DialogTitle>
          <DialogDescription>
            Create a copy of "{plan?.name}" for another location
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations
                        ?.filter((loc) => loc.id !== plan?.locationId)
                        .map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.locationName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                {isPending ? "Duplicating..." : "Duplicate Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Add Promo Code Modal
const addPromoCodeSchema = yup.object({
  code: yup.string().required("Promo code is required"),
  discountType: yup
    .string()
    .oneOf(["percentage", "fixed"])
    .required("Discount type is required"),
  discountValue: yup.number().required("Discount value is required").min(0),
  validFrom: yup.string().required("Start date is required"),
  validUntil: yup.string().required("End date is required"),
  maxUses: yup.number().optional().min(1),
  isActive: yup.boolean().default(true),
});

type AddPromoCodeFormValues = yup.InferType<typeof addPromoCodeSchema>;

interface AddPromoCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MembershipPlan | null;
  onSuccess: () => void;
}

export function AddPromoCodeModal({
  open,
  onOpenChange,
  plan,
  onSuccess,
}: AddPromoCodeModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: addPromoCode, isPending } = useAddPromoCodeMutation();

  const form = useForm<AddPromoCodeFormValues>({
    resolver: yupResolver(addPromoCodeSchema) as any,
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      validFrom: "",
      validUntil: "",
      maxUses: undefined,
      isActive: true,
    },
  });

  const onSubmit = async (data: AddPromoCodeFormValues) => {
    if (!plan) return;

    try {
      await addPromoCode({
        id: plan.id,
        payload: {
          code: data.code.toUpperCase(),
          discountType: data.discountType as "percentage" | "fixed",
          discountValue: data.discountValue,
          validFrom: new Date(data.validFrom).toISOString(),
          validUntil: new Date(data.validUntil).toISOString(),
          maxUses: data.maxUses,
          isActive: data.isActive,
        },
      });
      showSuccess("Success", "Promo code added successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add promo code.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Promo Code</DialogTitle>
          <DialogDescription>
            Add a promo code to {plan?.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promo Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SUMMER2024" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid From</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? field.value.split("T")[0] : undefined}
                        onChange={(date) => {
                          if (date) {
                            // Set to start of day in ISO format
                            const dateObj = new Date(date);
                            dateObj.setHours(0, 0, 0, 0);
                            field.onChange(dateObj.toISOString());
                          } else {
                            field.onChange("");
                          }
                        }}
                        placeholder="Select start date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? field.value.split("T")[0] : undefined}
                        onChange={(date) => {
                          if (date) {
                            // Set to end of day in ISO format
                            const dateObj = new Date(date);
                            dateObj.setHours(23, 59, 59, 999);
                            field.onChange(dateObj.toISOString());
                          } else {
                            field.onChange("");
                          }
                        }}
                        placeholder="Select end date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="maxUses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Uses (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                  </div>
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
                {isPending ? "Adding..." : "Add Promo Code"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Remove Promo Code Modal
interface RemovePromoCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MembershipPlanWithPromoCodes | null;
  promoCode: string;
  onSuccess: () => void;
}

export function RemovePromoCodeModal({
  open,
  onOpenChange,
  plan,
  promoCode,
  onSuccess,
}: RemovePromoCodeModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: removePromoCode, isPending } =
    useRemovePromoCodeMutation();

  const onSubmit = async () => {
    if (!plan) return;

    try {
      await removePromoCode({ id: plan.id, code: promoCode });
      showSuccess("Success", "Promo code removed successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove promo code.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Promo Code</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove promo code "{promoCode}" from "
            {plan?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove Promo Code"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Toggle Promo Code Modal
interface TogglePromoCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MembershipPlanWithPromoCodes | null;
  promoCode: string;
  currentStatus: boolean;
  onSuccess: () => void;
}

export function TogglePromoCodeModal({
  open,
  onOpenChange,
  plan,
  promoCode,
  currentStatus,
  onSuccess,
}: TogglePromoCodeModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: togglePromoCode, isPending } =
    useTogglePromoCodeMutation();

  const onSubmit = async () => {
    if (!plan) return;

    try {
      await togglePromoCode({
        id: plan.id,
        code: promoCode,
        payload: {
          isActive: !currentStatus,
        },
      });
      showSuccess(
        "Success",
        `Promo code ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to toggle promo code status.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentStatus ? "Deactivate" : "Activate"} Promo Code
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {currentStatus ? "deactivate" : "activate"}{" "}
            promo code "{promoCode}" for "{plan?.name}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            variant={currentStatus ? "destructive" : "default"}
          >
            {isPending
              ? "Updating..."
              : currentStatus
              ? "Deactivate"
              : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
