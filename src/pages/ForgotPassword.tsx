import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import AuthLayout from "@/components/layout/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
