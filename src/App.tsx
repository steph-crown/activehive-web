import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import { BlockLoader } from "@/components/loader/block-loader";

const Login = lazy(() => import("@/app/(auth)/login/page"));
const SignUp = lazy(() => import("@/app/(auth)/signup/page"));
const Otp = lazy(() => import("@/app/(auth)/otp/page"));
const ForgotPassword = lazy(() => import("@/app/(auth)/forgot-password/page"));
const Branding = lazy(() => import("@/app/(auth)/gym-branding/page"));
const Documents = lazy(() => import("@/app/(auth)/compliance-documents/page"));
const Locations = lazy(() => import("@/app/(auth)/gym-locations/page"));
const CompleteSetup = lazy(() => import("@/app/(auth)/complete-setup/page"));
const PendingApproval = lazy(() => import("@/app/(auth)/pending-approval/page"));
const Dashboard = lazy(() => import("@/app/dashboard/page"));
const Members = lazy(() => import("@/app/dashboard/members/page"));
const MembershipPlans = lazy(() => import("@/app/dashboard/membership-plans/page"));

function App() {
  return (
    <Router>
      <Suspense fallback={<BlockLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/complete-setup" element={<CompleteSetup />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/gym-branding" element={<Branding />} />
          <Route path="/compliance-documents" element={<Documents />} />
          <Route path="/gym-locations" element={<Locations />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/members" element={<Members />} />
          <Route path="/dashboard/membership-plans" element={<MembershipPlans />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
