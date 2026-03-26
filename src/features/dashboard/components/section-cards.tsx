import * as React from "react";
import { Link } from "react-router-dom";
import {
  IconCalendarWeekFilled,
  IconCreditCardFilled,
} from "@tabler/icons-react";
import { Layers3, UsersRound } from "lucide-react";
import { SummaryMetricCard } from "./summary-metric-card";

type MetricCardTheme = {
  icon: React.ReactNode;
  iconBgVar: string;
  iconColorVar: string;
  title: string;
  value: string;
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

export function SectionCards() {
  const baseVars = {
    "--success-500": "#22c55e",
    "--error-400": "#dc5959",
    "--grey-800": "#3c3c3c",
    "--grey-500": "#959595",
  } as Record<string, string>;

  const cardThemes: MetricCardTheme[] = [
    {
      title: "Monthly revenue",
      value: "8,746",
      percentChange: 2.4,
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
      value: "8,746",
      percentChange: 2.4,
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
      title: "Active plans",
      value: "100",
      percentChange: 2.4,
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
      value: "8,746",
      percentChange: -2.4,
      isPositive: false,
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
