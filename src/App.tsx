import { BlockLoader } from "@/components/loader/block-loader";
import { Suspense, lazy } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";

const Login = lazy(() => import("@/app/(auth)/login/page"));
const SignUp = lazy(() => import("@/app/(auth)/signup/page"));
const Otp = lazy(() => import("@/app/(auth)/otp/page"));
const ForgotPassword = lazy(() => import("@/app/(auth)/forgot-password/page"));
const ResetPassword = lazy(() => import("@/app/(auth)/reset-password/page"));
const Branding = lazy(() => import("@/app/(auth)/gym-branding/page"));
const Documents = lazy(() => import("@/app/(auth)/compliance-documents/page"));
const GymLocations = lazy(() => import("@/app/(auth)/gym-locations/page"));
const CompleteSetup = lazy(() => import("@/app/(auth)/complete-setup/page"));
const PendingApproval = lazy(
  () => import("@/app/(auth)/pending-approval/page"),
);
const Dashboard = lazy(() => import("@/app/dashboard/page"));
const Members = lazy(() => import("@/app/dashboard/members/page"));
const AddMember = lazy(() => import("@/app/dashboard/members/new/page"));
const MemberDetails = lazy(() => import("@/app/dashboard/members/[id]/page"));
const EditMember = lazy(() => import("@/app/dashboard/members/[id]/edit/page"));
const MembershipPlans = lazy(
  () => import("@/app/dashboard/membership-plans/page"),
);
const Trainers = lazy(() => import("@/app/dashboard/trainers/page"));
const TrainerAssignments = lazy(
  () => import("@/app/dashboard/trainers/assignments/page"),
);
const Locations = lazy(() => import("@/app/dashboard/locations/page"));
const AddLocation = lazy(() => import("@/app/dashboard/locations/new/page"));
const GymProfile = lazy(() => import("@/app/dashboard/gym-profile/page"));
const LocationDetails = lazy(
  () => import("@/app/dashboard/locations/[id]/page"),
);
const LocationFacilities = lazy(
  () => import("@/app/dashboard/locations/[id]/facilities/page"),
);
const Staff = lazy(() => import("@/app/dashboard/staff/page"));
const Subscriptions = lazy(() => import("@/app/dashboard/subscriptions/page"));
const SubscriptionDetails = lazy(
  () => import("@/app/dashboard/subscriptions/[id]/page"),
);
const Classes = lazy(() => import("@/app/dashboard/classes/page"));
const ClassDetails = lazy(() => import("@/app/dashboard/classes/[id]/page"));
const CheckIn = lazy(() => import("@/app/dashboard/check-in/page"));
const OperatingHoursLegacyRedirect = lazy(
  () => import("@/app/dashboard/operating-hours/page"),
);
const OperatingHours = lazy(
  () => import("@/app/dashboard/locations/[id]/operating-hours/page"),
);
const Attendance = lazy(
  () => import("@/app/dashboard/classes/attendance/page"),
);
const Transactions = lazy(
  () => import("@/app/dashboard/payments/transactions/page"),
);
// const Invoices = lazy(() => import("@/app/dashboard/payments/invoices/page"));
// const Refunds = lazy(() => import("@/app/dashboard/payments/refunds/page"));
const PromoCodes = lazy(
  () => import("@/app/dashboard/marketing/promo-codes/page"),
);
const EmailCampaigns = lazy(
  () => import("@/app/dashboard/marketing/email-campaigns/page"),
);
const SmsCampaigns = lazy(
  () => import("@/app/dashboard/marketing/sms-campaigns/page"),
);
const StaffRoles = lazy(() => import("@/app/dashboard/staff/roles/page"));
const Billing = lazy(() => import("@/app/billing/page"));
const Profile = lazy(() => import("@/app/profile/page"));
const OldLanding = lazy(() => import("@/app/landing/page"));
const Landing = lazy(() => import("@/app/new-landing/page"));

function App() {
  return (
    <Router>
      <Suspense fallback={<BlockLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/old-landing" element={<OldLanding />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/complete-setup" element={<CompleteSetup />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/gym-branding" element={<Branding />} />
          <Route path="/compliance-documents" element={<Documents />} />
          <Route path="/gym-locations" element={<GymLocations />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/members" element={<Members />} />
          <Route path="/dashboard/members/new" element={<AddMember />} />
          <Route path="/dashboard/members/:id" element={<MemberDetails />} />
          <Route path="/dashboard/members/:id/edit" element={<EditMember />} />
          <Route
            path="/dashboard/membership-plans"
            element={<MembershipPlans />}
          />
          <Route path="/dashboard/trainers" element={<Trainers />} />
          <Route
            path="/dashboard/trainers/assignments"
            element={<TrainerAssignments />}
          />
          <Route path="/dashboard/locations" element={<Locations />} />
          <Route path="/dashboard/locations/new" element={<AddLocation />} />
          <Route
            path="/dashboard/lcations/new"
            element={<Navigate to="/dashboard/locations/new" replace />}
          />
          <Route path="/dashboard/gym-profile" element={<GymProfile />} />
          <Route
            path="/dashboard/locations/:id"
            element={<LocationDetails />}
          />
          <Route
            path="/dashboard/locations/:id/facilities"
            element={<LocationFacilities />}
          />
          <Route
            path="/dashboard/locations/:id/operating-hours"
            element={<OperatingHours />}
          />
          <Route
            path="/dashboard/operating-hours"
            element={<OperatingHoursLegacyRedirect />}
          />
          <Route path="/dashboard/staff" element={<Staff />} />
          <Route path="/dashboard/staff/roles" element={<StaffRoles />} />
          <Route path="/dashboard/subscriptions" element={<Subscriptions />} />
          <Route
            path="/dashboard/subscriptions/:id"
            element={<SubscriptionDetails />}
          />
          <Route path="/dashboard/classes" element={<Classes />} />
          <Route
            path="/dashboard/classes/attendance"
            element={<Attendance />}
          />
          <Route path="/dashboard/classes/:id" element={<ClassDetails />} />
          <Route path="/dashboard/check-in" element={<CheckIn />} />
          <Route
            path="/dashboard/payments/transactions"
            element={<Transactions />}
          />
          {/* <Route path="/dashboard/payments/invoices" element={<Invoices />} /> */}
          {/* <Route path="/dashboard/payments/refunds" element={<Refunds />} /> */}
          <Route
            path="/dashboard/marketing/promo-codes"
            element={<PromoCodes />}
          />
          <Route
            path="/dashboard/marketing/email-campaigns"
            element={<EmailCampaigns />}
          />
          <Route
            path="/dashboard/marketing/sms-campaigns"
            element={<SmsCampaigns />}
          />
          <Route path="/billing" element={<Billing />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
