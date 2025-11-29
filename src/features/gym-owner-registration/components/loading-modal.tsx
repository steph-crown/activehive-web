import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LoadingStep = {
  text: string;
  status: "pending" | "loading" | "completed";
};

type LoadingModalProps = {
  open: boolean;
  steps: LoadingStep[];
};

export function LoadingModal({ open, steps }: LoadingModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" closeButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Preparing your experience</DialogTitle>
          <DialogDescription>
            We're setting everything up for you. This will just take a moment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm"
            >
              <div className="flex-shrink-0">
                {step.status === "completed" ? (
                  <div className="size-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      className="size-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : step.status === "loading" ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
              <span
                className={
                  step.status === "loading"
                    ? "font-medium text-foreground"
                    : step.status === "completed"
                    ? "text-muted-foreground line-through"
                    : "text-muted-foreground"
                }
              >
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
