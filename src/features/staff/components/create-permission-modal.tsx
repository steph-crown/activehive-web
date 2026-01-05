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
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreatePermissionMutation } from "../services";

const createPermissionSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  code: yup.string().required("Code is required"),
});

type CreatePermissionFormValues = yup.InferType<typeof createPermissionSchema>;

interface CreatePermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePermissionModal({
  open,
  onOpenChange,
  onSuccess,
}: CreatePermissionModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: createPermission, isPending } =
    useCreatePermissionMutation();

  const form = useForm<CreatePermissionFormValues>({
    resolver: yupResolver(createPermissionSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      code: "",
    },
  });

  const onSubmit = async (data: CreatePermissionFormValues) => {
    try {
      const payload = {
        name: data.name,
        code: data.code,
        ...(data.description?.trim() && { description: data.description.trim() }),
      };
      await createPermission(payload);
      showSuccess("Success", "Permission created successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create permission.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Custom Permission</DialogTitle>
          <DialogDescription>
            Create a custom permission specific to your gym.
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
                    <Input placeholder="Member Check-in" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="member.checkin" {...field} />
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
                    <Input placeholder="Description" {...field} value={field.value || ""} />
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
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Permission"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
