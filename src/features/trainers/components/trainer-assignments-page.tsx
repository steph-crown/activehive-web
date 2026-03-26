import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { IconPlus } from "@tabler/icons-react";
import * as React from "react";

type Assignment = {
  id: string;
  member: string;
  trainer: string;
  plan: string;
  since: string;
};

const assignments: Assignment[] = [
  { id: "1", member: "Sarah Johnson", trainer: "Mike Ross", plan: "Monthly Premium", since: "Jan 15, 2026" },
  { id: "2", member: "Mike Chen", trainer: "Lisa Park", plan: "Yearly", since: "Feb 03, 2026" },
  { id: "3", member: "David Kim", trainer: "Lisa Park", plan: "Yearly", since: "Jan 22, 2026" },
  { id: "4", member: "James Brown", trainer: "Mike Ross", plan: "Monthly", since: "Mar 01, 2026" },
  { id: "5", member: "Tom Harris", trainer: "Mike Ross", plan: "Monthly", since: "Mar 10, 2026" },
  { id: "6", member: "Ryan Lee", trainer: "Carlos Diaz", plan: "Quarterly", since: "Feb 15, 2026" },
];

const trainerOptions = ["Mike Ross", "Lisa Park", "Carlos Diaz", "Anna Thompson", "Ryan Cooper"];
const memberOptions = ["Sarah Johnson", "Mike Chen", "David Kim", "James Brown", "Tom Harris", "Ryan Lee"];

export function TrainerAssignmentsPage() {
  const { showSuccess } = useToast();
  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | null>(null);
  const [selectedMember, setSelectedMember] = React.useState("");
  const [selectedTrainer, setSelectedTrainer] = React.useState("");

  const openAssignModal = (assignment: Assignment | null) => {
    setSelectedAssignment(assignment);
    setSelectedMember(assignment?.member ?? "");
    setSelectedTrainer(assignment?.trainer ?? "");
    setIsAssignOpen(true);
  };

  const handleAssign = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAssignOpen(false);
    if (selectedAssignment) {
      showSuccess("Reassigned", `${selectedAssignment.member} has been reassigned.`);
      return;
    }
    showSuccess("Assigned", "Trainer assignment created successfully.");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Trainer Assignments</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              View and manage trainer-member assignments.
            </p>
          </div>
          <Button onClick={() => openAssignModal(null)}>
            <IconPlus className="h-4 w-4" />
            Assign Trainer
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <div className="overflow-x-auto rounded-md border border-[#F4F4F4] bg-white">
            <table className="w-full min-w-[780px] text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F4] text-left text-muted-foreground">
                  <th className="px-4 py-4 font-medium">Member</th>
                  <th className="px-4 py-4 font-medium">Trainer</th>
                  <th className="px-4 py-4 font-medium">Plan</th>
                  <th className="px-4 py-4 font-medium">Since</th>
                  <th className="px-4 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-[#F4F4F4] last:border-0">
                    <td className="px-4 py-4 font-medium">{assignment.member}</td>
                    <td className="px-4 py-4">{assignment.trainer}</td>
                    <td className="px-4 py-4 text-muted-foreground">{assignment.plan}</td>
                    <td className="px-4 py-4 text-muted-foreground">{assignment.since}</td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => openAssignModal(assignment)}>
                        Reassign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAssignment ? "Reassign Trainer" : "Assign Trainer"}</DialogTitle>
            <DialogDescription>
              {selectedAssignment
                ? "Update the trainer for this member."
                : "Create a new member-trainer assignment."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-2">
              <Label>Member</Label>
              {selectedAssignment ? (
                <Input value={selectedMember} disabled />
              ) : (
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger className="!h-10 w-full">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOptions.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Trainer</Label>
              <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                <SelectTrigger className="!h-10 w-full">
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  {trainerOptions.map((trainer) => (
                    <SelectItem key={trainer} value={trainer}>
                      {trainer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAssignOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedAssignment ? "Save Reassignment" : "Assign"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
