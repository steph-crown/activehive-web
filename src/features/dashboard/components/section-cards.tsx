import * as React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

function TrendUpIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1621_251540)">
        <path
          d="M14.6667 4.66699L9.42095 9.91275C9.15694 10.1768 9.02494 10.3088 8.87272 10.3582C8.73882 10.4017 8.59459 10.4017 8.4607 10.3582C8.30848 10.3088 8.17647 10.1768 7.91246 9.91274L6.08762 8.08791C5.82361 7.82389 5.6916 7.69189 5.53939 7.64243C5.40549 7.59892 5.26126 7.59892 5.12736 7.64243C4.97514 7.69189 4.84314 7.82389 4.57913 8.08791L1.33337 11.3337M14.6667 4.66699H10M14.6667 4.66699V9.33366"
          stroke="var(--success-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1621_251540">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function TrendDownIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.6667 11.3337L9.42092 6.08791C9.15691 5.82389 9.02491 5.69189 8.87269 5.64243C8.73879 5.59892 8.59456 5.59892 8.46066 5.64243C8.30845 5.69189 8.17644 5.82389 7.91243 6.08791L6.08759 7.91275C5.82358 8.17676 5.69157 8.30876 5.53935 8.35822C5.40546 8.40173 5.26123 8.40173 5.12733 8.35822C4.97511 8.30876 4.84311 8.17676 4.5791 7.91274L1.33334 4.66699M14.6667 11.3337H10M14.6667 11.3337V6.66699"
        stroke="var(--error-400)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

 

function LearnersIconPurple(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--purple-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <g opacity="0.3">
        <path
          d="M28 19C28 21.2091 26.2091 23 24 23C21.7909 23 20 21.2091 20 19C20 16.7909 21.7909 15 24 15C26.2091 15 28 16.7909 28 19Z"
          fill="var(--purple-500)"
        />
        <path
          d="M32 32C32 32.5523 31.5523 33 31 33H17C16.4477 33 16 32.5523 16 32V31C16 28.7909 17.7909 27 20 27H28C30.2091 27 32 28.7909 32 31V32Z"
          fill="var(--purple-500)"
        />
      </g>
      <path
        d="M28 19C28 21.2091 26.2091 23 24 23C21.7909 23 20 21.2091 20 19C20 16.7909 21.7909 15 24 15C26.2091 15 28 16.7909 28 19Z"
        stroke="var(--purple-500)"
        strokeWidth="2"
      />
      <path
        d="M32 32C32 32.5523 31.5523 33 31 33H17C16.4477 33 16 32.5523 16 32V31C16 28.7909 17.7909 27 20 27H28C30.2091 27 32 28.7909 32 31V32Z"
        stroke="var(--purple-500)"
        strokeWidth="2"
      />
    </svg>
  );
}

function TransactionsIconPrimary(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--primary-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <g opacity="0.3">
        <path
          d="M18 21C18 18.7909 19.7909 17 22 17H31C32.1046 17 33 17.8954 33 19V28C33 29.1046 32.1046 30 31 30H22C19.7909 30 18 28.2091 18 26V21Z"
          fill="var(--primary-500)"
        />
      </g>
      <path
        d="M18 21C18 18.7909 19.7909 17 22 17H31C32.1046 17 33 17.8954 33 19V28C33 29.1046 32.1046 30 31 30H22C19.7909 30 18 28.2091 18 26V21Z"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M22 20H29"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 24H27"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 28H25.5"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlansIconBlue(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--blue-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <g opacity="0.3">
        <path
          d="M16 18L24 14L32 18L24 22L16 18Z"
          fill="var(--blue-500)"
        />
        <path
          d="M16 24L24 20L32 24L24 28L16 24Z"
          fill="var(--blue-500)"
        />
      </g>
      <path
        d="M16 18L24 14L32 18L24 22L16 18Z"
        stroke="var(--blue-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 24L24 20L32 24L24 28L16 24Z"
        stroke="var(--blue-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M24 22V28"
        stroke="var(--blue-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckInsIconError(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--error-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <path
        d="M18 18C18 16.8954 18.8954 16 20 16H28C29.1046 16 30 16.8954 30 18V30C30 31.1046 29.1046 32 28 32H20C18.8954 32 18 31.1046 18 30V18Z"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 14V18"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 14V18"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 24L23.5 26.5L28 22"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MetricCardTheme = {
  icon: React.ReactNode;
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
      icon: <TransactionsIconPrimary />,
      valueColorVar: "var(--primary-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]",
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
      icon: <LearnersIconPurple />,
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
      icon: <PlansIconBlue />,
      valueColorVar: "var(--blue-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]",
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
      icon: <CheckInsIconError />,
      valueColorVar: "var(--error-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]",
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
        const TrendIcon = card.isPositive ? TrendUpIcon : TrendDownIcon;
        const percent = Math.abs(card.percentChange);

        return (
          <Link key={card.title} to={card.href} className="block">
            <Card
              className={`@container/card p-0 gap-0 bg-white border border-[#f4f4f4] shadow-none transition-shadow ${card.hoverShadowClass}`}
              style={card.cssVars}
            >
            <div className="flex flex-col gap-2 p-5">
              <div className="flex flex-col items-start gap-5">
                {card.icon}
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--grey-800)" }}
                >
                  {card.title}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div
                  className="text-2xl leading-none font-bold"
                  style={{ color: card.valueColorVar }}
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
                    <TrendIcon className="size-4" />
                    ~{percent}%
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
