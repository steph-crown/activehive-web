import AuthLayout from "@/components/layout/auth-layout";
import { BrandingStepForm } from "./forms/branding-step-form";

export function BrandingPage() {
  return (
    <AuthLayout>
      <BrandingStepForm />
    </AuthLayout>
  );
}
