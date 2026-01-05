import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassesTab } from "./classes-tab";
import { ClassTemplatesTab } from "./class-templates-tab";

export function ClassesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your gym classes and templates
          </p>
        </div>

        <div className="px-4 lg:px-6">
          <Tabs defaultValue="classes" className="w-full">
            <TabsList>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="templates">Class Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="classes" className="mt-6">
              <ClassesTab />
            </TabsContent>
            <TabsContent value="templates" className="mt-6">
              <ClassTemplatesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
