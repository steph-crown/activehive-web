import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "@/features/gym-owner-registration/components/missing-session-card";
import {
  otpSchema,
  type OtpFormValues,
} from "@/features/gym-owner-registration/schema";

export function OtpForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const email = useGymOwnerRegistrationStore((state) => state.email);
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const { mutateAsync: verifyEmail, isPending } = useVerifyEmailMutation();
  const { mutateAsync: resendEmail, isPending: isResending } =
    useResendVerificationMutation();

  const form = useForm<OtpFormValues>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  if (!sessionId || !email) {
    return <MissingSessionCard />;
  }

  const onSubmit = async (data: OtpFormValues) => {
    try {
      const response = await verifyEmail({ email, otp: data.otp });
      setStepStatus(2, "pending");
      showSuccess(
        "Success",
        response.message ?? "Email verified. You can now proceed."
      );
      navigate("/gym-branding");
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to verify OTP.";
      showError("Error", message);
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendEmail({ email });
      showSuccess("Success", response.message ?? "OTP sent. Check your inbox.");
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to resend OTP.";
      showError("Error", message);
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Verify your email address</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Please enter the confirmation code sent to{" "}
            <span className="font-semibold underline">{email}</span>
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    containerClassName="justify-center w-full"
                    value={field.value}
                    onChange={field.onChange}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full hover:scale-105"
            size={"lg"}
            disabled={isPending}
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
    </Form>
  );
}
