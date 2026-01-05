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
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useCreateRoleMutation,
  useAvailablePermissionsQuery,
} from "../services";

const createRoleSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  code: yup.string().required("Code is required"),
  permissionIds: yup
    .array()
    .of(yup.string().required())
    .min(0, "At least one permission is required")
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
  const { data: permissions, isLoading: permissionsLoading } =
    useAvailablePermissionsQuery();
  const { mutateAsync: createRole, isPending } = useCreateRoleMutation();

  const form = useForm<CreateRoleFormValues>({
    resolver: yupResolver(createRoleSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      code: "",
      permissionIds: [],
    },
  });

  const selectedPermissionIds = form.watch("permissionIds");

  const handlePermissionToggle = (permissionId: string) => {
    const currentIds = form.getValues("permissionIds");
    const newIds = currentIds.includes(permissionId)
      ? currentIds.filter((id) => id !== permissionId)
      : [...currentIds, permissionId];
    form.setValue("permissionIds", newIds);
  };

  const onSubmit = async (data: CreateRoleFormValues) => {
    try {
      const payload = {
        name: data.name,
        code: data.code,
        ...(data.description?.trim() && { description: data.description.trim() }),
        permissionIds: data.permissionIds,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Role</DialogTitle>
          <DialogDescription>
            Create a custom role specific to your gym with assigned permissions.
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
                    <Input placeholder="Front Desk Staff" {...field} />
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
                    <Input placeholder="front_desk_staff" {...field} />
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

            <FormField
              control={form.control}
              name="permissionIds"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                      {permissionsLoading ? (
                        <div className="text-sm text-muted-foreground">
                          Loading permissions...
                        </div>
                      ) : permissions && permissions.length > 0 ? (
                        <div className="space-y-2">
                          {permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={selectedPermissionIds.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                              />
                              <label
                                htmlFor={`permission-${permission.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {permission.name}
                                {permission.description && (
                                  <span className="text-muted-foreground ml-2">
                                    - {permission.description}
                                  </span>
                                )}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No permissions available
                        </div>
                      )}
                    </div>
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
                {isPending ? "Creating..." : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
