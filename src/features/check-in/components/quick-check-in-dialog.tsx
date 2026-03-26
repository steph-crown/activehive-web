import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuickCheckInDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuickCheckInDialog({
  open,
  onOpenChange,
}: Readonly<QuickCheckInDialogProps>) {
  const [quickMethod, setQuickMethod] = useState("Manual");
  const [quickLocation, setQuickLocation] = useState("Downtown");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#F4F4F4]">
        <DialogHeader>
          <DialogTitle className="text-3xl uppercase">
            Quick Check-In
          </DialogTitle>

          <DialogDescription>
            Search member and record an attendance check-in.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Member Name or ID *</label>
            <Input placeholder="Search member..." />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Check-In Method</label>
            <Select value={quickMethod} onValueChange={setQuickMethod}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="QR Code">QR Code</SelectItem>
                <SelectItem value="NFC">NFC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Location</label>
            <Select value={quickLocation} onValueChange={setQuickLocation}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Downtown">Downtown</SelectItem>
                <SelectItem value="Westside">Westside</SelectItem>
                <SelectItem value="Eastside">Eastside</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-3 text-sm text-muted-foreground">
            <IconAlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Members with incomplete profiles will receive a warning during
              check-in.
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Check In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
