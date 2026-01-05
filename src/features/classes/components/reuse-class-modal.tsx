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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useReuseClassMutation } from "../services";
import { useLocationsQuery } from "@/features/locations/services";
import type { Class } from "../types";

const reuseClassSchema = yup.object({
  locationIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one location")
    .required(),
});

type ReuseClassFormValues = yup.InferType<typeof reuseClassSchema>;

interface ReuseClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classItem: Class;
  onSuccess: () => void;
}

export function ReuseClassModal({
  open,
  onOpenChange,
  classItem,
  onSuccess,
}: ReuseClassModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: reuseClass, isPending } = useReuseClassMutation();
  const { data: locations } = useLocationsQuery();

  const form = useForm<ReuseClassFormValues>({
    resolver: yupResolver(reuseClassSchema),
    defaultValues: {
      locationIds: [],
    },
  });

  const selectedLocationIds = form.watch("locationIds");

  const onSubmit = async (data: ReuseClassFormValues) => {
    try {
      await reuseClass({
        id: classItem.id,
        payload: { locationIds: data.locationIds },
      });
      showSuccess("Success", "Class reused successfully!");
      form.reset({
        locationIds: [],
      });
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reuse class.";
      showError("Error", message);
    }
  };

  const handleLocationToggle = (locationId: string) => {
    const currentIds = form.getValues("locationIds");
    const newIds = currentIds.includes(locationId)
      ? currentIds.filter((id) => id !== locationId)
      : [...currentIds, locationId];
    form.setValue("locationIds", newIds);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reuse Class</DialogTitle>
          <DialogDescription>
            Create copies of {classItem.name} for other locations
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
                  <FormLabel>Select Locations</FormLabel>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {locations?.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={location.id}
                          checked={selectedLocationIds.includes(location.id)}
                          onCheckedChange={() =>
                            handleLocationToggle(location.id)
                          }
                        />
                        <label
                          htmlFor={location.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {location.locationName}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset({
                    locationIds: [],
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Reusing..." : "Reuse Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
