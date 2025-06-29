import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { useNavigate } from "react-router-dom";

export function OtpForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify your email address</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Please enter the confirmation code sent to{" "}
          <span className="font-semibold underline">
            gym@yourfitnessbusiness.com
          </span>
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          {/* <Label htmlFor="email">Enter One Time Password</Label> */}
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
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
          onClick={() => {
            navigate("/complete-setup");
          }}
        >
          Verify email
        </Button>

        <button className="flex justify-end -mt-3 cursor-pointer">
          <p className="ml-auto text-sm underline-offset-4 hover:underline">
            Resend OTP
          </p>
        </button>
      </div>
    </form>
  );
}
