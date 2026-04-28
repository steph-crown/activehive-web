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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useUpdateRoleMutation } from "../services";
import { PERMISSION_FEATURE_GROUPS } from "../constants/permission-groups";
import { PermissionsSelect } from "./permissions-select";
import type { Role } from "../types";

const editRoleSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  permissionCodes: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one permission")
    .required(),
});

type EditRoleFormValues = yup.InferType<typeof editRoleSchema>;

interface EditRoleModalProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditRoleModal({
  role,
  open,
  onOpenChange,
  onSuccess,
}: EditRoleModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: updateRole, isPending } = useUpdateRoleMutation();

  const form = useForm<EditRoleFormValues>({
    resolver: yupResolver(editRoleSchema) as never,
    defaultValues: {
      name: "",
      description: "",
      permissionCodes: [],
    },
  });

  React.useEffect(() => {
    if (role && open) {
      const codes = role.permissions?.map((p) => p.code) ?? [];
      form.reset({
        name: role.name,
        description: role.description ?? "",
        permissionCodes: codes,
      });
    }
  }, [role, open, form]);

  const onSubmit = async (data: EditRoleFormValues) => {
    if (!role) return;
    try {
      await updateRole({
        id: role.id,
        payload: {
          name: data.name.trim(),
          description: data.description?.trim(),
          permissionCodes: data.permissionCodes,
        },
      });
      showSuccess("Success", "Role updated successfully.");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      showError("Error", getApiErrorMessage(error, "Failed to update role."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the name, description, or permissions for this role.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
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
                      value={field.value ?? ""}
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
                  <FormLabel>Permissions *</FormLabel>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Select entire features quickly, or expand each feature to
                    pick specific permissions.
                  </p>
                  <FormControl>
                    <PermissionsSelect
                      groups={PERMISSION_FEATURE_GROUPS}
                      value={form.watch("permissionCodes")}
                      onChange={(next) =>
                        form.setValue("permissionCodes", next, {
                          shouldValidate: true,
                        })
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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
