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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import * as React from "react";
import {
  useAssignRolePermissionsMutation,
  useAvailableRolesQuery,
  useAvailablePermissionsQuery,
} from "../services";
import type { Staff } from "../types";
import { CreateRoleModal } from "./create-role-modal";
import { CreatePermissionModal } from "./create-permission-modal";

const assignPermissionsSchema = yup.object({
  roleId: yup.string().optional(),
  permissionIds: yup.array().of(yup.string().required()).default([]).required(),
});

type AssignPermissionsFormValues = yup.InferType<typeof assignPermissionsSchema>;

interface AssignPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSuccess: () => void;
}

export function AssignPermissionsModal({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: AssignPermissionsModalProps) {
  const { showSuccess, showError } = useToast();
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] =
    React.useState(false);
  const [isCreatePermissionModalOpen, setIsCreatePermissionModalOpen] =
    React.useState(false);

  const {
    data: roles,
    isLoading: rolesLoading,
    refetch: refetchRoles,
  } = useAvailableRolesQuery();
  const {
    data: permissions,
    isLoading: permissionsLoading,
    refetch: refetchPermissions,
  } = useAvailablePermissionsQuery();
  const { mutateAsync: assignPermissions, isPending } =
    useAssignRolePermissionsMutation();

  const form = useForm<AssignPermissionsFormValues>({
    resolver: yupResolver(assignPermissionsSchema) as any,
    defaultValues: {
      roleId: staff?.roleId || "",
      permissionIds: staff?.permissionIds || [],
    },
  });

  const selectedRoleId = form.watch("roleId");
  const selectedPermissionIds = form.watch("permissionIds");

  // When a role is selected, auto-select its permissions
  React.useEffect(() => {
    if (selectedRoleId && roles) {
      const selectedRole = roles.find((r) => r.id === selectedRoleId);
      const ids =
        selectedRole.permissionIds?.length
          ? selectedRole.permissionIds
          : selectedRole.permissions?.map((p) => p.id) ?? [];
      if (selectedRole && ids.length > 0) {
        form.setValue("permissionIds", ids);
      }
    }
  }, [selectedRoleId, roles, form]);

  const handlePermissionToggle = (permissionId: string) => {
    const currentIds = form.getValues("permissionIds");
    const newIds = currentIds.includes(permissionId)
      ? currentIds.filter((id) => id !== permissionId)
      : [...currentIds, permissionId];
    form.setValue("permissionIds", newIds);
  };

  const onSubmit = async (data: AssignPermissionsFormValues) => {
    if (!staff) return;

    try {
      const payload: { roleId?: string; permissionIds: string[] } = {
        permissionIds: data.permissionIds,
      };
      if (data.roleId) {
        payload.roleId = data.roleId;
      }

      await assignPermissions({ staffId: staff.id, payload });
      showSuccess("Success", "Permissions assigned successfully!");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to assign permissions.";
      showError("Error", message);
    }
  };

  if (!staff) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Permissions</DialogTitle>
          <DialogDescription>
            Assign role and permissions to {staff.firstName} {staff.lastName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={rolesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {roles?.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                      {!rolesLoading && (!roles || roles.length === 0) && (
                        <div className="py-2 px-2">
                          <div className="px-2 py-1 text-sm text-muted-foreground">
                            No roles available
                          </div>
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-left mt-1"
                            onClick={() => setIsCreateRoleModalOpen(true)}
                          >
                            Create Role
                          </Button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
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
                          <div>No permissions available</div>
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-left mt-1"
                            onClick={() =>
                              setIsCreatePermissionModalOpen(true)
                            }
                          >
                            Create Permission
                          </Button>
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
              <Button type="submit" loading={isPending}>
                Assign Permissions
              </Button>
            </DialogFooter>
          </form>
        </Form>
        </DialogContent>
      </Dialog>

      <CreateRoleModal
        open={isCreateRoleModalOpen}
        onOpenChange={setIsCreateRoleModalOpen}
        onSuccess={() => {
          void refetchRoles();
        }}
      />

      <CreatePermissionModal
        open={isCreatePermissionModalOpen}
        onOpenChange={setIsCreatePermissionModalOpen}
        onSuccess={() => {
          void refetchPermissions();
        }}
      />
    </>
  );
}
