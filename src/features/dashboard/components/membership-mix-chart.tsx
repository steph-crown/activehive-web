import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type MembershipMixData = {
  name: "Weekly" | "Monthly" | "Quarterly" | "Yearly";
  value: number;
  color: string;
};

const data: MembershipMixData[] = [
  { name: "Weekly", value: 12, color: "#FDE68A" },
  { name: "Monthly", value: 46, color: "#FABE12" },
  { name: "Quarterly", value: 24, color: "#F59E0B" },
  { name: "Yearly", value: 18, color: "#B45309" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: MembershipMixData; name?: string; value?: number }>;
}

function CustomTooltip({ active, payload }: Readonly<CustomTooltipProps>) {
  if (active && payload && payload.length > 0) {
    const first = payload[0];
    const item = first.payload || {
      name: first.name as MembershipMixData["name"],
      value: Number(first.value || 0),
      color: "#FABE12",
    };

    return (
      <div className="bg-grey-900 space-y-1 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-semibold text-white">{item.name}</p>
        <p className="text-grey-400 text-xs">{item.value}%</p>
      </div>
    );
  }
  return null;
}

export function MembershipMixChart() {
  return (
    <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
      <div className="flex flex-col">
        <div className="border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-lg font-semibold text-[#3c3c3c]">Membership Mix</h3>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="h-[355px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.5;
                    const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                    const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                    const isWhite = value === 24 || value === 18;

                    return (
                      <text
                        x={x}
                        y={y}
                        fill={isWhite ? "#FFFFFF" : "#92400E"}
                        textAnchor={x > (cx || 0) ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={14}
                        fontWeight={500}
                      >
                        {`${value}%`}
                      </text>
                    );
                  }}
                  outerRadius={130}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
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
        </div>
      </div>
    </Card>
  );
}

