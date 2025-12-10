import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCreateMembershipPlanMutation } from "../services";
import { useLocationsQuery } from "@/features/locations/services";
import type { CreateMembershipPlanPayload } from "../types";

const createMembershipPlanSchema = yup.object({
  locationId: yup.string().required("Location is required"),
  name: yup.string().required("Plan name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  duration: yup
    .string()
    .oneOf(["monthly", "weekly", "yearly"], "Invalid duration")
    .required("Duration is required"),
  features: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one feature is required")
    .required(),
  isActive: yup.boolean().default(true),
  imageUrl: yup.string().url("Must be a valid URL").nullable(),
  gracePeriodDays: yup
    .number()
    .typeError("Grace period must be a number")
    .min(0, "Grace period cannot be negative")
    .required("Grace period is required"),
  hasTrialPeriod: yup.boolean().default(false),
  trialPeriodDays: yup
    .number()
    .typeError("Trial period must be a number")
    .min(0, "Trial period cannot be negative")
    .nullable()
    .when("hasTrialPeriod", {
      is: true,
      then: (schema) => schema.required("Trial period days is required when trial period is enabled"),
    }),
  classesPerWeek: yup
    .number()
    .typeError("Classes per week must be a number")
    .min(0, "Classes per week cannot be negative")
    .nullable(),
});

type CreateMembershipPlanFormValues = yup.InferType<
  typeof createMembershipPlanSchema
>;

interface CreateMembershipPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMembershipPlanModal({
  open,
  onOpenChange,
}: CreateMembershipPlanModalProps) {
  const { showSuccess, showError } = useToast();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { mutateAsync: createPlan, isPending } =
    useCreateMembershipPlanMutation();

  const form = useForm<CreateMembershipPlanFormValues>({
    resolver: yupResolver(createMembershipPlanSchema),
    defaultValues: {
      locationId: "",
      name: "",
      description: "",
      price: 0,
      duration: "monthly",
      features: [""],
      isActive: true,
      imageUrl: "",
      gracePeriodDays: 3,
      hasTrialPeriod: false,
      trialPeriodDays: null,
      classesPerWeek: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const hasTrialPeriod = form.watch("hasTrialPeriod");

  const onSubmit = async (data: CreateMembershipPlanFormValues) => {
    try {
      const payload: CreateMembershipPlanPayload = {
        locationId: data.locationId,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        features: data.features.filter((f) => f.trim() !== ""),
        isActive: data.isActive,
        gracePeriodDays: data.gracePeriodDays,
        hasTrialPeriod: data.hasTrialPeriod,
        trialPeriodDays: data.hasTrialPeriod ? data.trialPeriodDays : null,
        classesPerWeek: data.classesPerWeek || null,
      };

      if (data.imageUrl) {
        payload.imageUrl = data.imageUrl;
      }

      await createPlan(payload);
      showSuccess("Success", "Membership plan created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create membership plan";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Membership Plan</DialogTitle>
          <DialogDescription>
            Create a new membership plan for a specific location.
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={locationsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations?.map((location) => (
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Basic Monthly Plan" {...field} />
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
                    <Input
                      placeholder="Access to all gym facilities, group classes, and locker room"
                      {...field}
                    />
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
                        placeholder="49.99"
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
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Features</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`features.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Access to all equipment"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append("")}
                className="w-full"
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

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
                        placeholder="3"
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
                    <FormLabel>Classes Per Week (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        {...field}
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

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/plan-image.jpg"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {hasTrialPeriod && (
              <FormField
                control={form.control}
                name="trialPeriodDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trial Period (Days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="7"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
