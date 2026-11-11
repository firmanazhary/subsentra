
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jun", spending: 120 },
  { month: "Jul", spending: 145 },
  { month: "Aug", spending: 132 },
  { month: "Sep", spending: 160 },
  { month: "Oct", spending: 148 },
  { month: "Nov", spending: 178 },
];

export default function SpendingChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Spending Overview
        </h3>

        <p className="text-sm text-gray-400">
          Your monthly subscription expenses
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              stroke="#9AA89C"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#9AA89C"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                backgroundColor: "#1B2720",
                border: "1px solid #344338",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value) => [`$${value}`, "Spending"]}
            />

            <Bar
              dataKey="spending"
              fill="#B8F27C"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
