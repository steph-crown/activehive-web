import AuthLayout from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/forms/login-form";

export default function Login() {
  return (
    <div>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </div>
  );
}
