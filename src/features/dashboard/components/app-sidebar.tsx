import { IconHelp } from "@tabler/icons-react";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Logo } from "@/components/icons/logo";
import { NavSecondary, NavUser } from "@/components/layout";
import { NavMainGrouped } from "@/components/layout/nav-main-grouped";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProfileQuery } from "../services";
import { useMySubscriptionQuery } from "@/features/billing/services";
import { useLocationStore, useSubscriptionStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { GetHelpModal } from "./get-help-modal";

const data = {
  navSecondary: [
    {
      title: "Get Help",
      url: "#",
      icon: <IconHelp />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isLoading } = useProfileQuery();
  const { isLoading: isSubscriptionLoading, isFetched } =
    useMySubscriptionQuery();
  const { hasActiveSubscription } = useSubscriptionStore();
  const { selectedLocationId } = useLocationStore();
  const { showError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isGetHelpOpen, setIsGetHelpOpen] = React.useState(false);
  const hasRedirectedRef = React.useRef(false);

  console.log({ hasActiveSubscription });

  React.useEffect(() => {
    if (isSubscriptionLoading || !isFetched) return;
    if (hasRedirectedRef.current) return;

    const currentPath = location.pathname;
    const isBillingPage = currentPath === "/billing";

    if (!isBillingPage && !hasActiveSubscription) {
      hasRedirectedRef.current = true;
      showError(
        "Subscription required",
        "You need an active subscription to access this page. Redirecting to billing.",
      );
      navigate("/billing");
    }
  }, [
    hasActiveSubscription,
    isFetched,
    isSubscriptionLoading,
    location.pathname,
    navigate,
    showError,
  ]);

  const user = React.useMemo(() => {
    if (!profile) {
      return {
        name: "User",
        email: "",
        avatar: "",
      };
    }

    const fullName =
      `${profile.firstName} ${profile.lastName}`.trim() || "User";
    return {
      name: fullName,
      email: profile.email,
      avatar: profile.profileImage || "",
    };
  }, [profile]);

  const navSecondaryWithHandler = React.useMemo(
    () =>
      data.navSecondary.map((item) =>
        item.title === "Get Help"
          ? { ...item, onClick: () => setIsGetHelpOpen(true) }
          : item,
      ),
    [],
  );

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0" {...props}>
      <SidebarHeader className="px-4 py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {/* <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a> */}
              <Logo path="/dashboard" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMainGrouped selectedLocationId={selectedLocationId} />
        <NavSecondary items={navSecondaryWithHandler} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        {!isLoading && <NavUser user={user} />}
      </SidebarFooter>
      <GetHelpModal open={isGetHelpOpen} onOpenChange={setIsGetHelpOpen} />
    </Sidebar>
  );
}
