import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  useApplicationStatusQuery,
  useCompleteRegistrationMutation,
} from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "@/features/gym-owner-registration/components/missing-session-card";
import { LoadingModal } from "@/features/gym-owner-registration/components/loading-modal";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services";
import { useAuthStore } from "@/store";
import type { AuthResponse } from "../../types";
import { cn } from "@/lib/utils";

const resolveSession = (response: AuthResponse) => {
  const token =
    response.token ??
    response.access_token ??
    response.data?.token ??
    response.data?.access_token;

  const user = response.user ?? response.data?.user;

  if (!token || !user) {
    throw new Error(response.message ?? "Invalid login response from server");
  }

  return { token, user };
};

type LoadingStep = {
  text: string;
  status: "pending" | "loading" | "completed";
};

export function CompleteSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const email = useGymOwnerRegistrationStore((state) => state.email);
  const password = useGymOwnerRegistrationStore((state) => state.password);
  const resetRegistration = useGymOwnerRegistrationStore((state) => state.reset);
  const setSession = useAuthStore((state) => state.setSession);
  const { data, isFetching } = useApplicationStatusQuery(sessionId);
  const { mutateAsync: completeRegistration, isPending: isCompleting } =
    useCompleteRegistrationMutation();
  const { mutateAsync: login, isPending: isLoggingIn } = useLoginMutation();

  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { text: "Completing registration...", status: "pending" },
    { text: "Signing you in...", status: "pending" },
    { text: "Preparing your dashboard...", status: "pending" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!sessionId || !email || !password) {
    return <MissingSessionCard />;
  }

  const updateStep = (index: number, status: LoadingStep["status"]) => {
    setLoadingSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, status } : step))
    );
  };

  const handleProceed = async () => {
    setIsLoading(true);

    try {
      // Step 1: Complete registration
      updateStep(0, "loading");
      await completeRegistration({ sessionId });
      updateStep(0, "completed");

      // Step 2: Login
      updateStep(1, "loading");
      const loginResponse = await login({ email, password });
      const session = resolveSession(loginResponse);
      setSession(session);
      updateStep(1, "completed");

      // Step 3: Prepare dashboard
      updateStep(2, "loading");
      // Small delay to show the step
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateStep(2, "completed");

      // Reset registration state and navigate
      resetRegistration();
      showSuccess("Welcome!", "Your account is ready. Let's get started!");
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to complete setup. Please try again.";
      showError("Error", message);
      // Reset all steps to pending
      setLoadingSteps((prev) =>
        prev.map((step) => ({ ...step, status: "pending" as const }))
      );
    }
  };

  return (
    <>
      <LoadingModal open={isLoading} steps={loadingSteps} />
      <div
        className={cn("flex flex-col gap-6 text-center", className)}
        {...props}
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Step 6 · All done 🎉</h1>
          <p className="text-muted-foreground text-sm text-balance">
            You&apos;re all set! Click the button below to complete your
            registration and access your dashboard.
          </p>
        </div>
        <div className="space-y-4">
          {data && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="secondary">
                Status: {data.status ?? "Pending approval"}
              </Badge>
              {data.subscriptionTrialEndsOn && (
                <Badge>
                  Trial ends{" "}
                  {new Date(data.subscriptionTrialEndsOn).toLocaleDateString()}
                </Badge>
              )}
            </div>
          )}
          {!data && isFetching && (
            <p className="text-muted-foreground text-sm">
              Checking latest application status...
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleProceed}
            disabled={isLoading || isCompleting || isLoggingIn}
            size="lg"
            className="w-full"
          >
            {isLoading ? "Setting up..." : "Proceed to Dashboard"}
          </Button>
        </div>
      </div>
    </>
  );
}
