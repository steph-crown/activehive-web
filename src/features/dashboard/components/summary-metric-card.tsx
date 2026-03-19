import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type SummaryMetricCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  valueColorClass: string;
  iconBgClass: string;
  iconColorClass: string;
  helperText?: string;
  helperTextClass?: string;
  hoverShadowClass: string;
};

export function SummaryMetricCard({
  title,
  value,
  icon,
  valueColorClass,
  iconBgClass,
  iconColorClass,
  helperText,
  helperTextClass,
  hoverShadowClass,
}: Readonly<SummaryMetricCardProps>) {
  return (
    <Card
      className={`gap-0 border border-[#F4F4F4] bg-white p-0 shadow-none transition-shadow ${hoverShadowClass}`}
    >
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-col items-start gap-5">
          <div
            className={`flex size-12 items-center justify-center rounded-[10px] ${iconBgClass} ${iconColorClass}`}
          >
            {icon}
          </div>
          <span className="text-xs font-semibold text-[#3C3C3C]">{title}</span>
        </div>
        <div className={`text-2xl leading-none font-bold ${valueColorClass}`}>
          {value}
        </div>
        {helperText ? (
          <p className={`text-xs font-medium ${helperTextClass ?? "text-[#959595]"}`}>
            {helperText}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
