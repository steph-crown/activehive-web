import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useClassesQuery, useDeleteClassMutation } from "../services";
import { useLocationsQuery } from "@/features/locations/services";
import type { Class } from "../types";
import { CreateClassModal } from "./create-class-modal";
import { AssignTrainerModal } from "./assign-trainer-modal";
import { ReuseClassModal } from "./reuse-class-modal";
import { useToast } from "@/hooks/use-toast";

const createClassesColumns = (
  navigate: (path: string) => void,
  onAssignTrainer: (classItem: Class) => void,
  onReuse: (classItem: Class) => void,
  onDelete: (classId: string) => void
): ColumnDef<Class>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("category")}</Badge>
    ),
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("difficulty")}</Badge>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.original.location;
      return (
        <div className="text-sm">
          {location?.locationName || "All Locations"}
        </div>
      );
    },
  },
  {
    accessorKey: "trainer",
    header: "Trainer",
    cell: ({ row }) => {
      const trainer = row.original.trainer;
      return (
        <div className="text-sm">
          {trainer
            ? `${trainer.firstName} ${trainer.lastName}`
            : "Not assigned"}
        </div>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const classItem = row.original;
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/classes/${classItem.id}`)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignTrainer(classItem)}>
              Assign Trainer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReuse(classItem)}>
              Reuse
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(classItem.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ClassesTab() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedLocationId, setSelectedLocationId] = React.useState<
    string | undefined
  >(undefined);
  const [assigningClass, setAssigningClass] = React.useState<Class | null>(
    null
  );
  const [reusingClass, setReusingClass] = React.useState<Class | null>(null);

  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { data: classes, isLoading, refetch } = useClassesQuery(
    selectedLocationId
  );
  const { mutateAsync: deleteClass, isPending: isDeleting } =
    useDeleteClassMutation();

  const handleDelete = async (classId: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await deleteClass(classId);
      showSuccess("Success", "Class deleted successfully!");
      refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete class.";
      showError("Error", message);
    }
  };

  const handleAssignTrainer = (classItem: Class) => {
    setAssigningClass(classItem);
  };

  const handleReuse = (classItem: Class) => {
    setReusingClass(classItem);
  };

  const columns = React.useMemo(
    () =>
      createClassesColumns(
        navigate,
        handleAssignTrainer,
        handleReuse,
        handleDelete
      ),
    [navigate, handleAssignTrainer, handleReuse, handleDelete]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-64">
          <Select
            value={selectedLocationId || "all"}
            onValueChange={(value) =>
              setSelectedLocationId(value === "all" ? undefined : value)
            }
            disabled={locationsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.locationName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <BlockLoader />
        </div>
      ) : (
        <DataTable
          data={classes || []}
          columns={columns}
          enableTabs={false}
          getRowId={(row) => row.id}
          emptyMessage="No classes found."
        />
      )}

      <CreateClassModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
        }}
      />

      {assigningClass && (
        <AssignTrainerModal
          open={!!assigningClass}
          onOpenChange={(open) => {
            if (!open) setAssigningClass(null);
          }}
          classItem={assigningClass}
          onSuccess={() => {
            refetch();
            setAssigningClass(null);
          }}
        />
      )}

      {reusingClass && (
        <ReuseClassModal
          open={!!reusingClass}
          onOpenChange={(open) => {
            if (!open) setReusingClass(null);
          }}
          classItem={reusingClass}
          onSuccess={() => {
            refetch();
            setReusingClass(null);
          }}
        />
      )}
    </div>
  );
}
