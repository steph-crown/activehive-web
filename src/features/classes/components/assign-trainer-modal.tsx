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
import { useTrainersQuery } from "@/features/trainers/services";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAssignTrainerMutation } from "../services";
import type { Class } from "../types";

const assignTrainerSchema = yup.object({
  trainerId: yup.string().required("Trainer is required"),
});

type AssignTrainerFormValues = yup.InferType<typeof assignTrainerSchema>;

export function classHasAssignedTrainer(c: Class): boolean {
  return Boolean(c.trainer) || Boolean(c.trainerId);
}

interface AssignTrainerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classItem: Class;
  onSuccess: () => void;
}

export function AssignTrainerModal({
  open,
  onOpenChange,
  classItem,
  onSuccess,
}: AssignTrainerModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: assignTrainer, isPending } = useAssignTrainerMutation();
  const isReassign = classHasAssignedTrainer(classItem);

  const listParams = classItem.locationId
    ? { locationId: classItem.locationId }
    : {};
  const { data: trainers = [], isLoading: trainersLoading } = useTrainersQuery(
    listParams,
    { enabled: open },
  );

  const form = useForm<AssignTrainerFormValues>({
    resolver: yupResolver(assignTrainerSchema),
    defaultValues: {
      trainerId: classItem.trainerId || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        trainerId: classItem.trainerId || "",
      });
    }
  }, [open, classItem.id, classItem.trainerId, form]);

  const onSubmit = async (data: AssignTrainerFormValues) => {
    try {
      await assignTrainer({
        id: classItem.id,
        payload: { trainerId: data.trainerId },
      });
      showSuccess(
        "Success",
        isReassign
          ? "Trainer updated successfully."
          : "Trainer assigned successfully.",
      );
      onSuccess();
    } catch (error) {
      showError(
        isReassign ? "Could not reassign trainer" : "Could not assign trainer",
        getApiErrorMessage(
          error,
          isReassign
            ? "Failed to reassign trainer."
            : "Failed to assign trainer.",
        ),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[500px] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isReassign ? "Reassign trainer" : "Assign trainer"}
          </DialogTitle>
          <DialogDescription>
            {isReassign
              ? `Choose a new trainer for ${classItem.name}. They must be assigned to this class location.`
              : `Assign a trainer to ${classItem.name}. They must be assigned to this class location.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full max-w-full gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="trainerId"
              render={({ field }) => (
                <FormItem className="w-full max-w-full">
                  <FormLabel>Trainer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={trainersLoading}
                  >
                    <FormControl className="block w-full max-w-full">
                      <SelectTrigger className="!h-10 w-full max-w-full">
                        <SelectValue
                          placeholder={
                            trainersLoading
                              ? "Loading trainers…"
                              : "Select a trainer"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset({
                    trainerId: classItem.trainerId || "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                {isReassign ? "Reassign trainer" : "Assign trainer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
