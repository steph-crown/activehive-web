import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PendingApprovalPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-6 text-center max-w-md mx-auto", className)}
      {...props}
    >
      <div className="space-y-4">
        <div className="mx-auto size-16 rounded-full bg-muted flex items-center justify-center">
          <Mail className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Pending Approval</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Your gym registration has been submitted successfully! Our team is
            currently reviewing your application.
          </p>
        </div>
      </div>

      <div className="space-y-3 text-left bg-muted/50 rounded-lg p-4">
        <h2 className="font-semibold text-sm">What happens next?</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              Our admin team will review your application and verify your
              documents.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              Once approved, you&apos;ll receive an email notification at the
              address you provided.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              You can then log in to access your dashboard and start managing
              your gym.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link to="/login">Login</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full"
        >
          <a
            href="mailto:support@activehive.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HelpCircle className="mr-2 size-4" />
            Contact Support
          </a>
        </Button>
      </div>
    </div>
  );
}
