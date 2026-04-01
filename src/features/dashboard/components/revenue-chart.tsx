import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useRevenueTrendChartQuery,
  type GymOwnerAnalyticsDashboardParams,
} from "../services";

const formatNgn = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

type RevenueChartProps = {
  filters: GymOwnerAnalyticsDashboardParams;
};

export function RevenueChart({ filters }: Readonly<RevenueChartProps>) {
  const { data, isLoading, isError } = useRevenueTrendChartQuery(filters);

  const chartData = useMemo(
    () =>
      (data?.data ?? []).map((row) => ({
        month: row.monthShort,
        revenue: row.revenue,
      })),
    [data?.data],
  );

  const yMax =
    data?.max != null && data.max > 0
      ? data.max
      : Math.max(
          1,
          ...chartData.map((d) => d.revenue),
        );

  if (isLoading) {
    return (
      <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
            <Skeleton className="h-6 w-40" />
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
      <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
        <div className="flex flex-col">
          <div className="border-b border-[#F4F4F4] px-6 py-3">
            <h3 className="text-lg font-semibold text-[#3c3c3c]">
              Revenue trend
            </h3>
          </div>
          <div className="text-muted-foreground p-6 text-sm">
            Could not load revenue chart.
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
            {data?.title ?? "Revenue trend"}
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
              <BarChart data={chartData} barSize={18}>
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
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `₦${(v / 1_000_000).toFixed(1)}M`
                      : v >= 1000
                        ? `₦${(v / 1000).toFixed(0)}k`
                        : `₦${v}`
                  }
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
                    formatNgn(Number(value)),
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#FABE12"
                  name="Revenue"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
