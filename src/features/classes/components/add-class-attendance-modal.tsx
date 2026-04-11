import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useMembersQuery } from "@/features/members/services";
import { useAddClassScheduleAttendanceMutation } from "../services";
import type { Class } from "../types";
import { formatScheduleSessionLabel } from "../utils/format-schedule-display";

const schema = yup.object({
  classScheduleId: yup.string().required("Select a session"),
  memberIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one member who attended"),
  notes: yup.string().optional(),
});

type FormValues = {
  classScheduleId: string;
  memberIds: string[];
  notes?: string;
};

export interface AddClassAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classItem: Class;
  onSuccess: () => void;
}

export function AddClassAttendanceModal({
  open,
  onOpenChange,
  classItem,
  onSuccess,
}: Readonly<AddClassAttendanceModalProps>) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: addAttendance, isPending } =
    useAddClassScheduleAttendanceMutation();

  const { data: subscriptions, isLoading: membersLoading } = useMembersQuery(
    classItem.locationId ?? undefined,
  );

  const memberOptions = React.useMemo(() => {
    const byId = new Map<string, string>();
    for (const sub of subscriptions ?? []) {
      const m = sub.member;
      const label = `${m.firstName} ${m.lastName}`.trim();
      if (!byId.has(m.id)) {
        byId.set(m.id, label || m.email);
      }
    }
    return Array.from(byId.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [subscriptions]);

  const form = useForm<FormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues: {
      classScheduleId: "",
      memberIds: [],
      notes: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    const firstId = classItem.schedules[0]?.id ?? "";
    form.reset({
      classScheduleId: firstId,
      memberIds: [],
      notes: "",
    });
  }, [open, classItem.schedules, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await addAttendance({
        classId: classItem.id,
        classScheduleId: data.classScheduleId,
        payload: {
          memberIds: [...data.memberIds],
          notes: data.notes?.trim() || undefined,
        },
      });
      showSuccess("Attendance recorded", "Members marked as attended.");
      onSuccess();
    } catch (error) {
      showError(
        "Could not save attendance",
        getApiErrorMessage(error, "Something went wrong. Try again."),
      );
    }
  };

  const hasSchedules = classItem.schedules.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add attendance</DialogTitle>
          <DialogDescription>
            Choose the session and members who attended. Past sessions may mark
            non-selected bookings as no-show per your gym rules.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="classScheduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!hasSchedules}
                  >
                    <FormControl>
                      <SelectTrigger className="!h-10 w-full">
                        <SelectValue
                          placeholder={
                            hasSchedules
                              ? "Select date & time"
                              : "No sessions scheduled"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classItem.schedules.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {formatScheduleSessionLabel(s)}
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
              name="memberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members who attended</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={memberOptions}
                      value={field.value ?? []}
                      onValueChange={field.onChange}
                      placeholder="Select members…"
                      emptyMessage="No members for this location"
                      loading={membersLoading}
                      multipleSelectedText="members selected"
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    List shows members linked to this class location. Adjust if
                    your team uses a different booking source.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Full session completed"
                      className="min-h-[88px] resize-y"
                      {...field}
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
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isPending}
                disabled={!hasSchedules}
              >
                Save attendance
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
