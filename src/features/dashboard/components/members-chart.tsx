import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "Jan", revenue: 2.1 },
  { month: "Feb", revenue: 2.6 },
  { month: "Mar", revenue: 2.3 },
  { month: "Apr", revenue: 3.1 },
  { month: "May", revenue: 2.9 },
  { month: "Jun", revenue: 3.8 },
  { month: "Jul", revenue: 3.4 },
  { month: "Aug", revenue: 4.4 },
  { month: "Sep", revenue: 4.0 },
  { month: "Oct", revenue: 5.1 },
  { month: "Nov", revenue: 4.7 },
  { month: "Dec", revenue: 5.6 },
];

export function MembersChart() {
  return (
    <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-lg font-semibold text-[#3c3c3c]">Revenue</h3>
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`₦${value}m`, "Revenue"]}
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

