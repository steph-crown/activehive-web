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

export function NavMainGrouped() {
  const location = useLocation();
  const pathname = location.pathname;

  const isDashboardActive = pathname === "/dashboard";
  const isCheckInActive = pathname === "/dashboard/check-in";

  const isGymProfileActive = pathname === "/dashboard/gym-profile";

  const isPlansActive =
    pathname === "/dashboard/membership-plans" ||
    pathname.startsWith("/dashboard/membership-plans/");
  const isAllTrainersActive = pathname === "/dashboard/trainers";
  const isTrainerAssignmentsActive = pathname === "/dashboard/trainers/assignments";
  const isSubscriptionsActive =
    pathname === "/dashboard/subscriptions" ||
    pathname.startsWith("/dashboard/subscriptions/");

  const isAttendanceActive = pathname === "/dashboard/classes/attendance";
  const isClassScheduleActive =
    pathname === "/dashboard/classes" ||
    (pathname.startsWith("/dashboard/classes/") && !isAttendanceActive);

  const isStaffUsersActive = pathname === "/dashboard/staff";
  const isStaffRolesActive = pathname === "/dashboard/staff/roles";

  const isAllLocationsActive = pathname === "/dashboard/locations";
  const isAddLocationActive =
    pathname === "/dashboard/lcations/new" || pathname === "/dashboard/locations/new";
  const isMembersListActive = pathname === "/dashboard/members";
  const isAddMemberActive = pathname === "/dashboard/members/new";
  const isMemberDetailOrEditActive =
    /^\/dashboard\/members\/[^/]+$/.test(pathname) ||
    /^\/dashboard\/members\/[^/]+\/edit$/.test(pathname);

  const groups: NavGroupItem[] = [
    {
      title: "Members",
      icon: IconUsers,
      isActive:
        isMembersListActive || isAddMemberActive || isMemberDetailOrEditActive,
      items: [
        {
          title: "All Members",
          href: "/dashboard/members",
          isActive: isMembersListActive,
        },
        {
          title: "Add Member",
          href: "/dashboard/members/new",
          isActive: isAddMemberActive,
        },
      ],
    },
    {
      title: "Membership Plans",
      icon: IconCreditCard,
      isActive:
        isPlansActive ||
        isSubscriptionsActive ||
        isAllTrainersActive ||
        isTrainerAssignmentsActive,
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
      title: "Trainers",
      icon: IconUsers,
      isActive: isAllTrainersActive || isTrainerAssignmentsActive,
      items: [
        {
          title: "All Trainers",
          href: "/dashboard/trainers",
          isActive: isAllTrainersActive,
        },
        {
          title: "Trainer Assignments",
          href: "/dashboard/trainers/assignments",
          isActive: isTrainerAssignmentsActive,
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
      isActive: pathname === "/dashboard/payments/transactions",
      // || pathname === "/dashboard/payments/invoices" ||
      // pathname === "/dashboard/payments/refunds",
      items: [
        {
          title: "Transactions",
          href: "/dashboard/payments/transactions",
          isActive: pathname === "/dashboard/payments/transactions",
        },
        // {
        //   title: "Invoices",
        //   href: "/dashboard/payments/invoices",
        //   isActive: pathname === "/dashboard/payments/invoices",
        // },
        // {
        //   title: "Refunds",
        //   href: "/dashboard/payments/refunds",
        //   isActive: pathname === "/dashboard/payments/refunds",
        // },
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
      isActive: isStaffUsersActive || isStaffRolesActive,
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
      ],
    },
    {
      title: "Locations",
      icon: IconMapPin,
      isActive: isAllLocationsActive || isAddLocationActive,
      items: [
        {
          title: "All Locations",
          href: "/dashboard/locations",
          isActive: isAllLocationsActive,
        },
        {
          title: "Add Location",
          href: "/dashboard/lcations/new",
          isActive: isAddLocationActive,
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

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Gym Profile"
              isActive={isGymProfileActive}
            >
              <Link to="/dashboard/gym-profile">
                <IconBuildingStore />
                <span>Gym Profile</span>
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

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
