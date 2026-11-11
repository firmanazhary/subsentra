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
import { useTheme } from "@/context/theme-context";
import { useI18n } from "@/context/i18n-context";

export default function SpendingChart() {
  const { selected, isLoaded } = useSubscriptions();
  const { theme } = useTheme();
  const { t, formatPrice } = useI18n();

  const categorySpending = calculateCategorySpending(selected);

  const data = Object.entries(categorySpending).map(
    ([category, spending]) => ({
      category: t(`cat.${category}`),
      spending: Number(spending.toFixed(2)),
    })
  );

  if (!isLoaded) return null;

  const isDark = theme === "dark";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        {t("overview.spendingByCategory")}
      </h3>

      <p className="mb-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {t("overview.spendingByCategoryDesc")}
      </p>

      <div className="h-60 sm:h-64 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            {t("overview.emptyChart")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="category"
                stroke={isDark ? "#9AA89C" : "#6B7280"}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                stroke={isDark ? "#9AA89C" : "#6B7280"}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip
                formatter={(value) => [
                  formatPrice(Number(value)),
                  t("overview.monthlySpending"),
                ]}
                contentStyle={{
                  backgroundColor: isDark ? "#1B2720" : "#FFFFFF",
                  border: isDark ? "1px solid #344338" : "1px solid #E5E7EB",
                  borderRadius: "12px",
                  color: isDark ? "#FFFFFF" : "#111A14",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />

              <Bar
                dataKey="spending"
                fill={isDark ? "#B8F27C" : "#4AA823"}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
