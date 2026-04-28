import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  type PieLabelRenderProps,
} from "recharts";

import {
  useMemberMixChartQuery,
  type GymOwnerAnalyticsDashboardParams,
} from "../services";

type PieSlice = {
  name: string;
  value: number;
  count: number;
  percentage: number;
  color: string;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: PieSlice }>;
}

function CustomTooltip({ active, payload }: Readonly<CustomTooltipProps>) {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;
    if (!item) return null;
    return (
      <div className="bg-grey-900 space-y-1 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-semibold text-white">{item.name}</p>
        <p className="text-grey-400 text-xs">
          {item.count} member{item.count === 1 ? "" : "s"} · {item.percentage}%
        </p>
      </div>
    );
  }
  return null;
}

function renderSliceLabel(props: PieLabelRenderProps) {
  const payload = props.payload as PieSlice | undefined;
  const pct = payload?.percentage;
  if (pct == null || pct === 0) return null;
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const fill =
    payload?.color && isLightColor(payload.color) ? "#1f2937" : "#ffffff";

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight={500}
    >
      {`${pct}%`}
    </text>
  );
}

function isLightColor(hex: string): boolean {
  const raw = hex.trim().replace("#", "");
  if (raw.length !== 6) return false;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  if (Number.isNaN(r + g + b)) return false;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65;
}

type MembershipMixChartProps = {
  filters: GymOwnerAnalyticsDashboardParams;
};

export function MembershipMixChart({
  filters,
}: Readonly<MembershipMixChartProps>) {
  const { data, isLoading, isError } = useMemberMixChartQuery(filters);

  const chartData: PieSlice[] = useMemo(
    () =>
      (data?.data ?? []).map((row) => ({
        name: row.membershipType,
        value: row.percentage,
        count: row.count,
        percentage: row.percentage,
        color: row.color,
      })),
    [data?.data],
  );

  const hasData = chartData.some((d) => d.percentage > 0);

  if (isLoading) {
    return (
      <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
        <div className="flex flex-col">
          <div className="border-b border-[#F4F4F4] px-6 py-3">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="p-6">
            <Skeleton className="h-[355px] w-full rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
        <div className="flex flex-col">
          <div className="border-b border-[#F4F4F4] px-6 py-3">
            <h3 className="text-lg font-semibold text-[#3c3c3c]">
              Membership mix
            </h3>
          </div>
          <div className="text-muted-foreground p-6 text-sm">
            Could not load membership mix.
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
      <div className="flex flex-col">
        <div className="flex flex-col gap-0.5 border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-lg font-semibold text-[#3c3c3c]">
            {data?.title ?? "Membership mix"}
          </h3>
          {data?.subtitle ? (
            <p className="text-muted-foreground text-xs">{data.subtitle}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 p-6">
          {!hasData ? (
            <div className="text-muted-foreground flex h-[355px] items-center justify-center text-sm">
              No membership data for this period.
            </div>
          ) : (
            <div className="h-[355px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderSliceLabel}
                    outerRadius={130}
                    innerRadius={60}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={52}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#000000",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
