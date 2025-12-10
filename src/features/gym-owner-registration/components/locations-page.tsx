import AuthLayout from "@/components/layout/auth-layout";
import { LocationsStepForm } from "./forms/locations-step-form";

export function LocationsPage() {
  return (
    <AuthLayout>
      <LocationsStepForm />
    </AuthLayout>
  );
}
