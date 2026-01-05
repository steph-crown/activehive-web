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
import { useLocationsQuery } from "@/features/locations/services";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAssignLocationsMutation } from "../services";
import type { Staff } from "../types";

const assignLocationsSchema = yup.object({
  locationIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one location is required")
    .required(),
});

type AssignLocationsFormValues = yup.InferType<typeof assignLocationsSchema>;

interface AssignLocationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSuccess: () => void;
}

export function AssignLocationsModal({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: AssignLocationsModalProps) {
  const { showSuccess, showError } = useToast();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { mutateAsync: assignLocations, isPending } =
    useAssignLocationsMutation();

  const form = useForm<AssignLocationsFormValues>({
    resolver: yupResolver(assignLocationsSchema),
    defaultValues: {
      locationIds: staff?.locationIds || [],
    },
  });

  const selectedLocationIds = form.watch("locationIds");

  const handleLocationToggle = (locationId: string) => {
    const currentIds = form.getValues("locationIds");
    const newIds = currentIds.includes(locationId)
      ? currentIds.filter((id) => id !== locationId)
      : [...currentIds, locationId];
    form.setValue("locationIds", newIds);
  };

  const onSubmit = async (data: AssignLocationsFormValues) => {
    if (!staff) return;

    try {
      await assignLocations({
        staffId: staff.id,
        payload: { locationIds: data.locationIds },
      });
      showSuccess("Success", "Locations assigned successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to assign locations.";
      showError("Error", message);
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Locations</DialogTitle>
          <DialogDescription>
            Assign or update location assignments for {staff.firstName}{" "}
            {staff.lastName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="locationIds"
              render={() => (
                <FormItem>
                  <FormLabel>Locations</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                      {locationsLoading ? (
                        <div className="text-sm text-muted-foreground">
                          Loading locations...
                        </div>
                      ) : locations && locations.length > 0 ? (
                        <div className="space-y-2">
                          {locations.map((location) => (
                            <div
                              key={location.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`location-${location.id}`}
                                checked={selectedLocationIds.includes(
                                  location.id
                                )}
                                onChange={() =>
                                  handleLocationToggle(location.id)
                                }
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <label
                                htmlFor={`location-${location.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {location.locationName}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No locations available
                        </div>
                      )}
                    </div>
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
                {isPending ? "Assigning..." : "Assign Locations"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
