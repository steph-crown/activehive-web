import { getApiErrorMessage } from "@/lib/get-api-error-message";
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
import { Textarea } from "@/components/ui/textarea";
import { TimeSelect } from "@/components/ui/time-select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
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
import { useMembershipPlansQuery } from "@/features/membership-plans/services";
import { staffFullName } from "@/features/staff/lib/staff-display";
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
      }),
    )
    .optional(),
  membershipPlanIds: yup.array().of(yup.string().required()).default([]),
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
  const { data: membershipPlans = [], isLoading: plansLoading } =
    useMembershipPlansQuery();

  // A plan tied to a location can only book classes at that location.
  const selectablePlans = React.useMemo(
    () =>
      membershipPlans.filter(
        (p) =>
          p.isActive &&
          (!classItem.locationId ||
            !p.locationId ||
            p.locationId === classItem.locationId),
      ),
    [membershipPlans, classItem.locationId],
  );

  const planOptions = React.useMemo(
    () =>
      selectablePlans.map((p) => ({
        value: p.id,
        label: p.location?.locationName
          ? `${p.name} (${p.location.locationName})`
          : p.name,
      })),
    [selectablePlans],
  );

  const form = useForm<UpdateClassFormValues>({
    resolver: yupResolver(updateClassSchema) as any,
    defaultValues: {
      name: classItem.name,
      description: classItem.description || "",
      capacity: classItem.capacity,
      trainerId: classItem.trainerId || "none",
      membershipPlanIds:
        classItem.membershipPlans?.map((p) => p.id) ?? [],
      schedules: (classItem.schedules ?? []).map((s) => ({
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
        membershipPlanIds:
          classItem.membershipPlans?.map((p) => p.id) ?? [],
        schedules: (classItem.schedules ?? []).map((s) => ({
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
      if (data.description !== undefined)
        payload.description = data.description || undefined;
      if (data.capacity) payload.capacity = data.capacity;
      if (data.trainerId !== undefined)
        payload.trainerId =
          data.trainerId === "none" ? undefined : data.trainerId || undefined;
      if (data.membershipPlanIds !== undefined)
        payload.membershipPlanIds = data.membershipPlanIds;
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
      showError("Error", getApiErrorMessage(error, "Failed to update class."));
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
                    <Textarea
                      rows={3}
                      placeholder="A relaxing morning yoga session"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid items-start grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        onFocus={(e) => e.target.select()}
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
                        onFocus={(e) => e.target.select()}
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

            <div className="grid items-start grid-cols-2 gap-4">
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
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? undefined : value)
                      }
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
                            {staffFullName(member)}
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
              name="membershipPlanIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Plans (Optional)</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={planOptions}
                      value={field.value ?? []}
                      onValueChange={field.onChange}
                      loading={plansLoading}
                      placeholder="Select plans that can book this class"
                      emptyMessage="No membership plans available"
                      multipleSelectedText="plans selected"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Members on the selected plans will be able to book this
                    class.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <IconPlus className="h-4 w-4 " />
                  Add Schedule
                </Button>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mb-2 grid grid-cols-4 items-start gap-2"
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
                          <TimeSelect
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
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
                          <TimeSelect
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    aria-label="Remove schedule"
                    className="mt-6 flex h-10 items-center justify-center text-muted-foreground transition-colors hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
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
