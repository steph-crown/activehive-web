import AuthLayout from "@/components/layout/auth-layout";
import { DocumentsStepForm } from "./forms/documents-step-form";

export function DocumentsPage() {
  return (
    <AuthLayout>
      <DocumentsStepForm />
    </AuthLayout>
  );
}
