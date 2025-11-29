import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useLocationsStepMutation,
  useCompleteRegistrationMutation,
} from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";
import {
  locationsSchema,
  type LocationsFormValues,
} from "@/features/gym-owner-registration/schema";

export function LocationsStepForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const { mutateAsync: submitLocations, isPending } =
    useLocationsStepMutation();
  const { mutateAsync: completeRegistration, isPending: isCompleting } =
    useCompleteRegistrationMutation();

  const form = useForm<LocationsFormValues>({
    resolver: yupResolver(locationsSchema),
    defaultValues: {
      locations: [
        {
          locationName: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phone: "",
          email: "",
          isHeadquarters: true,
          paymentAccount: {
            accountName: "",
            accountNumber: "",
            routingNumber: "",
            bankName: "",
            accountType: "checking",
          },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const onSubmit = async (data: LocationsFormValues) => {
    try {
      await submitLocations({
        sessionId,
        hasMultipleLocations: data.locations.length > 1,
        locations: data.locations,
      });
      setStepStatus(4, "completed");

      // Immediately call step 6 to complete registration
      await completeRegistration({ sessionId });
      setStepStatus(6, "completed");

      showSuccess(
        "Registration complete",
        "Your application is being reviewed. You'll receive an email once approved."
      );
      navigate("/pending-approval");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save locations.";
      showError("Error", message);
    }
  };

  const handleSkip = async () => {
    try {
      setStepStatus(4, "skipped");

      // Call step 6 to complete registration
      await completeRegistration({ sessionId });
      setStepStatus(6, "completed");

      showSuccess(
        "Registration complete",
        "Your application is being reviewed. You'll receive an email once approved."
      );
      navigate("/pending-approval");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to complete registration.";
      showError("Error", message);
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            Step 4 · Gym locations & payment accounts
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Add each address you operate from and set up payment accounts for
            each location. You can always come back to add more later.
          </p>
        </div>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-border/60 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Location {index + 1}</p>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`locations.${index}.locationName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Gym" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${index}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`locations.${index}.city`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`locations.${index}.state`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Region</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`locations.${index}.zipCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`locations.${index}.country`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`locations.${index}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`locations.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="location@gym.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${index}.isHeadquarters`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4 space-y-4">
                <p className="font-medium text-sm">Payment Account</p>

                <FormField
                  control={form.control}
                  name={`locations.${index}.paymentAccount.accountName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account name</FormLabel>
                      <FormControl>
                        <Input placeholder="Gym Account Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <FormField
                    control={form.control}
                    name={`locations.${index}.paymentAccount.accountNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`locations.${index}.paymentAccount.routingNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456789"
                            maxLength={9}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 9) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <p className="text-muted-foreground text-xs">
                          Must be exactly 9 digits
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <FormField
                    control={form.control}
                    name={`locations.${index}.paymentAccount.bankName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank name</FormLabel>
                        <FormControl>
                          <Input placeholder="Chase Bank" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`locations.${index}.paymentAccount.accountType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="checking">Checking</SelectItem>
                            <SelectItem value="savings">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              append({
                locationName: "",
                address: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                phone: "",
                email: "",
                isHeadquarters: false,
                paymentAccount: {
                  accountName: "",
                  accountNumber: "",
                  routingNumber: "",
                  bankName: "",
                  accountType: "checking",
                },
              })
            }
          >
            Add another location
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            className="flex-1"
            disabled={isPending || isCompleting}
          >
            {isPending || isCompleting ? "Processing..." : "Save & continue"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleSkip}
            disabled={isCompleting}
          >
            {isCompleting ? "Processing..." : "Skip for now"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
