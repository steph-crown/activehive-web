import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
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
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useLocationsQuery } from "@/features/locations/services";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconDotsVertical } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useClassesQuery, useDeleteClassMutation } from "../services";
import type { Class } from "../types";
import { formatScheduleSessionLabel } from "../utils/format-schedule-display";
import {
  AssignTrainerModal,
  classHasAssignedTrainer,
} from "./assign-trainer-modal";
import { CreateClassModal } from "./create-class-modal";
import { ReuseClassModal } from "./reuse-class-modal";

const createClassesColumns = (
  navigate: (path: string) => void,
  onAssignTrainer: (classItem: Class) => void,
  onReuse: (classItem: Class) => void,
  onRequestDelete: (classItem: Class) => void,
): ColumnDef<Class>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "metadata.category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.metadata?.category || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "metadata.difficulty",
    header: "Difficulty",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.metadata?.difficulty || "N/A"}
      </Badge>
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
    id: "schedules",
    header: "Schedules",
    cell: ({ row }) => {
      const active = row.original.schedules.filter((s) => s.isActive);
      if (active.length === 0) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }
      const text = active.map((s) => formatScheduleSessionLabel(s)).join(", ");
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <code className="bg-muted max-w-[13rem] cursor-default truncate rounded px-1.5 py-0.5 font-mono text-xs block">
                {text}
              </code>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-normal">
              {text}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
              {classHasAssignedTrainer(classItem)
                ? "Reassign trainer"
                : "Assign trainer"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReuse(classItem)}>
              Reuse
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onRequestDelete(classItem)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type ClassesTabProps = {
  isCreateModalOpen: boolean;
  onCreateModalOpenChange: (open: boolean) => void;
};

export function ClassesTab({
  isCreateModalOpen,
  onCreateModalOpenChange,
}: Readonly<ClassesTabProps>) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [assigningClass, setAssigningClass] = React.useState<Class | null>(
    null,
  );
  const [reusingClass, setReusingClass] = React.useState<Class | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Class | null>(null);

  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const effectiveLocationId = locationFilter === "all" ? undefined : locationFilter;

  const {
    data: classes,
    isLoading,
    refetch,
  } = useClassesQuery(effectiveLocationId);
  const { mutateAsync: deleteClass, isPending: isDeleting } =
    useDeleteClassMutation();

  const handleConfirmDeleteList = async () => {
    if (!deleteTarget) return;
    try {
      await deleteClass(deleteTarget.id);
      showSuccess("Class deleted", "The class was removed.");
      setDeleteTarget(null);
      refetch();
    } catch (error) {
      showError(
        "Could not delete class",
        getApiErrorMessage(error, "Failed to delete class."),
      );
    }
  };

  const handleAssignTrainer = (classItem: Class) => {
    setAssigningClass(classItem);
  };

  const handleReuse = (classItem: Class) => {
    setReusingClass(classItem);
  };

  const handleRequestDelete = React.useCallback((classItem: Class) => {
    setDeleteTarget(classItem);
  }, []);

  const columns = React.useMemo(
    () =>
      createClassesColumns(
        navigate,
        handleAssignTrainer,
        handleReuse,
        handleRequestDelete,
      ),
    [navigate, handleAssignTrainer, handleReuse, handleRequestDelete],
  );

  const filteredClasses = React.useMemo(() => {
    const rows = classes || [];
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (normalizedSearch.length === 0) return rows;
    return rows.filter((classItem) =>
      `${classItem.name} ${classItem.metadata?.category || ""} ${classItem.metadata?.difficulty || ""} ${classItem.location?.locationName || ""}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [classes, searchQuery]);

  return (
    <div className="space-y-4">
      <TableFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search classes..."
        locationValue={locationFilter}
        onLocationChange={setLocationFilter}
        locations={(locations ?? []).map((location) => ({
          value: location.id,
          label: location.locationName,
        }))}
        locationDisabled={locationsLoading}
      />

      <DataTable
        data={filteredClasses}
        columns={columns}
        enableTabs={false}
        getRowId={(row) => row.id}
        emptyMessage="No classes found."
        isLoading={isLoading}
      />

      <CreateClassModal
        open={isCreateModalOpen}
        onOpenChange={onCreateModalOpenChange}
        onSuccess={() => {
          refetch();
          onCreateModalOpenChange(false);
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

      <Dialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this class?</DialogTitle>
            <DialogDescription>
              <span className="text-foreground font-medium">
                {deleteTarget?.name}
              </span>{" "}
              will be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              loading={isDeleting}
              onClick={() => void handleConfirmDeleteList()}
            >
              Delete class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
