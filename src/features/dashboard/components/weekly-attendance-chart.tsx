import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

import {
  useWeeklyAttendanceChartQuery,
  type GymOwnerAnalyticsDashboardParams,
} from "../services";

type WeeklyAttendanceChartProps = {
  filters: GymOwnerAnalyticsDashboardParams;
};

export function WeeklyAttendanceChart({
  filters,
}: Readonly<WeeklyAttendanceChartProps>) {
  const { data, isLoading, isError } = useWeeklyAttendanceChartQuery(filters);

  const chartData = useMemo(
    () =>
      (data?.data ?? []).map((row) => ({
        day: row.dayShort,
        morning: row.morning,
        afternoon: row.afternoon,
        evening: row.evening,
      })),
    [data?.data],
  );

  const yMax = useMemo(() => {
    if (data?.maxValue != null && data.maxValue > 0) {
      return data.maxValue;
    }
    return Math.max(
      1,
      ...chartData.flatMap((d) => [d.morning, d.afternoon, d.evening]),
    );
  }, [data?.maxValue, chartData]);

  if (isLoading) {
    return (
      <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
            <Skeleton className="h-6 w-44" />
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
              Weekly attendance
            </h3>
          </div>
          <div className="text-muted-foreground p-6 text-sm">
            Could not load weekly attendance.
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
            {data?.title ?? "Weekly attendance"}
          </h3>
          {data?.subtitle ? (
            <p className="text-muted-foreground text-xs">{data.subtitle}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="h-[355px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8} barSize={14}>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#F4F4F4"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#000000", fontWeight: 500, fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  domain={[0, yMax]}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#000000", fontWeight: 500, fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={42}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                />
                <Bar
                  dataKey="morning"
                  fill="#FABE12"
                  name="Morning"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="afternoon"
                  fill="#F97316"
                  name="Afternoon"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="evening"
                  fill="#7E52FF"
                  name="Evening"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
