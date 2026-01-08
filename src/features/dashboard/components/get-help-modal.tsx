import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconPhone, IconMail } from "@tabler/icons-react";

interface GetHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GetHelpModal({ open, onOpenChange }: GetHelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Help</DialogTitle>
          <DialogDescription>
            Contact us for assistance with your account or any questions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Contact Information</p>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="tel:+2349388338">
                  <IconPhone className="h-4 w-4 mr-2" />
                  +234 938 8338
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="mailto:mail@activehive.com">
                  <IconMail className="h-4 w-4 mr-2" />
                  mail@activehive.com
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
