import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

type SummaryMetricCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgVar: string;
  iconColorVar: string;
  valueColorVar: string;
  percentChange: number;
  isPositive: boolean;
  comparisonText: string;
  hoverShadowClass: string;
  style?: React.CSSProperties;
};

export function SummaryMetricCard({
  title,
  value,
  icon,
  iconBgVar,
  iconColorVar,
  percentChange,
  isPositive,
  comparisonText,
  hoverShadowClass,
  style,
}: Readonly<SummaryMetricCardProps>) {
  const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;
  const percent = Math.abs(percentChange);

  return (
    <Card
      className={`@container/card !rounded-md gap-0 border border-[#F4F4F4] bg-white p-0 shadow-none transition-shadow ${hoverShadowClass}`}
      style={style}
    >
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-col items-start gap-5">
          <div
            className="flex size-12 items-center justify-center rounded-md"
            style={{
              backgroundColor: iconBgVar,
              color: iconColorVar,
            }}
          >
            {icon}
          </div>
          <span className="text-xs font-medium text-gray-400">{title}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-3xl leading-none font-medium font-bebas text-black">
            {value}
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 text-xs font-medium"
              style={{
                color: isPositive ? "var(--success-500)" : "var(--error-400)",
              }}
            >
              <TrendIcon className="size-4" stroke={2} />~{percent}%
            </div>
            <span className="text-xs font-medium text-[#959595]">
              {comparisonText}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
