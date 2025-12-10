import AuthLayout from "@/components/layout/auth-layout";
import { OtpForm } from "./forms/otp-form";

export function OtpPage() {
  return (
    <AuthLayout>
      <OtpForm />
    </AuthLayout>
  );
}
