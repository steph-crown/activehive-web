import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "Jan", members: 420 },
  { month: "Feb", members: 458 },
  { month: "Mar", members: 441 },
  { month: "Apr", members: 506 },
  { month: "May", members: 497 },
  { month: "Jun", members: 566 },
  { month: "Jul", members: 548 },
  { month: "Aug", members: 624 },
  { month: "Sep", members: 609 },
  { month: "Oct", members: 692 },
  { month: "Nov", members: 671 },
  { month: "Dec", members: 748 },
];

export function RevenueChart() {
  return (
    <Card className="border border-[#F4F4F4] p-0 shadow-none">
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-sm font-semibold text-[#3c3c3c]">Member Growth</h3>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="h-[300px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="memberGrowthFill" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value} members`, "Members"]}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="#FABE12"
                  strokeWidth={2}
                  fill="url(#memberGrowthFill)"
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

