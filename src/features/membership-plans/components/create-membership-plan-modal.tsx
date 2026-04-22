import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { Switch } from "@/components/ui/switch";
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
      then: (schema) =>
        schema.required(
          "Trial period days is required when trial period is enabled",
        ),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(createMembershipPlanSchema) as any,
    defaultValues: {
      locationId: "",
      name: "",
      description: "",
      price: undefined as unknown as number,
      duration: "monthly",
      features: [""],
      isActive: true,
      gracePeriodDays: 3,
      hasTrialPeriod: false,
      trialPeriodDays: null,
      classesPerWeek: null,
    },
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
        features: data.features
          .filter((f) => f.trim() !== "")
          .flatMap((f) =>
            f
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
        isActive: data.isActive,
        gracePeriodDays: data.gracePeriodDays,
        hasTrialPeriod: data.hasTrialPeriod,
        trialPeriodDays: data.hasTrialPeriod ? data.trialPeriodDays : null,
        classesPerWeek: data.classesPerWeek || null,
      };

      await createPlan(payload);
      showSuccess("Success", "Membership plan created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create membership plan";
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Basic Monthly Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={locationsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="!h-10 w-full">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
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
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="49.99"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            field.onChange(undefined as unknown as number);
                            return;
                          }
                          const parsed = parseFloat(e.target.value);
                          field.onChange(
                            Number.isNaN(parsed)
                              ? (undefined as unknown as number)
                              : parsed,
                          );
                        }}
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
                    <FormLabel>Duration *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="!h-10 w-full">
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

            <FormField
              control={form.control}
              name="features.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits (comma-separated) *</FormLabel>
                  <FormControl>
                    <textarea
                      rows={3}
                      className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                      placeholder="Gym Access, Pool, Sauna"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
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
                    <FormLabel>Grace Period (Days) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            field.onChange(undefined as unknown as number);
                            return;
                          }
                          const parsed = parseInt(e.target.value, 10);
                          field.onChange(
                            Number.isNaN(parsed)
                              ? (undefined as unknown as number)
                              : parsed,
                          );
                        }}
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
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : null,
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
              name="hasTrialPeriod"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <FormLabel>Free trial</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : null,
                          )
                        }
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
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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
              <Button type="submit" loading={isPending}>
                Create Plan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
