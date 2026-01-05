import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
} from "../services";
import type { Facility } from "../types";

const facilitySchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  image: yup.mixed<File>().optional(),
});

type FacilityFormValues = yup.InferType<typeof facilitySchema>;

const facilitiesColumns = (
  onEdit: (facility: Facility) => void,
  onDelete: (facilityId: string) => void
): ColumnDef<Facility>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | undefined;
      return (
        <div className="text-sm">
          {description || <span className="text-muted-foreground">N/A</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const facility = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit(facility)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(facility.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function FacilitiesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingFacility, setEditingFacility] =
    React.useState<Facility | null>(null);

  const { data: facilities, isLoading, refetch } = useFacilitiesQuery(
    id || ""
  );
  const { mutateAsync: createFacility, isPending: isCreating } =
    useCreateFacilityMutation(id || "");
  const { mutateAsync: updateFacility, isPending: isUpdating } =
    useUpdateFacilityMutation(id || "");
  const { mutateAsync: deleteFacility, isPending: isDeleting } =
    useDeleteFacilityMutation(id || "");

  const form = useForm<FacilityFormValues>({
    resolver: yupResolver(facilitySchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
    },
  });

  const handleCreate = async (data: FacilityFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.image) {
        formData.append("image", data.image);
      }

      await createFacility(formData);
      showSuccess("Success", "Facility created successfully!");
      form.reset();
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create facility.";
      showError("Error", message);
    }
  };

  const handleUpdate = async (data: FacilityFormValues) => {
    if (!editingFacility) return;

    try {
      const formData = new FormData();
      if (data.name) {
        formData.append("name", data.name);
      }
      if (data.description !== undefined) {
        formData.append("description", data.description || "");
      }
      if (data.image) {
        formData.append("image", data.image);
      }

      await updateFacility({ facilityId: editingFacility.id, payload: formData });
      showSuccess("Success", "Facility updated successfully!");
      form.reset();
      setEditingFacility(null);
      refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update facility.";
      showError("Error", message);
    }
  };

  const handleDelete = React.useCallback(
    async (facilityId: string) => {
      if (!confirm("Are you sure you want to delete this facility?")) return;

      try {
        await deleteFacility(facilityId);
        showSuccess("Success", "Facility deleted successfully!");
        refetch();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete facility.";
        showError("Error", message);
      }
    },
    [deleteFacility, refetch, showSuccess, showError]
  );

  const handleEdit = React.useCallback(
    (facility: Facility) => {
      setEditingFacility(facility);
      form.reset({
        name: facility.name,
        description: facility.description || "",
        image: undefined,
      });
    },
    [form]
  );

  const columns = React.useMemo(
    () => facilitiesColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const isModalOpen = isCreateModalOpen || !!editingFacility;
  const isPending = isCreating || isUpdating || isDeleting;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(`/dashboard/locations/${id}`)}
              className="mb-2"
            >
              ← Back to Location
            </Button>
            <h1 className="text-3xl font-bold">Facilities</h1>
            <p className="text-muted-foreground mt-2">
              Manage facilities for this location
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Create Facility
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={facilities || []}
              columns={columns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No facilities found."
            />
          )}
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditingFacility(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingFacility ? "Edit Facility" : "Create Facility"}
            </DialogTitle>
            <DialogDescription>
              {editingFacility
                ? "Update facility information"
                : "Create a new facility for this location"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                editingFacility ? handleUpdate : handleCreate
              )}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cardio Zone, Weight Training Area"
                        {...field}
                      />
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
                      <Input placeholder="Facility description" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Image (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        {...field}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size <= 5 * 1024 * 1024) {
                            onChange(file);
                          } else if (file) {
                            showError("Error", "Image must be 5MB or less");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, GIF, or WebP, max 5MB
                    </p>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingFacility(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? editingFacility
                      ? "Updating..."
                      : "Creating..."
                    : editingFacility
                    ? "Update Facility"
                    : "Create Facility"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
