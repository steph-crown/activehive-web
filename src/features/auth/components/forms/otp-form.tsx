import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";

export function OtpForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const email = useGymOwnerRegistrationStore((state) => state.email);
  const setSession = useGymOwnerRegistrationStore((state) => state.setSession);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const { mutateAsync: verifyEmail, isPending } = useVerifyEmailMutation();
  const { mutateAsync: resendEmail, isPending: isResending } =
    useResendVerificationMutation();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      showError("Error", "Email not found. Please start registration again.");
      navigate("/signup");
      return;
    }

    if (otp.length !== 6) {
      showError("Error", "Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const response = await verifyEmail({ email, otp });
      setSession({ sessionId: response.sessionId, email });
      setStepStatus(2, "pending");
      showSuccess("Email verified", "Your account has been created. Continue with setup.");
      navigate("/gym-branding");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to verify email.";
      showError("Error", message);
    }
  };

  const handleResend = async () => {
    if (!email) {
      showError("Error", "Email not found. Please start registration again.");
      navigate("/signup");
      return;
    }

    try {
      await resendEmail({ email });
      showSuccess("Email sent", "Check your inbox for a new OTP.");
      setOtp("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to resend email.";
      showError("Error", message);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify your email address</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Please enter the 6-digit code sent to{" "}
          {email ? (
            <span className="font-semibold underline">{email}</span>
          ) : (
            <span className="font-semibold underline">your email</span>
          )}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={setOtp}
            containerClassName="justify-center w-full"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          className="w-full hover:scale-105"
          size={"lg"}
          disabled={isPending || otp.length !== 6}
        >
          {isPending ? "Verifying..." : "Verify email"}
        </Button>

        <div className="flex justify-between -mt-3 cursor-pointer">
          <button
            type="button"
            className="text-sm underline-offset-4 hover:underline text-left w-max"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Go back
          </button>

          <button
            type="button"
            className="ml-auto text-sm underline-offset-4 hover:underline"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </form>
  );
}
