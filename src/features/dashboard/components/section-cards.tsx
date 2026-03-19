import * as React from "react";
import { Card } from "@/components/ui/card";

function TrendUpIcon(props: React.SVGProps<SVGSVGElement>) {
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

function TrendDownIcon(props: React.SVGProps<SVGSVGElement>) {
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

function CourseManagementBooksIcon(props: React.SVGProps<SVGSVGElement>) {
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
          d="M16 22C17.0195 21.175 17.6713 19.9136 17.6713 18.5C17.6713 17.0864 17.0195 15.825 16 15H28.4999C30.4329 15 31.9999 16.567 31.9999 18.5C31.9999 20.433 30.4329 22 28.4999 22H16Z"
          fill="var(--primary-500)"
        />
        <path
          d="M32 32C30.9805 31.175 30.3287 29.9136 30.3287 28.5C30.3287 27.0864 30.9805 25.825 32 25H19.5001C17.5671 25 16.0001 26.567 16.0001 28.5C16.0001 30.433 17.5671 32 19.5001 32H32Z"
          fill="var(--primary-500)"
        />
      </g>
      <path
        d="M16 22C17.0195 21.175 17.6713 19.9136 17.6713 18.5C17.6713 17.0864 17.0195 15.825 16 15H28.4999C30.4329 15 31.9999 16.567 31.9999 18.5C31.9999 20.433 30.4329 22 28.4999 22H16Z"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M32 32C30.9805 31.175 30.3287 29.9136 30.3287 28.5C30.3287 27.0864 30.9805 25.825 32 25H19.5001C17.5671 25 16.0001 26.567 16.0001 28.5C16.0001 30.433 17.5671 32 19.5001 32H32Z"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CourseManagementUsersIcon(props: React.SVGProps<SVGSVGElement>) {
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

function CourseManagementStarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path
        opacity="0.3"
        d="M23.784 14.8709C23.8804 14.7053 24.1196 14.7053 24.216 14.8709L27.1774 19.9552C27.2127 20.0159 27.2719 20.0589 27.3405 20.0737L33.0911 21.319C33.2783 21.3595 33.3522 21.587 33.2246 21.7299L29.3042 26.1174C29.2574 26.1698 29.2348 26.2394 29.2419 26.3092L29.8346 32.1631C29.8539 32.3538 29.6604 32.4944 29.4851 32.4171L24.1008 30.0444C24.0366 30.0161 23.9634 30.0161 23.8992 30.0444L18.5149 32.4171C18.3396 32.4944 18.1461 32.3538 18.1654 32.1631L18.7581 26.3092C18.7652 26.2394 18.7426 26.1698 18.6958 26.1174L14.7754 21.7299C14.6478 21.587 14.7217 21.3595 14.9089 21.319L20.6595 20.0737C20.7281 20.0589 20.7873 20.0159 20.8226 19.9552L23.784 14.8709Z"
        fill="var(--blue-500)"
      />
      <path
        d="M23.784 14.8709C23.8804 14.7053 24.1196 14.7053 24.216 14.8709L27.1774 19.9552C27.2127 20.0159 27.2719 20.0589 27.3405 20.0737L33.0911 21.319C33.2783 21.3595 33.3522 21.587 33.2246 21.7299L29.3042 26.1174C29.2574 26.1698 29.2348 26.2394 29.2419 26.3092L29.8346 32.1631C29.8539 32.3538 29.6604 32.4943 29.4851 32.4171L24.1008 30.0444C24.0366 30.0161 23.9634 30.0161 23.8992 30.0444L18.5149 32.4171C18.3396 32.4943 18.1461 32.3538 18.1654 32.1631L18.7581 26.3092C18.7652 26.2394 18.7426 26.1698 18.6958 26.1174L14.7754 21.7299C14.6478 21.587 14.7217 21.3595 14.9089 21.319L20.6595 20.0737C20.7281 20.0589 20.7873 20.0159 20.8226 19.9552L23.784 14.8709Z"
        stroke="var(--blue-500)"
        strokeWidth="2"
      />
    </svg>
  );
}

function CourseManagementBookmarkIcon(
  props: React.SVGProps<SVGSVGElement>,
) {
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
        opacity="0.3"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 18C17 16.3431 18.3431 15 20 15H28C29.6569 15 31 16.3431 31 18V32.0657C31 33.2638 29.6648 33.9784 28.6679 33.3138L24 30.2019L19.332 33.3138C18.3352 33.9784 17 33.2638 17 32.0657V18Z"
        fill="var(--error-500)"
      />
      <path
        d="M30 23V18C30 16.8954 29.1046 16 28 16H20C18.8954 16 18 16.8954 18 18V32.0657C18 32.4651 18.4451 32.7033 18.7773 32.4818L23.7226 29.1849C23.8906 29.0729 24.1094 29.0729 24.2774 29.1849L25 29.6667M27.4948 33.7508L27.8012 31.6059C27.8318 31.3917 27.9311 31.1932 28.0841 31.0402L31.3839 27.7403C31.9697 27.1546 32.9195 27.1546 33.5052 27.7403C34.091 28.3261 34.091 29.2759 33.5052 29.8617L30.2054 33.1615C30.0524 33.3145 29.8539 33.4137 29.6397 33.4443L27.4948 33.7508Z"
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
  shadowClass: string;
  cssVars: React.CSSProperties;
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
      title: "My Courses",
      value: "8,746",
      percentChange: 2.4,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <CourseManagementBooksIcon />,
      valueColorVar: "var(--primary-500)",
      shadowClass:
        "shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--primary-50": "#ffefe6",
        "--primary-500": "#ff5b04",
      }),
    },
    {
      title: "Total Learners",
      value: "8,746",
      percentChange: 2.4,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <CourseManagementUsersIcon />,
      valueColorVar: "var(--purple-500)",
      shadowClass:
        "shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--purple-50": "#f2eeff",
        "--purple-500": "#7e52ff",
      }),
    },
    {
      title: "Total Ratings",
      value: "100",
      percentChange: 2.4,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <CourseManagementStarIcon />,
      valueColorVar: "var(--blue-500)",
      shadowClass:
        "shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--blue-50": "#ececff",
        "--blue-500": "#4342ff",
      }),
    },
    {
      title: "Total Drafts",
      value: "8,746",
      percentChange: -2.4,
      isPositive: false,
      comparisonText: "vs last month",
      icon: <CourseManagementBookmarkIcon />,
      valueColorVar: "var(--error-500)",
      shadowClass:
        "shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--error-50": "#fbeaea",
        "--error-500": "#d32f2f",
      }),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardThemes.map((card) => {
        const TrendIcon = card.isPositive ? TrendUpIcon : TrendDownIcon;
        const percent = Math.abs(card.percentChange);

        return (
          <Card
            key={card.title}
            className={`@container/card p-0 gap-0 bg-white border border-[#f4f4f4] shadow-none ${card.shadowClass}`}
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
        );
      })}
    </div>
  );
}
