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
import { useLocationsQuery } from "@/features/locations/services";
import { useMembershipPlansQuery } from "@/features/membership-plans/services";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreateMemberMutation } from "../services";

const createMemberSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  membershipPlanId: yup.string().required("Membership plan is required"),
  locationId: yup.string().optional(),
  startDate: yup.string().optional(),
  promoCode: yup.string().optional(),
});

type CreateMemberFormValues = yup.InferType<typeof createMemberSchema>;

interface CreateMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateMemberModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateMemberModalProps) {
  const { showSuccess, showError } = useToast();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { mutateAsync: createMember, isPending } = useCreateMemberMutation();

  const form = useForm<CreateMemberFormValues>({
    resolver: yupResolver(createMemberSchema) as any,
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
      membershipPlanId: "",
      locationId: "",
      startDate: new Date().toISOString().split("T")[0],
      promoCode: "",
    },
  });

  const watchedLocationId = form.watch("locationId");
  const { data: membershipPlans, isLoading: plansLoading } =
    useMembershipPlansQuery(watchedLocationId);

  // Reset membership plan when location changes
  const handleLocationChange = (locationId: string) => {
    form.setValue("locationId", locationId || "");
    if (locationId) {
      form.setValue("membershipPlanId", "");
    }
  };

  const onSubmit = async (data: CreateMemberFormValues) => {
    try {
      const payload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        ...(data.phoneNumber?.trim() && { phoneNumber: data.phoneNumber.trim() }),
        ...(data.dateOfBirth?.trim() && { dateOfBirth: data.dateOfBirth.trim() }),
        membershipPlanId: data.membershipPlanId,
        ...(data.locationId?.trim() && { locationId: data.locationId.trim() }),
        ...(data.startDate?.trim() && { startDate: data.startDate.trim() }),
        ...(data.promoCode?.trim() && { promoCode: data.promoCode.trim() }),
      };

      await createMember(payload);
      showSuccess("Success", "Member created successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create member.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Create a new member account and assign a membership plan. The member
            will receive a welcome email with a password setup link to activate
            their account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="member@example.com"
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 123-4567"
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <Select
                    onValueChange={handleLocationChange}
                    value={field.value}
                    disabled={locationsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location (optional)" />
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
              name="membershipPlanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Plan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={plansLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a membership plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plansLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading plans...
                        </SelectItem>
                      ) : membershipPlans && membershipPlans.length > 0 ? (
                        membershipPlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-plans" disabled>
                          {watchedLocationId
                            ? "No plans available for this location"
                            : "No membership plans available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="SUMMER2024" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
