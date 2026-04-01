import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUpload } from "@/hooks/use-upload";
import { NIGERIA_STATES } from "@/features/gym-owner-registration/constants/nigeria-states";
import {
  ONBOARDING_COUNTRY,
  ONBOARDING_COUNTRY_OPTIONS,
} from "@/features/gym-owner-registration/constants/country-options";

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
  const { upload, isUploading } = useUpload();
  const [isSkipping, setIsSkipping] = useState(false);

  const form = useForm<LocationsFormValues>({
    resolver: yupResolver(locationsSchema) as never,
    defaultValues: {
      locations: [
        {
          locationName: "",
          address: "",
          city: "",
          state: "",
          country: ONBOARDING_COUNTRY,
          phone: "",
          email: "",
          isHeadquarters: true,
          coverImageFile: undefined,
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
      const mappedLocations = [];

      for (const location of data.locations) {
        let coverImage: string | undefined;
        if (location.coverImageFile) {
          coverImage = await upload(location.coverImageFile, "gym-locations");
        }

        const { coverImageFile, ...rest } = location;

        mappedLocations.push({
          ...rest,
          zipCode: "",
          coverImage,
        });
      }

      await submitLocations({
        sessionId,
        hasMultipleLocations: data.locations.length > 1,
        locations: mappedLocations,
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

  const isFormSubmitBusy =
    isPending || isUploading || (isCompleting && !isSkipping);

  const handleSkip = async () => {
    setIsSkipping(true);
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
    } finally {
      setIsSkipping(false);
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
            Step 4 · Gym locations
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Add each address you operate from. You can always come back to add
            more later.
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

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`locations.${index}.state`}
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>State / Region</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="h-10 w-full min-w-0">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {NIGERIA_STATES.map((state) => (
                              <SelectItem
                                key={state.value}
                                value={state.value}
                              >
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`locations.${index}.city`}
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`locations.${index}.country`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value ?? ONBOARDING_COUNTRY}
                      >
                        <SelectTrigger className="h-10 w-full min-w-0">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {ONBOARDING_COUNTRY_OPTIONS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Input
                        placeholder="Enter phone number"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name={`locations.${index}.coverImageFile`}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Cover image (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        {...field}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          const isChecked = Boolean(checked);
                          const locations = form.getValues("locations");
                          locations.forEach((_, i) => {
                            form.setValue(
                              `locations.${i}.isHeadquarters`,
                              i === index ? isChecked : false
                            );
                          });
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as headquarters</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Only one location can be marked as headquarters at a time.
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                country: ONBOARDING_COUNTRY,
                phone: "",
                email: "",
                isHeadquarters: false,
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
            loading={isFormSubmitBusy}
            disabled={isFormSubmitBusy || isSkipping}
          >
            Save & continue
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => void handleSkip()}
            disabled={isFormSubmitBusy || isSkipping}
            loading={isSkipping}
          >
            Skip for now
          </Button>
        </div>
      </form>
    </Form>
  );
}
