"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconBuildingStore,
  IconCalendar,
  IconCalendarCheck,
  IconChevronRight,
  IconDashboard,
  IconCreditCard,
  IconCurrencyNaira,
  IconMapPin,
  IconMessage,
  IconUserShield,
  IconUsers,
} from "@tabler/icons-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavSubItem = {
  title: string;
  href: string;
  isActive: boolean;
};

type NavGroupItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  items: NavSubItem[];
};

type NavMainGroupedProps = Readonly<{
  selectedLocationId: string | null;
}>;

export function NavMainGrouped({ selectedLocationId }: NavMainGroupedProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const gymProfileHref = selectedLocationId
    ? `/dashboard/locations/${selectedLocationId}`
    : "/dashboard/locations";
  const operatingHoursHref = selectedLocationId
    ? `/dashboard/locations/${selectedLocationId}/operating-hours`
    : "/dashboard/locations";

  const isDashboardActive = pathname === "/dashboard";
  const isCheckInActive = pathname === "/dashboard/check-in";

  const isGymProfileActive = selectedLocationId
    ? pathname === `/dashboard/locations/${selectedLocationId}`
    : /^\/dashboard\/locations\/[^/]+$/.test(pathname);
  const isOperatingHoursActive =
    /^\/dashboard\/locations\/[^/]+\/operating-hours$/.test(pathname);

  const isPlansActive =
    pathname === "/dashboard/membership-plans" ||
    pathname.startsWith("/dashboard/membership-plans/");
  const isSubscriptionsActive =
    pathname === "/dashboard/subscriptions" ||
    pathname.startsWith("/dashboard/subscriptions/");

  const isAttendanceActive = pathname === "/dashboard/classes/attendance";
  const isClassScheduleActive =
    pathname === "/dashboard/classes" ||
    (pathname.startsWith("/dashboard/classes/") && !isAttendanceActive);

  const isStaffUsersActive = pathname === "/dashboard/staff";
  const isStaffRolesActive = pathname === "/dashboard/staff/roles";
  const isStaffPermissionsActive = pathname === "/dashboard/staff/permissions";

  const isAllLocationsActive = pathname === "/dashboard/locations";

  const groups: NavGroupItem[] = [
    {
      title: "Gym Management",
      icon: IconBuildingStore,
      isActive: isGymProfileActive || isOperatingHoursActive,
      items: [
        {
          title: "Gym Profile",
          href: gymProfileHref,
          isActive: isGymProfileActive,
        },
        {
          title: "Operating Hours",
          href: operatingHoursHref,
          isActive: isOperatingHoursActive,
        },
      ],
    },
    {
      title: "Members",
      icon: IconUsers,
      isActive: pathname === "/dashboard/members",
      items: [
        {
          title: "All Members",
          href: "/dashboard/members",
          isActive: pathname === "/dashboard/members",
        },
      ],
    },
    {
      title: "Membership Plans",
      icon: IconCreditCard,
      isActive: isPlansActive || isSubscriptionsActive,
      items: [
        {
          title: "Plans",
          href: "/dashboard/membership-plans",
          isActive: isPlansActive,
        },
        {
          title: "Subscriptions",
          href: "/dashboard/subscriptions",
          isActive: isSubscriptionsActive,
        },
      ],
    },
    {
      title: "Classes",
      icon: IconCalendar,
      isActive: isClassScheduleActive || isAttendanceActive,
      items: [
        {
          title: "Class Schedule",
          href: "/dashboard/classes",
          isActive: isClassScheduleActive,
        },
        {
          title: "Attendance",
          href: "/dashboard/classes/attendance",
          isActive: isAttendanceActive,
        },
      ],
    },
    {
      title: "Payments",
      icon: IconCurrencyNaira,
      isActive:
        pathname === "/dashboard/payments/transactions" ||
        pathname === "/dashboard/payments/invoices" ||
        pathname === "/dashboard/payments/refunds",
      items: [
        {
          title: "Transactions",
          href: "/dashboard/payments/transactions",
          isActive: pathname === "/dashboard/payments/transactions",
        },
        {
          title: "Invoices",
          href: "/dashboard/payments/invoices",
          isActive: pathname === "/dashboard/payments/invoices",
        },
        {
          title: "Refunds",
          href: "/dashboard/payments/refunds",
          isActive: pathname === "/dashboard/payments/refunds",
        },
      ],
    },
    {
      title: "Marketing",
      icon: IconMessage,
      isActive:
        pathname === "/dashboard/marketing/promo-codes" ||
        pathname === "/dashboard/marketing/email-campaigns" ||
        pathname === "/dashboard/marketing/sms-campaigns",
      items: [
        {
          title: "Promo Codes",
          href: "/dashboard/marketing/promo-codes",
          isActive: pathname === "/dashboard/marketing/promo-codes",
        },
        {
          title: "Email Campaigns",
          href: "/dashboard/marketing/email-campaigns",
          isActive: pathname === "/dashboard/marketing/email-campaigns",
        },
        {
          title: "SMS Campaigns",
          href: "/dashboard/marketing/sms-campaigns",
          isActive: pathname === "/dashboard/marketing/sms-campaigns",
        },
      ],
    },
    {
      title: "Staff Management",
      icon: IconUserShield,
      isActive:
        isStaffUsersActive || isStaffRolesActive || isStaffPermissionsActive,
      items: [
        {
          title: "Staff Users",
          href: "/dashboard/staff",
          isActive: isStaffUsersActive,
        },
        {
          title: "Roles",
          href: "/dashboard/staff/roles",
          isActive: isStaffRolesActive,
        },
        {
          title: "Permissions",
          href: "/dashboard/staff/permissions",
          isActive: isStaffPermissionsActive,
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Dashboard"
              isActive={isDashboardActive}
            >
              <Link to="/dashboard">
                <IconDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Check-In"
              isActive={isCheckInActive}
            >
              <Link to="/dashboard/check-in">
                <IconCalendarCheck />
                <span>Check-In</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {groups.map((group) => (
            <Collapsible
              key={group.title}
              asChild
              defaultOpen={group.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={group.title}>
                    <group.icon />
                    <span>{group.title}</span>
                    <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {group.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <Link to={item.href}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Locations"
              isActive={isAllLocationsActive}
            >
              <Link to="/dashboard/locations">
                <IconMapPin />
                <span>Locations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
