import * as React from "react";
import { Link } from "react-router-dom";
import {
  IconCalendarWeekFilled,
  IconCreditCardFilled,
} from "@tabler/icons-react";
import { Layers3, UsersRound } from "lucide-react";
import type { GymOwnerDashboardOverview } from "../types";
import { SummaryMetricCard } from "./summary-metric-card";

type MetricCardTheme = {
  icon: React.ReactNode;
  iconBgVar: string;
  iconColorVar: string;
  title: string;
  value: string;
  valueCaption?: string;
  captionReplacesTrend?: boolean;
  percentChange: number;
  isPositive: boolean;
  comparisonText: string;
  valueColorVar: string;
  hoverShadowClass: string;
  cssVars: React.CSSProperties;
  href: string;
};

function mergeCssVars(vars: Record<string, string>) {
  return vars as React.CSSProperties;
}

function formatNgn(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(n);
}

const NO_COMPARISON_PERCENT = 0;

type SectionCardsProps = {
  overview: GymOwnerDashboardOverview | undefined;
};

export function SectionCards({ overview }: SectionCardsProps) {
  const baseVars = {
    "--success-500": "#22c55e",
    "--error-400": "#dc5959",
    "--grey-800": "#3c3c3c",
    "--grey-500": "#959595",
  } as Record<string, string>;

  const summary = overview?.summary;
  const quick = overview?.quickStats;

  const totalRevenue = summary?.totalRevenue ?? 0;
  const monthlyRevenue = summary?.monthlyRevenue ?? 0;
  const totalMembers = summary?.totalMembers ?? 0;
  const activeMembers = summary?.activeMembers ?? 0;
  const activeSubscriptions = quick?.activeSubscriptions ?? 0;

  const cardThemes: MetricCardTheme[] = [
    {
      title: "Total revenue",
      value: formatNgn(totalRevenue),
      valueCaption: `Monthly ${formatNgn(monthlyRevenue)}`,
      captionReplacesTrend: true,
      percentChange: NO_COMPARISON_PERCENT,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <IconCreditCardFilled className="size-6" />,
      iconBgVar: "var(--primary-50)",
      iconColorVar: "var(--primary-500)",
      valueColorVar: "var(--primary-500)",
      hoverShadowClass: "hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--primary-50": "#ffefe6",
        "--primary-500": "#ff5b04",
      }),
      href: "/dashboard/payments/transactions",
    },
    {
      title: "Total members",
      value: formatInt(totalMembers),
      valueCaption: `${formatInt(activeMembers)} active`,
      captionReplacesTrend: true,
      percentChange: NO_COMPARISON_PERCENT,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <UsersRound className="size-6 fill-current stroke-[1.8]" />,
      iconBgVar: "var(--purple-50)",
      iconColorVar: "var(--purple-500)",
      valueColorVar: "var(--purple-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--purple-50": "#f2eeff",
        "--purple-500": "#7e52ff",
      }),
      href: "/dashboard/members",
    },
    {
      title: "Active subscriptions",
      value: formatInt(activeSubscriptions),
      percentChange: NO_COMPARISON_PERCENT,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <Layers3 className="size-6 fill-current stroke-[1.8]" />,
      iconBgVar: "var(--blue-50)",
      iconColorVar: "var(--blue-500)",
      valueColorVar: "var(--blue-500)",
      hoverShadowClass: "hover:shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--blue-50": "#ececff",
        "--blue-500": "#4342ff",
      }),
      href: "/dashboard/membership-plans",
    },
    {
      title: "Today's check-ins",
      value: "0",
      percentChange: NO_COMPARISON_PERCENT,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <IconCalendarWeekFilled className="size-6" />,
      iconBgVar: "var(--error-50)",
      iconColorVar: "var(--error-500)",
      valueColorVar: "var(--error-500)",
      hoverShadowClass: "hover:shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--error-50": "#fbeaea",
        "--error-500": "#d32f2f",
      }),
      href: "/dashboard/check-in",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardThemes.map((card) => {
        return (
          <Link key={card.title} to={card.href} className="block">
            <SummaryMetricCard
              title={card.title}
              value={card.value}
              valueCaption={card.valueCaption}
              captionReplacesTrend={card.captionReplacesTrend}
              icon={card.icon}
              iconBgVar={card.iconBgVar}
              iconColorVar={card.iconColorVar}
              valueColorVar={card.valueColorVar}
              percentChange={card.percentChange}
              isPositive={card.isPositive}
              comparisonText={card.comparisonText}
              hoverShadowClass={card.hoverShadowClass}
              style={card.cssVars}
            />
          </Link>
        );
      })}
    </div>
  );
}
