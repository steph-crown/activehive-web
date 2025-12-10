import AuthLayout from "@/components/layout/auth-layout";
import { CompleteSetupForm } from "./forms/complete-setup-form";

export function CompleteSetupPage() {
  return (
    <AuthLayout>
      <CompleteSetupForm />
    </AuthLayout>
  );
}
