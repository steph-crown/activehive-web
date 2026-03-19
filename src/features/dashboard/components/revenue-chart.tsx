import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendsTimeframe = "12 months" | "30 days" | "7 days" | "24 hours";

type TrendPoint = {
  label: string;
  revenueGenerated: number; // already in "thousands" (matches original tooltip formatting)
  courseCompletionRate: number;
};

type PerformanceTrendsQueryData = {
  valueScale?: number;
  points: TrendPoint[];
};

// Custom Tooltip Component
type CustomTooltipPayloadEntry = {
  name: string;
  value: number;
  color?: string;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadEntry[];
  label?: string;
  timeframe?: TrendsTimeframe;
}

function CustomTooltip({
  active,
  payload,
  label,
  timeframe,
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const formatLabel = (labelToFormat: string) => {
      if (timeframe === "12 months") {
        return `${labelToFormat}. 2025`;
      }
      if (timeframe === "24 hours") {
        return `${labelToFormat}:00`;
      }
      return `Jan ${labelToFormat}, 2025`;
    };

    const formatValue = (name: string, value: number) => {
      if (name === "Revenue Generated") {
        if (value === 0) return "₦0.0k";
        // Value is already in thousands, format as k
        return `₦${value.toFixed(1)}k`;
      }
      if (name === "Course Completion rate") return `${value}%`;
      return value;
    };

    return (
      <div className="bg-grey-900 space-y-2 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-sm font-semibold text-white">
          {formatLabel(label || "")}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-xs text-white"
            style={{ color: entry.color }}
          >
            {entry.name}: {formatValue(entry.name, entry.value)}
          </p>
        ))}
      </div>
    );
  }

  return null;
}

export function RevenueChart() {
  const [trendsTimeframe, setTrendsTimeframe] = useState<TrendsTimeframe>(
    "30 days",
  );

  const timeframes: TrendsTimeframe[] = [
    "12 months",
    "30 days",
    "7 days",
    "24 hours",
  ];

  const trendsQueryData: PerformanceTrendsQueryData = useMemo(() => {
    const valueScale = 1;

    if (trendsTimeframe === "12 months") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return {
        valueScale,
        points: months.map((m, i) => ({
          label: m,
          revenueGenerated: 80 + i * 12 + (i % 3) * 4,
          courseCompletionRate: 62 + i * 1.3,
        })),
      };
    }

    if (trendsTimeframe === "24 hours") {
      return {
        valueScale,
        points: Array.from({ length: 24 }, (_, i) => ({
          label: String(i),
          revenueGenerated: 65 + i * 1.1 + (i % 5) * 2,
          courseCompletionRate: 55 + (i % 10) * 2.2,
        })),
      };
    }

    const daysCount = trendsTimeframe === "7 days" ? 7 : 30;

    return {
      valueScale,
      points: Array.from({ length: daysCount }, (_, i) => ({
        label: String(i + 1),
        revenueGenerated: 70 + i * 2.2 + (i % 4) * 3,
        courseCompletionRate: 60 + i * 0.8,
      })),
    };
  }, [trendsTimeframe]);

  const trendsData = useMemo(() => {
    if (!trendsQueryData?.points?.length) return [];
    const scale = trendsQueryData.valueScale || 1;

    return trendsQueryData.points.map((p) => ({
      day: p.label,
      revenue: p.revenueGenerated / scale,
      completion: p.courseCompletionRate,
    }));
  }, [trendsQueryData]);

  // No API call in ActiveHive: keep UI logic but use static data.
  const isLoading = false;

  return (
    <Card className="border-grey-50 p-0 shadow-none">
      <div className="flex flex-col">
        {/* Header */}
        <div className="border-grey-50 flex items-center justify-between border-b px-6 py-3">
          <h3 className="text-grey-800 text-sm font-semibold">
            Performance Trends
          </h3>

          {/* Time Filter */}
          <div className="border-grey-200 inline-flex items-center overflow-hidden rounded-md border bg-white">
            {timeframes.map((timeframe, index) => (
              <button
                key={timeframe}
                onClick={() => setTrendsTimeframe(timeframe)}
                className={cn(
                  "border-r px-3 py-1 text-xs font-medium transition-colors",
                  index === timeframes.length - 1 && "border-none",
                  trendsTimeframe === timeframe
                    ? "bg-grey-50 text-grey-900 font-semibold"
                    : "text-grey-500 hover:text-grey-900",
                )}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6">
          {/* Chart */}
          <div className="h-[300px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
            {isLoading ? (
              <div className="bg-grey-50 text-grey-400 flex h-full items-center justify-center rounded-lg text-xs">
                Loading chart…
              </div>
            ) : trendsData.length === 0 ? (
              <div className="text-grey-500 flex h-full items-center justify-center text-xs">
                No performance trends yet for this timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#FF5B04"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor="#FF5B04"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorCompletion"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#7E52FF"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor="#7E52FF"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="0"
                    vertical={true}
                    horizontal={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    content={<CustomTooltip timeframe={trendsTimeframe} />}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={6}
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#000000",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF5B04"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    name="Revenue Generated"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="completion"
                    stroke="#7E52FF"
                    strokeWidth={2}
                    fill="url(#colorCompletion)"
                    name="Course Completion rate"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

