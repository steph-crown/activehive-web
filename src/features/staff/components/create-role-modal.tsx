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
import { useCreateRoleMutation } from "../services";
import { PERMISSION_FEATURE_GROUPS } from "../constants/permission-groups";
import { PermissionsSelect } from "./permissions-select";

const createRoleSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  permissionCodes: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one permission")
    .required(),
});

type CreateRoleFormValues = yup.InferType<typeof createRoleSchema>;

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateRoleModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateRoleModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: createRole, isPending } = useCreateRoleMutation();

  const form = useForm<CreateRoleFormValues>({
    resolver: yupResolver(createRoleSchema) as never,
    defaultValues: {
      name: "",
      description: "",
      permissionCodes: [],
    },
  });

  const onSubmit = async (data: CreateRoleFormValues) => {
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() ?? "",
        permissionCodes: data.permissionCodes,
      };
      await createRole(payload);
      showSuccess("Success", "Role created successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create role.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Create a custom role specific to your gym with assigned permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Front Desk Staff" {...field} />
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
                      placeholder="Description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissionCodes"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Select entire features quickly, or expand each feature to
                    pick specific permissions.
                  </p>
                  <FormControl>
                    <PermissionsSelect
                      groups={PERMISSION_FEATURE_GROUPS}
                      value={form.watch("permissionCodes")}
                      onChange={(next) =>
                        form.setValue("permissionCodes", next)
                      }
                      disabled={isPending}
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
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Create Role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
