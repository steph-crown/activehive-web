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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import * as React from "react";
import * as yup from "yup";
import { staffFullName, staffLocationIds } from "../lib/staff-display";
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
      locationIds: [],
    },
  });

  React.useEffect(() => {
    if (!open || !staff) return;
    form.reset({
      locationIds: staffLocationIds(staff),
    });
  }, [open, staff, form]);

  const selectedLocationIds = form.watch("locationIds");

  const handleLocationToggle = (locationId: string) => {
    const currentIds = form.getValues("locationIds");
    const newIds = currentIds.includes(locationId)
      ? currentIds.filter((id) => id !== locationId)
      : [...currentIds, locationId];
    form.setValue("locationIds", newIds, { shouldValidate: true });
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
          <DialogTitle>Assign locations</DialogTitle>
          <DialogDescription>
            Choose one or more locations for {staffFullName(staff)}. Open the
            dropdown to add or remove assignments.
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
                  <FormLabel>Locations *</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="!h-10 w-full justify-between font-normal border-[#F4F4F4]"
                          disabled={locationsLoading}
                        >
                          <span className="truncate">
                            {selectedLocationIds.length > 0
                              ? `${selectedLocationIds.length} location(s) selected`
                              : "Select locations"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="max-h-64 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
                      >
                        {locationsLoading ? (
                          <div className="text-muted-foreground px-2 py-1.5 text-sm">
                            Loading locations…
                          </div>
                        ) : locations && locations.length > 0 ? (
                          locations.map((location) => (
                            <DropdownMenuCheckboxItem
                              key={location.id}
                              checked={selectedLocationIds.includes(
                                location.id,
                              )}
                              onCheckedChange={() =>
                                handleLocationToggle(location.id)
                              }
                              onSelect={(e) => e.preventDefault()}
                            >
                              {location.locationName}
                            </DropdownMenuCheckboxItem>
                          ))
                        ) : (
                          <div className="text-muted-foreground px-2 py-1.5 text-sm">
                            No locations available
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              <Button type="submit" loading={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
