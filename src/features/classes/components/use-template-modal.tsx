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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { useUseTemplateMutation, useTemplatesQuery } from "../services";
import { useLocationsQuery } from "@/features/locations/services";
import { useStaffQuery } from "@/features/staff/services";
import type { ClassTemplate } from "../types";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import * as React from "react";

const useTemplateSchema = yup.object({
  templateClassId: yup.string().required("Template is required"),
  locationId: yup.string().required("Location is required"),
  trainerId: yup.string().optional(),
  schedules: yup
    .array()
    .of(
      yup.object({
        date: yup.string().required("Date is required"),
        startTime: yup.string().required("Start time is required"),
        endTime: yup.string().required("End time is required"),
        notes: yup.string().optional(),
      })
    )
    .min(1, "At least one schedule is required")
    .required(),
});

type UseTemplateFormValues = yup.InferType<typeof useTemplateSchema>;

interface UseTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: ClassTemplate | null;
  onSuccess: () => void;
}

export function UseTemplateModal({
  open,
  onOpenChange,
  selectedTemplate,
  onSuccess,
}: UseTemplateModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: useTemplate, isPending } = useUseTemplateMutation();
  const { data: templates } = useTemplatesQuery();
  const { data: locations } = useLocationsQuery();
  const { data: staff } = useStaffQuery();

  const form = useForm<UseTemplateFormValues>({
    resolver: yupResolver(useTemplateSchema) as any,
    defaultValues: {
      templateClassId: selectedTemplate?.id || "",
      locationId: "",
      trainerId: "",
      schedules: [
        {
          date: "",
          startTime: "",
          endTime: "",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  React.useEffect(() => {
    if (selectedTemplate) {
      form.setValue("templateClassId", selectedTemplate.id);
      if (selectedTemplate.schedules.length > 0) {
        form.setValue(
          "schedules",
          selectedTemplate.schedules.map((s) => ({
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
            notes: s.notes || undefined,
          }))
        );
      }
    }
  }, [selectedTemplate, form]);

  const onSubmit = async (data: UseTemplateFormValues) => {
    try {
      const payload = {
        templateClassId: data.templateClassId,
        locationId: data.locationId,
        trainerId: data.trainerId === "none" ? undefined : data.trainerId || undefined,
        schedules: data.schedules.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          notes: s.notes || undefined,
        })),
      };
      await useTemplate(payload);
      showSuccess("Success", "Class created from template successfully!");
      form.reset({
        templateClassId: "",
        locationId: "",
        trainerId: "",
        schedules: [
          {
            date: "",
            startTime: "",
            endTime: "",
            notes: "",
          },
        ],
      });
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to use template.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Use Template</DialogTitle>
          <DialogDescription>
            Create a class from a template for your location
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="templateClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                name="trainerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="No trainer assigned" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Trainer</SelectItem>
                        {staff?.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Schedules</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      date: "",
                      startTime: "",
                      endTime: "",
                      notes: "",
                    })
                  }
                >
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Schedule
                </Button>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-4 gap-2 mb-2 items-end"
                >
                  <FormField
                    control={form.control}
                    name={`schedules.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedules.${index}.startTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedules.${index}.endTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset({
                    templateClassId: "",
                    locationId: "",
                    trainerId: "",
                    schedules: [
                      {
                        date: "",
                        startTime: "",
                        endTime: "",
                        notes: "",
                      },
                    ],
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
