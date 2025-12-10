import AuthLayout from "@/components/layout/auth-layout";
import { LoginForm } from "./forms/login-form";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
