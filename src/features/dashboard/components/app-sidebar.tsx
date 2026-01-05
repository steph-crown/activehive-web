import {
  IconCamera,
  IconChartBar,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconMapPin,
  IconReceipt,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react";
import * as React from "react";

import {
  NavDocuments,
  NavMain,
  NavSecondary,
  NavUser,
} from "@/components/layout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { useProfileQuery } from "../services";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Members",
    url: "/dashboard/members",
    icon: IconUsers,
  },
  {
    title: "Analytics",
    url: "#",
    icon: IconChartBar,
  },
  {
    title: "Membership Plans",
    url: "/dashboard/membership-plans",
    icon: IconCreditCard,
  },
  {
    title: "Locations",
    url: "/dashboard/locations",
    icon: IconMapPin,
  },
  {
    title: "Classes",
    url: "/dashboard/classes",
    icon: IconCalendar,
  },
  {
    title: "Staff",
    url: "/dashboard/staff",
    icon: IconUsers,
  },
  {
    title: "Subscriptions",
    url: "/dashboard/subscriptions",
    icon: IconReceipt,
  },
];

const data = {
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isLoading } = useProfileQuery();

  const user = React.useMemo(() => {
    if (!profile) {
      return {
        name: "User",
        email: "",
        avatar: "",
      };
    }

    const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "User";
    return {
      name: fullName,
      email: profile.email,
      avatar: profile.profileImage || "",
    };
  }, [profile]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
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
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
