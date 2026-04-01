import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type SummaryMetricCardProps = {
  title: string;
  value: string;
  /** Shown under the main value, or on the right when {@link captionReplacesTrend} is true. */
  valueCaption?: string;
  /**
   * When set with `valueCaption`, shows the caption on the right instead of the
   * trend row (~% vs last month). Use for dashboard revenue / members cards.
   */
  captionReplacesTrend?: boolean;
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
  valueCaption,
  captionReplacesTrend = false,
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
  const varianceColor =
    percent === 0
      ? "#959595"
      : isPositive
        ? "var(--success-500)"
        : "var(--error-400)";

  const showCaptionBelow = valueCaption && !captionReplacesTrend;
  const showCaptionTrailing = valueCaption && captionReplacesTrend;

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
        <div
          className={cn(
            "flex justify-between gap-2 items-center",
            // showCaptionTrailing ? "items-center" : "items-start",
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="text-3xl leading-none font-medium font-bebas text-black">
              {value}
            </div>
            {showCaptionBelow ? (
              <p className="text-muted-foreground mt-1.5 text-xs font-medium">
                {valueCaption}
              </p>
            ) : null}
          </div>

          {showCaptionTrailing ? (
            <div className="text-muted-foreground max-w-[min(100%,11rem)] shrink-0 text-right text-xs leading-snug font-medium">
              {valueCaption}
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-2">
              <div
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: varianceColor }}
              >
                <TrendIcon className="size-4" stroke={2} />~{percent}%
              </div>
              <span className="text-xs font-medium text-[#959595]">
                {comparisonText}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
