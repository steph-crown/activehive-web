import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useTemplatesQuery } from "../services";
import type { ClassTemplate } from "../types";
import { CreateTemplateModal } from "./create-template-modal";
import { UseTemplateModal } from "./use-template-modal";

const templateColumns: ColumnDef<ClassTemplate>[] = [
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
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration (min)",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("duration")}</div>
    ),
  },
];

export function ClassTemplatesTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isUseModalOpen, setIsUseModalOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<ClassTemplate | null>(null);
  const { data: templates, isLoading, refetch } = useTemplatesQuery();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedTemplate(null);
              setIsUseModalOpen(true);
            }}
            disabled={!templates || templates.length === 0}
          >
            Use Template
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <BlockLoader />
        </div>
      ) : (
        <DataTable
          data={templates || []}
          columns={templateColumns}
          enableTabs={false}
          getRowId={(row) => row.id}
          emptyMessage="No templates found."
        />
      )}

      <CreateTemplateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
        }}
      />

      <UseTemplateModal
        open={isUseModalOpen}
        onOpenChange={setIsUseModalOpen}
        selectedTemplate={selectedTemplate}
        onSuccess={() => {
          refetch();
          setIsUseModalOpen(false);
          setSelectedTemplate(null);
        }}
      />
    </div>
  );
}
