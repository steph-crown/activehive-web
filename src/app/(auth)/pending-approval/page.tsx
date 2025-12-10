import { PendingApprovalPage } from "@/features/gym-owner-registration/components/pending-approval-page";
import AuthLayout from "@/components/layout/auth-layout";

export default function Page() {
  return (
    <AuthLayout>
      <PendingApprovalPage />
    </AuthLayout>
  );
}
