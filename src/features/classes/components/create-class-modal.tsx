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
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import * as yup from "yup";
import { useCreateClassMutation } from "../services";
import { useLocationsQuery } from "@/features/locations/services";
import { useTrainersQuery } from "@/features/trainers/services";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import * as React from "react";

function localDateKey(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function localTimeKey(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function parseLocalDateTime(dateKey: string, timeKey: string): Date | null {
  if (!dateKey || !timeKey) return null;
  const [yyyy, mm, dd] = dateKey.split("-").map(Number);
  const [hh, min] = timeKey.split(":").map(Number);
  if (
    !Number.isFinite(yyyy) ||
    !Number.isFinite(mm) ||
    !Number.isFinite(dd) ||
    !Number.isFinite(hh) ||
    !Number.isFinite(min)
  ) {
    return null;
  }
  return new Date(yyyy, mm - 1, dd, hh, min, 0, 0);
}

const createClassSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  capacity: yup.number().min(1, "Capacity must be at least 1").required(),
  locationId: yup.string().optional(),
  trainerId: yup.string().optional(),
  schedules: yup
    .array()
    .of(
      yup.object({
        date: yup
          .string()
          .required("Date is required")
          .test("not-in-past", "Date cannot be in the past", (value) => {
            if (!value) return false;
            const today = localDateKey(new Date());
            return value >= today;
          }),
        startTime: yup
          .string()
          .required("Start time is required")
          .test(
            "future-if-today",
            "Start time must be in the future",
            function (value) {
              const { date } = this.parent as { date?: string };
              if (!date || !value) return false;
              const now = new Date();
              const today = localDateKey(now);
              if (date !== today) return true;
              const start = parseLocalDateTime(date, value);
              if (!start) return false;
              return start.getTime() > now.getTime();
            },
          ),
        notes: yup.string().optional(),
      }),
    )
    .min(1, "At least one schedule is required")
    .required(),
  category: yup.string().required("Category is required"),
  difficulty: yup.string().required("Difficulty is required"),
  duration: yup.number().min(1, "Duration must be at least 1").required(),
  equipment: yup.array().of(yup.string()).default([]).required(),
});

type CreateClassFormValues = yup.InferType<typeof createClassSchema>;

/** API expects `HH:mm:ss` (e.g. `09:00:00`). */
function toApiTime(time: string): string {
  const t = time.trim();
  if (!t) return t;
  const parts = t.split(":");
  const h = (parts[0] ?? "00").padStart(2, "0");
  const m = (parts[1] ?? "00").padStart(2, "0");
  const s = (parts[2] ?? "00").replace(/\D/g, "").slice(0, 2).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

interface CreateClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateClassModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateClassModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: createClass, isPending } = useCreateClassMutation();
  const { data: locations } = useLocationsQuery();

  const form = useForm<CreateClassFormValues>({
    resolver: yupResolver(createClassSchema) as never,
    defaultValues: {
      name: "",
      description: "",
      capacity: 20,
      locationId: undefined,
      trainerId: undefined,
      schedules: [
        {
          date: "",
          startTime: "",
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

  const watchedSchedules = useWatch({
    control: form.control,
    name: "schedules",
  });

  const watchedLocationId = useWatch({
    control: form.control,
    name: "locationId",
  });

  const { data: trainers = [], isLoading: trainersLoading } = useTrainersQuery(
    watchedLocationId ? { locationId: watchedLocationId } : {},
    { enabled: open },
  );

  const prevLocationId = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (!open) {
      prevLocationId.current = undefined;
      return;
    }
    const prev = prevLocationId.current;
    if (prev !== undefined && prev !== watchedLocationId) {
      form.setValue("trainerId", undefined);
    }
    prevLocationId.current = watchedLocationId;
  }, [open, watchedLocationId, form]);

  const addMinutesToTime = (time: string, minutesToAdd: number) => {
    const [hoursRaw, minutesRaw] = time.split(":");
    const hours = Number(hoursRaw);
    const minutes = Number(minutesRaw);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      !Number.isFinite(minutesToAdd)
    ) {
      // Fallback: if parsing fails, keep the original startTime.
      return time;
    }

    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  const onSubmit = async (data: CreateClassFormValues) => {
    try {
      const payload = {
        name: data.name,
        capacity: data.capacity,
        category: data.category,
        difficulty: data.difficulty,
        duration: data.duration,
        equipment: data.equipment.filter((e): e is string => e !== undefined),
        schedules: data.schedules.map((s) => ({
          date: s.date,
          startTime: toApiTime(s.startTime),
          endTime: toApiTime(
            addMinutesToTime(s.startTime, data.duration),
          ),
        })),
        locationId:
          data.locationId === "none" ? undefined : data.locationId || undefined,
        trainerId:
          data.trainerId === "none" ? undefined : data.trainerId || undefined,
        description: data.description || undefined,
      };
      await createClass(payload);
      showSuccess("Success", "Class created successfully!");
      form.reset({
        name: "",
        description: "",
        capacity: 20,
        locationId: undefined,
        trainerId: undefined,
        schedules: [
          {
            date: "",
            startTime: "",
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
      showError(
        "Could not create class",
        getApiErrorMessage(error, "Failed to create class."),
      );
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
  const todayKey = localDateKey(new Date());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>
            Create a new class for your gym location
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
                  <FormLabel>Name *</FormLabel>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity *</FormLabel>
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
                    <FormLabel>Duration (minutes) *</FormLabel>
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="!h-10 w-full">
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
                      disabled={trainersLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="!h-10 w-full">
                          <SelectValue
                            placeholder={
                              trainersLoading
                                ? "Loading trainers…"
                                : "No trainer assigned"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Trainer</SelectItem>
                        {trainers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {`${t.firstName} ${t.lastName}`.trim() || t.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="!h-10 w-full">
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
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? undefined : value)
                      }
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="!h-10 w-full">
                          <SelectValue placeholder="Gym-level (all locations)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Gym-level (all locations)</SelectItem>
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
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Schedules *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      date: "",
                      startTime: "",
                      notes: "",
                    })
                  }
                >
                  <IconPlus className="h-4 w-4 " />
                  Add Schedule
                </Button>
              </div>
              {fields.map((field, index) => (
                // Use the watched values for dynamic input constraints.
                <div
                  key={field.id}
                  className="mb-2 flex w-full items-end gap-2"
                >
                  <FormField
                    control={form.control}
                    name={`schedules.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={todayKey}
                            {...field}
                            onChange={(event) => {
                              const nextDate = event.target.value;
                              field.onChange(nextDate);
                              const currentStartTime =
                                watchedSchedules?.[index]?.startTime ?? "";
                              if (!currentStartTime) return;
                              const now = new Date();
                              const nowMinTime = localTimeKey(now);
                              if (nextDate === localDateKey(now)) {
                                if (currentStartTime <= nowMinTime) {
                                  form.setValue(
                                    `schedules.${index}.startTime`,
                                    "",
                                  );
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedules.${index}.startTime`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Start Time *</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            min={
                              watchedSchedules?.[index]?.date === todayKey
                                ? localTimeKey(new Date())
                                : undefined
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
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
                    locationId: undefined,
                    trainerId: undefined,
                    schedules: [
                      {
                        date: "",
                        startTime: "",
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
              <Button type="submit" loading={isPending}>
                Create Class
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
