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
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUpdateClassMutation } from "../services";
import { useStaffQuery } from "@/features/staff/services";
import type { Class } from "../types";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import * as React from "react";

const updateClassSchema = yup.object({
  name: yup.string().optional(),
  description: yup.string().optional(),
  capacity: yup.number().min(1, "Capacity must be at least 1").optional(),
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
    .optional(),
  category: yup.string().optional(),
  difficulty: yup.string().optional(),
  duration: yup.number().min(1, "Duration must be at least 1").optional(),
  equipment: yup.array().of(yup.string()).optional(),
  isActive: yup.boolean().optional(),
});

type UpdateClassFormValues = yup.InferType<typeof updateClassSchema>;

interface UpdateClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classItem: Class;
  onSuccess: () => void;
}

export function UpdateClassModal({
  open,
  onOpenChange,
  classItem,
  onSuccess,
}: UpdateClassModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: updateClass, isPending } = useUpdateClassMutation();
  const { data: staff } = useStaffQuery();

  const form = useForm<UpdateClassFormValues>({
    resolver: yupResolver(updateClassSchema) as any,
    defaultValues: {
      name: classItem.name,
      description: classItem.description || "",
      capacity: classItem.capacity,
      trainerId: classItem.trainerId || "none",
      schedules: classItem.schedules.map((s) => ({
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        notes: s.notes || "",
      })),
      category: classItem.metadata?.category || "",
      difficulty: classItem.metadata?.difficulty || "",
      duration: classItem.metadata?.duration || 60,
      equipment: classItem.metadata?.equipment || [],
      isActive: classItem.isActive,
    },
  });

  React.useEffect(() => {
    if (classItem) {
      form.reset({
        name: classItem.name,
        description: classItem.description || "",
        capacity: classItem.capacity,
        trainerId: classItem.trainerId || "none",
        schedules: classItem.schedules.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          notes: s.notes || "",
        })),
        category: classItem.metadata?.category || "",
        difficulty: classItem.metadata?.difficulty || "",
        duration: classItem.metadata?.duration || 60,
        equipment: classItem.metadata?.equipment || [],
        isActive: classItem.isActive,
      });
    }
  }, [classItem, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  const onSubmit = async (data: UpdateClassFormValues) => {
    try {
      const payload: any = {};
      if (data.name) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description || undefined;
      if (data.capacity) payload.capacity = data.capacity;
      if (data.trainerId !== undefined) payload.trainerId = data.trainerId === "none" ? undefined : data.trainerId || undefined;
      if (data.schedules) {
        payload.schedules = data.schedules.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          notes: s.notes || undefined,
        }));
      }
      if (data.category) payload.category = data.category;
      if (data.difficulty) payload.difficulty = data.difficulty;
      if (data.duration) payload.duration = data.duration;
      if (data.equipment) payload.equipment = data.equipment;
      if (data.isActive !== undefined) payload.isActive = data.isActive;

      await updateClass({
        id: classItem.id,
        payload,
      });
      showSuccess("Success", "Class updated successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update class.";
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
          <DialogTitle>Update Class</DialogTitle>
          <DialogDescription>
            Update class information for {classItem.name}
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
                    <Input placeholder="Morning Yoga" {...field} />
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
                      placeholder="A relaxing morning yoga session"
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

            <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Whether this class is currently active
                    </p>
                  </div>
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
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
