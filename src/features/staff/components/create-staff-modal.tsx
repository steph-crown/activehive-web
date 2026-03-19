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
import { Toggle } from "@/components/ui/toggle";
import { useLocationsQuery } from "@/features/locations/services";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreateStaffMutation, useAvailableRolesQuery } from "../services";
import * as React from "react";
import { CreateRoleModal } from "./create-role-modal";

const createStaffSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  roleId: yup.string().required("Role is required"),
  locationIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one location is required")
    .required(),
  hireDate: yup.string().required("Hire date is required"),
  status: yup
    .string()
    .oneOf(["active", "inactive"], "Invalid status")
    .required("Status is required"),
  permissionIds: yup.array().of(yup.string().required()).default([]).required(),
});

type CreateStaffFormValues = yup.InferType<typeof createStaffSchema>;

interface CreateStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateStaffModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateStaffModalProps) {
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] =
    React.useState(false);

  const { showSuccess, showError } = useToast();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const {
    data: roles,
    isLoading: rolesLoading,
    refetch: refetchRoles,
  } = useAvailableRolesQuery();
  const { mutateAsync: createStaff, isPending } = useCreateStaffMutation();

  const form = useForm<CreateStaffFormValues>({
    resolver: yupResolver(createStaffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleId: "",
      locationIds: [],
      hireDate: new Date().toISOString().split("T")[0],
      status: "active",
      permissionIds: [],
    },
  });

  const selectedLocationIds = form.watch("locationIds");

  const onSubmit = async (data: CreateStaffFormValues) => {
    try {
      await createStaff(data);
      showSuccess("Success", "Staff member created successfully!");
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleId: "",
        locationIds: [],
        hireDate: new Date().toISOString().split("T")[0],
        status: "active",
        permissionIds: [],
      });
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create staff member.";
      showError("Error", message);
    }
  };

  const handleLocationToggle = (locationId: string) => {
    const currentIds = form.getValues("locationIds");
    const newIds = currentIds.includes(locationId)
      ? currentIds.filter((id) => id !== locationId)
      : [...currentIds, locationId];
    form.setValue("locationIds", newIds);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new staff member to your gym.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@gym.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={rolesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rolesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading roles...
                          </SelectItem>
                        ) : roles && roles.length > 0 ? (
                          roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))
                        ) : (
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
            </div>

            <FormField
              control={form.control}
              name="locationIds"
              render={() => (
                <FormItem>
                  <FormLabel>Locations</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                      {locationsLoading ? (
                        <div className="text-sm text-muted-foreground">
                          Loading locations...
                        </div>
                      ) : locations && locations.length > 0 ? (
                        <div className="space-y-2">
                          {locations.map((location) => (
                            <div
                              key={location.id}
                              className="flex items-center justify-between gap-4"
                            >
                              <span className="text-sm font-medium">
                                {location.locationName}
                              </span>
                              <Toggle
                                aria-label={`Toggle ${location.locationName}`}
                                pressed={selectedLocationIds.includes(
                                  location.id
                                )}
                                onPressedChange={() =>
                                  handleLocationToggle(location.id)
                                }
                                size="sm"
                                variant="outline"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No locations available
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hire Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Staff"}
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
    </>
  );
}
