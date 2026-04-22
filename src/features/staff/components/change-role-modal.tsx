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
import * as React from "react";
import * as yup from "yup";
import { staffFullName } from "../lib/staff-display";
import { useAssignStaffRoleMutation, useAvailableRolesQuery } from "../services";
import type { Staff } from "../types";

const schema = yup.object({
  roleId: yup.string().required("Select a role"),
});

type FormValues = yup.InferType<typeof schema>;

type ChangeRoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSuccess: () => void;
};

export function ChangeRoleModal({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: ChangeRoleModalProps) {
  const { showSuccess, showError } = useToast();
  const { data: roles, isLoading: rolesLoading } = useAvailableRolesQuery();
  const { mutateAsync: assignRole, isPending } = useAssignStaffRoleMutation();

  const form = useForm<FormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues: { roleId: "" },
  });

  React.useEffect(() => {
    if (!open || !staff) return;
    form.reset({
      roleId: staff.roleId || "",
    });
  }, [open, staff, form]);

  const onSubmit = async (data: FormValues) => {
    if (!staff) return;
    try {
      await assignRole({
        staffId: staff.id,
        payload: { roleId: data.roleId },
      });
      showSuccess("Success", "Role updated successfully.");
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update role.";
      showError("Error", message);
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Assign a role for {staffFullName(staff)}. This updates the role and
            its permissions on the server.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-2"
          >
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={rolesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="!h-10 w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesLoading ? (
                        <div className="text-muted-foreground px-2 py-2 text-sm">
                          Loading roles…
                        </div>
                      ) : roles && roles.length > 0 ? (
                        roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-muted-foreground px-2 py-2 text-sm">
                          No roles available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
