import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LearnersTimeframe = "12 months" | "30 days" | "7 days" | "24 hours";

type LearnersPoint = {
  label: string;
  activeLearners: number;
  totalLearners: number;
};

export function MembersChart() {
  const [learnersTimeframe, setLearnersTimeframe] =
    useState<LearnersTimeframe>("7 days");

  const timeframes: LearnersTimeframe[] = [
    "12 months",
    "30 days",
    "7 days",
    "24 hours",
  ];

  const learnersQueryData: LearnersPoint[] = useMemo(() => {
    if (learnersTimeframe === "12 months") {
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
      return months.map((m, i) => ({
        label: m,
        activeLearners: 1100 + i * 75 + (i % 3) * 25,
        totalLearners: 1900 + i * 95 + (i % 4) * 40,
      }));
    }

    if (learnersTimeframe === "24 hours") {
      return Array.from({ length: 24 }, (_, i) => {
        const active = 800 + i * 20 + (i % 6) * 35;
        const total = 1200 + i * 28 + (i % 7) * 30;
        return { label: String(i), activeLearners: active, totalLearners: total };
      });
    }

    const daysCount = learnersTimeframe === "7 days" ? 7 : 30;
    return Array.from({ length: daysCount }, (_, i) => {
      const active = 900 + i * 38 + (i % 4) * 52;
      const total = 1500 + i * 48 + (i % 5) * 45;
      return { label: String(i + 1), activeLearners: active, totalLearners: total };
    });
  }, [learnersTimeframe]);

  const learnersData = useMemo(() => {
    if (!learnersQueryData?.length) return [];
    return learnersQueryData.map((p) => ({
      day: p.label,
      active: p.activeLearners,
      inactive: Math.max(0, p.totalLearners - p.activeLearners),
    }));
  }, [learnersQueryData]);

  // Simple Y-axis ticks; keep it static and rely on the data mapping.
  const getYAxisTicks = () => {
    if (learnersTimeframe === "24 hours") {
      return [0, 200, 500, 1000, 1500];
    }
    return [0, 500, 1000, 1500, 2000, 2500];
  };

  // No API call in ActiveHive: keep UI logic but use static data.
  const isLoading = false;

  return (
    <Card className="border-grey-50 p-0 shadow-none">
      <div className="flex flex-col">
        {/* Header */}
        <div className="border-grey-50 flex items-center justify-between border-b px-6 py-3">
          <h3 className="text-grey-800 text-sm font-semibold">
            Learners Activity
          </h3>

          {/* Time Filter */}
          <div className="border-grey-200 inline-flex items-center overflow-hidden rounded-md border bg-white">
            {timeframes.map((timeframe, index) => (
              <button
                key={timeframe}
                onClick={() => setLearnersTimeframe(timeframe)}
                className={cn(
                  "border-r px-3 py-1 text-xs font-medium transition-colors",
                  index === timeframes.length - 1 && "border-none",
                  learnersTimeframe === timeframe
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
              <div className="text-grey-500 flex h-full items-center justify-center text-sm">
                Loading…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={learnersData} barSize={16} barGap={12}>
                  <CartesianGrid
                    strokeDasharray="0"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#000000", fontWeight: "500", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#000000", fontWeight: "500", fontSize: 10 }}
                    ticks={getYAxisTicks()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
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
                  <Bar
                    dataKey="active"
                    stackId="learners"
                    fill="#FF5B04"
                    radius={[0, 0, 0, 0]}
                    name="Active Learners"
                  />
                  <Bar
                    dataKey="inactive"
                    stackId="learners"
                    fill="#FFDECD"
                    radius={[16, 16, 0, 0]}
                    name="Total Learners"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

