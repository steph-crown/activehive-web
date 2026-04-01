import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useMemberGrowthChartQuery,
  type GymOwnerAnalyticsDashboardParams,
} from "../services";

type MembersChartProps = {
  filters: GymOwnerAnalyticsDashboardParams;
};

export function MembersChart({ filters }: Readonly<MembersChartProps>) {
  const { data, isLoading, isError } = useMemberGrowthChartQuery(filters);

  const chartData = useMemo(
    () =>
      (data?.data ?? []).map((row) => ({
        month: row.monthShort,
        members: row.count,
      })),
    [data?.data],
  );

  const yMax =
    data?.max != null && data.max > 0
      ? data.max
      : Math.max(1, ...chartData.map((d) => d.members));

  if (isLoading) {
    return (
      <Card className="border border-[#F4F4F4] p-0 shadow-none !rounded-md">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
            <Skeleton className="h-6 w-44" />
          </div>
          <div className="p-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border border-[#F4F4F4] p-0 shadow-none !rounded-md">
        <div className="flex flex-col">
          <div className="border-b border-[#F4F4F4] px-6 py-3">
            <h3 className="text-lg font-semibold text-[#3c3c3c]">
              Member growth
            </h3>
          </div>
          <div className="text-muted-foreground p-6 text-sm">
            Could not load member growth chart.
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-[#F4F4F4] p-0 shadow-none !rounded-md">
      <div className="flex flex-col">
        <div className="flex flex-col gap-0.5 border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-lg font-semibold text-[#3c3c3c]">
            {data?.title ?? "Member growth"}
          </h3>
          {(data?.subtitle || data?.period) && (
            <p className="text-muted-foreground text-xs">
              {[data?.subtitle, data?.period].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="h-[300px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="dashboardMemberGrowthFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FABE12" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FABE12" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#F4F4F4"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  domain={[0, yMax]}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `${Number(value).toLocaleString("en-US")} members`,
                    "Members",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="#FABE12"
                  strokeWidth={2}
                  fill="url(#dashboardMemberGrowthFill)"
                  name="Members"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
