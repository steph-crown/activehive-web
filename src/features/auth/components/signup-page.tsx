import AuthLayout from "@/components/layout/auth-layout";
import { SignupForm } from "./forms/signup-form";

export function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
