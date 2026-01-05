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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAssignTrainerMutation } from "../services";
import { useStaffQuery } from "@/features/staff/services";
import type { Class } from "../types";

const assignTrainerSchema = yup.object({
  trainerId: yup.string().required("Trainer is required"),
});

type AssignTrainerFormValues = yup.InferType<typeof assignTrainerSchema>;

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
  const { data: staff } = useStaffQuery();

  const form = useForm<AssignTrainerFormValues>({
    resolver: yupResolver(assignTrainerSchema),
    defaultValues: {
      trainerId: classItem.trainerId || "",
    },
  });

  const onSubmit = async (data: AssignTrainerFormValues) => {
    try {
      await assignTrainer({
        id: classItem.id,
        payload: { trainerId: data.trainerId },
      });
      showSuccess("Success", "Trainer assigned successfully!");
      form.reset({
        trainerId: "",
      });
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to assign trainer.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Trainer</DialogTitle>
          <DialogDescription>
            Assign a trainer to {classItem.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="trainerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trainer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset({
                    trainerId: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Assigning..." : "Assign Trainer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
