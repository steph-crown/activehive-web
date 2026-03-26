import * as React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  IconCalendarCheck,
  IconCreditCard,
  IconStack2,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

type MetricCardTheme = {
  Icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
    stroke?: string | number;
  }>;
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
      Icon: IconCreditCard,
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
      Icon: IconUsers,
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
      Icon: IconStack2,
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
      Icon: IconCalendarCheck,
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
        const TrendIcon = card.isPositive ? IconTrendingUp : IconTrendingDown;
        const percent = Math.abs(card.percentChange);

        return (
          <Link key={card.title} to={card.href} className="block">
            <Card
              className={`@container/card p-0 gap-0 bg-white border border-[#f4f4f4] shadow-none transition-shadow ${card.hoverShadowClass} !rounded-md`}
              style={card.cssVars}
            >
              <div className="flex flex-col gap-2 p-5">
                <div className="flex flex-col items-start gap-5">
                  <div
                    className="flex size-12 items-center justify-center rounded-md"
                    style={{ backgroundColor: card.iconBgVar }}
                  >
                    <card.Icon
                      className="size-6"
                      style={{ color: card.iconColorVar }}
                      stroke={2}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold text-gray-500"
                    // style={{ color: "var(--grey-800)" }}
                  >
                    {card.title}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div
                    className="text-3xl leading-none font-bold font-bebas"
                    // style={{ color: card.valueColorVar }}
                  >
                    {card.value}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{
                        color: card.isPositive
                          ? "var(--success-500)"
                          : "var(--error-400)",
                      }}
                    >
                      <TrendIcon className="size-4" stroke={2} />~{percent}%
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--grey-500)" }}
                    >
                      {card.comparisonText}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
