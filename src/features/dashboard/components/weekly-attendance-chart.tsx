import { Card } from "@/components/ui/card";
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

const data = [
  { day: "Mon", morning: 34, afternoon: 51, evening: 46 },
  { day: "Tue", morning: 42, afternoon: 47, evening: 53 },
  { day: "Wed", morning: 39, afternoon: 56, evening: 49 },
  { day: "Thu", morning: 46, afternoon: 44, evening: 58 },
  { day: "Fri", morning: 51, afternoon: 62, evening: 55 },
  { day: "Sat", morning: 57, afternoon: 68, evening: 64 },
  { day: "Sun", morning: 49, afternoon: 52, evening: 59 },
];

export function WeeklyAttendanceChart() {
  return (
    <Card className="border border-[#F4F4F4] p-0 shadow-none">
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-sm font-semibold text-[#3c3c3c]">
            Weekly attendance
          </h3>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="h-[355px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={8} barSize={14}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F4F4F4" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#000000", fontWeight: 500, fontSize: 10 }}
                  dy={10}
                />
                <YAxis
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
                <Bar dataKey="morning" fill="#FABE12" name="Morning" radius={[6, 6, 0, 0]} />
                <Bar dataKey="afternoon" fill="#F97316" name="Afternoon" radius={[6, 6, 0, 0]} />
                <Bar dataKey="evening" fill="#7E52FF" name="Evening" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}

