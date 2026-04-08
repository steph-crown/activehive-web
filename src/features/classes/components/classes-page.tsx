import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { ClassesTab } from "./classes-tab";
// import { ClassTemplatesTab } from "./class-templates-tab";

export function ClassesPage() {
  // const [activeTab, setActiveTab] = React.useState<"classes" | "templates">(
  //   "classes",
  // );
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = React.useState(false);
  // const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
  //   React.useState(false);

  // const handleCreateClick = () => {
  //   if (activeTab === "templates") {
  //     setIsCreateTemplateModalOpen(true);
  //     return;
  //   }
  //   setIsCreateClassModalOpen(true);
  // };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-start justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Classes</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your gym classes
            </p>
          </div>
          <Button onClick={() => setIsCreateClassModalOpen(true)}>
            <IconPlus className="h-4 w-4" />
            Create Class
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <ClassesTab
            isCreateModalOpen={isCreateClassModalOpen}
            onCreateModalOpenChange={setIsCreateClassModalOpen}
          />
          {/*
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "classes" | "templates")}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="templates">Class Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="classes" className="mt-6">
              <ClassesTab
                isCreateModalOpen={isCreateClassModalOpen}
                onCreateModalOpenChange={setIsCreateClassModalOpen}
              />
            </TabsContent>
            <TabsContent value="templates" className="mt-6">
              <ClassTemplatesTab
                isCreateModalOpen={isCreateTemplateModalOpen}
                onCreateModalOpenChange={setIsCreateTemplateModalOpen}
              />
            </TabsContent>
          </Tabs>
          */}
        </div>
      </div>
    </DashboardLayout>
  );
}
