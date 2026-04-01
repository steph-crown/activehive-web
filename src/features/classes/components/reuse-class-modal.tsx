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
import { MultiSelect } from "@/components/ui/multi-select";
import { useLocationsQuery } from "@/features/locations/services";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useReuseClassMutation } from "../services";
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
  const { data: locations = [], isLoading: locationsLoading } =
    useLocationsQuery();

  const form = useForm<ReuseClassFormValues>({
    resolver: yupResolver(reuseClassSchema),
    defaultValues: {
      locationIds: [],
    },
  });

  const onSubmit = async (data: ReuseClassFormValues) => {
    try {
      await reuseClass({
        id: classItem.id,
        payload: { locationIds: data.locationIds },
      });
      showSuccess("Success", "Class reused successfully!");
      form.reset({ locationIds: [] });
      onSuccess();
    } catch (error) {
      showError(
        "Could not reuse class",
        getApiErrorMessage(error, "Failed to reuse class."),
      );
    }
  };

  const locationOptions = locations.map((loc) => ({
    value: loc.id,
    label: loc.locationName,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reuse Class</DialogTitle>
          <DialogDescription>
            Create copies of {classItem.name} for the locations you select.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="locationIds"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Locations</FormLabel>
                  <FormControl>
                    <MultiSelect
                      id="reuse-class-locations"
                      options={locationOptions}
                      value={field.value ?? []}
                      onValueChange={field.onChange}
                      placeholder="Select locations"
                      emptyMessage="No locations"
                      loading={locationsLoading}
                      multipleSelectedText="locations selected"
                      triggerClassName="border-[#F4F4F4] bg-white"
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
                onClick={() => {
                  onOpenChange(false);
                  form.reset({ locationIds: [] });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Reuse class
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
