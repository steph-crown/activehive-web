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
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { useCreateTemplateMutation } from "../services";
import { IconPlus, IconTrash } from "@tabler/icons-react";

const createTemplateSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  capacity: yup.number().min(1, "Capacity must be at least 1").required(),
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
  category: yup.string().required("Category is required"),
  difficulty: yup.string().required("Difficulty is required"),
  duration: yup.number().min(1, "Duration must be at least 1").required(),
  equipment: yup.array().of(yup.string()).default([]).required(),
});

type CreateTemplateFormValues = yup.InferType<typeof createTemplateSchema>;

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTemplateModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateTemplateModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: createTemplate, isPending } =
    useCreateTemplateMutation();

  const form = useForm<CreateTemplateFormValues>({
    resolver: yupResolver(createTemplateSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      capacity: 20,
      schedules: [
        {
          date: "",
          startTime: "",
          endTime: "",
          notes: "",
        },
      ],
      category: "",
      difficulty: "",
      duration: 60,
      equipment: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  const onSubmit = async (data: CreateTemplateFormValues) => {
    try {
      const payload = {
        ...data,
        schedules: data.schedules.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          notes: s.notes || undefined,
        })),
        description: data.description || undefined,
        equipment: data.equipment.filter((e): e is string => e !== undefined),
      };
      await createTemplate(payload);
      showSuccess("Success", "Template created successfully!");
      form.reset({
        name: "",
        description: "",
        capacity: 20,
        schedules: [
          {
            date: "",
            startTime: "",
            endTime: "",
            notes: "",
          },
        ],
        category: "",
        difficulty: "",
        duration: 60,
        equipment: [],
      });
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create template.";
      showError("Error", message);
    }
  };

  const categories = [
    "Yoga",
    "Pilates",
    "Cardio",
    "Strength Training",
    "HIIT",
    "Dance",
    "Martial Arts",
    "Swimming",
    "Cycling",
    "Other",
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>
            Create a template class that can be used by gym owners
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Standard Yoga Class" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A standard yoga class template"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    name: "",
                    description: "",
                    capacity: 20,
                    schedules: [
                      {
                        date: "",
                        startTime: "",
                        endTime: "",
                        notes: "",
                      },
                    ],
                    category: "",
                    difficulty: "",
                    duration: 60,
                    equipment: [],
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Template"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
