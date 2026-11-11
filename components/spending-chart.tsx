
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useSubscriptions } from "@/context/subscription-context";
import { calculateCategorySpending } from "@/lib/calculations";

export default function SpendingChart() {
  const { selected, isLoaded } = useSubscriptions();

  const categorySpending =
    calculateCategorySpending(selected);

  const data = Object.entries(categorySpending).map(
    ([category, spending]) => ({
      category,
      spending: Number(spending.toFixed(2)),
    })
  );

  if (!isLoaded) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
      <h3 className="text-lg font-semibold text-white">
        Spending by Category
      </h3>

      <p className="mb-6 text-sm text-gray-400">
        Monthly subscription distribution
      </p>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Add subscriptions to see your spending chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="category"
                stroke="#9AA89C"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                stroke="#9AA89C"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `$${value}`,
                  "Monthly spending",
                ]}
                contentStyle={{
                  backgroundColor: "#1B2720",
                  border: "1px solid #344338",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              <Bar
                dataKey="spending"
                fill="#B8F27C"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
