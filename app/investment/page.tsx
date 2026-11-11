"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Info,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Sidebar from "@/components/sidebar";
import { useSubscriptions } from "@/context/subscription-context";
import { useTheme } from "@/context/theme-context";
import { useI18n } from "@/context/i18n-context";
import { calculateSavings } from "@/lib/calculations";
import {
  generateGrowthSeries,
  getFinalProjection,
} from "@/lib/investment";

export default function InvestmentPage() {
  const { selected, cancelledIds, isLoaded } = useSubscriptions();
  const { theme } = useTheme();
  const { t, formatPrice, currency } = useI18n();

  const [years, setYears] = useState(5);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [monthlyContribution, setMonthlyContribution] = useState<number | null>(
    null
  );

  const potentialSavings = calculateSavings(selected, cancelledIds);
  const contribution =
    monthlyContribution !== null ? monthlyContribution : potentialSavings;

  const chartData = generateGrowthSeries(
    contribution,
    annualReturn,
    years
  );
  const finalProjection = getFinalProjection(
    contribution,
    annualReturn,
    years
  );

  const periods = [1, 3, 5, 10, 15, 20];

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F4] p-10 text-gray-900 transition-colors dark:bg-[#101713] dark:text-white">
        {t("invest.loading")}
      </div>
    );
  }

  const isDark = theme === "dark";
  const isIDR = currency === "IDR";
  const isJPY = currency === "JPY";

  const defaultContributionBase = isIDR ? 2000000 : isJPY ? 20000 : 200;
  const step = isIDR ? 50000 : isJPY ? 500 : 5;
  const sliderMax = Math.max(
    defaultContributionBase,
    Math.ceil(Math.max(potentialSavings, contribution) / step) * step * 1.5
  );

  return (
    <main className="min-h-screen bg-[#F4F6F4] text-gray-900 transition-colors duration-200 dark:bg-[#101713] dark:text-white">
      <Sidebar />

      <div className="ml-0 min-w-0 p-4 pt-20 sm:p-6 sm:pt-22 lg:ml-64 lg:p-8 lg:pt-8 transition-all">
        <Link
          href="/"
          className="mb-4 sm:mb-5 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 transition hover:text-[#2F7317] dark:text-gray-400 dark:hover:text-[#B8F27C]"
        >
          <ArrowLeft size={16} />
          {t("invest.back")}
        </Link>

        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm font-semibold text-[#2F7317] dark:text-[#B8F27C]">
            {t("invest.badge")}
          </p>
          <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("invest.title")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm max-w-2xl text-gray-600 dark:text-gray-400">
            {t("invest.subtitle")}
          </p>
        </div>

        {/* Summary cards: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black/5 text-[#2F7317] dark:bg-white/5 dark:text-[#B8F27C]">
              <Wallet size={22} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("invest.monthlyContribution")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(contribution)}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black/5 text-[#2F7317] dark:bg-white/5 dark:text-[#B8F27C]">
              <PiggyBank size={22} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("invest.totalContributions")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(finalProjection.contributed)}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#3B871D]/25 bg-[#B8F27C]/30 p-5 sm:p-6 shadow-xs transition sm:col-span-2 lg:col-span-1 dark:border-[#B8F27C]/20 dark:bg-[#B8F27C]/10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-[#1F5410] dark:bg-[#B8F27C]/15 dark:text-[#B8F27C]">
              <TrendingUp size={22} />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
              {t("invest.estimatedValue")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#1C4E10] dark:text-[#B8F27C]">
              {formatPrice(finalProjection.investmentValue)}
            </h2>
          </div>
        </section>

        {/* Investment settings: 1 col on mobile, 2 col on desktop */}
        <section className="mt-6 sm:mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
            <div className="mb-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {t("invest.settingsTitle")}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {t("invest.settingsDesc")}
              </p>
            </div>

            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="monthly-contribution"
                  className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("invest.monthlyContribution")}
                </label>
                <span className="font-semibold text-sm sm:text-base text-[#2F7317] dark:text-[#B8F27C]">
                  {formatPrice(contribution)}
                </span>
              </div>

              <input
                id="monthly-contribution"
                type="range"
                min="0"
                max={sliderMax}
                step={step}
                value={contribution}
                onChange={(event) =>
                  setMonthlyContribution(Number(event.target.value))
                }
                className="w-full accent-[#2F7317] dark:accent-[#B8F27C]"
              />

              <div className="mt-2 flex justify-between text-[11px] sm:text-xs text-gray-500">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(sliderMax)}</span>
              </div>

              <button
                type="button"
                onClick={() => setMonthlyContribution(null)}
                className="mt-3 text-xs font-medium text-[#2F7317] hover:underline dark:text-[#B8F27C]"
              >
                {t("invest.resetSavings")}
              </button>

              {potentialSavings === 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  {t("invest.noSavingsHelp")}
                </p>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="annual-return"
                  className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("invest.assumedReturn")}
                </label>
                <span className="font-semibold text-sm sm:text-base text-[#2F7317] dark:text-[#B8F27C]">
                  {annualReturn}%
                </span>
              </div>

              <input
                id="annual-return"
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={annualReturn}
                onChange={(event) =>
                  setAnnualReturn(Number(event.target.value))
                }
                className="w-full accent-[#2F7317] dark:accent-[#B8F27C]"
              />

              <div className="mt-2 flex justify-between text-[11px] sm:text-xs text-gray-500">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {t("invest.durationTitle")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("invest.durationDesc")}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
              {periods.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setYears(period)}
                  className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-4 text-center transition ${
                    years === period
                      ? "border-[#2F7317] bg-[#B8F27C]/20 text-[#1F5410] dark:border-[#B8F27C] dark:bg-[#B8F27C]/10 dark:text-[#B8F27C]"
                      : "border-black/10 bg-black/[0.02] text-gray-600 hover:border-black/30 dark:border-white/10 dark:bg-[#101713] dark:text-gray-400 dark:hover:border-white/30"
                  }`}
                >
                  <span className="block text-xl sm:text-2xl font-bold">
                    {period}
                  </span>
                  <span className="text-[10px] sm:text-xs">
                    {period === 1 ? t("invest.year") : t("invest.years")}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-[#101713]">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {t("invest.estimatedProfit")}
              </p>
              <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-[#1C4E10] dark:text-[#B8F27C]">
                {formatPrice(finalProjection.profit)}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                {t("invest.profitDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* Growth chart */}
        <section className="mt-6 sm:mt-8 rounded-2xl border border-black/10 bg-white p-4 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {t("invest.chartTitle")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("invest.chartDesc")}
            </p>
          </div>

          <div className="h-72 sm:h-80 w-full overflow-x-auto">
            {contribution === 0 ? (
              <div className="flex h-full items-center justify-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                {t("invest.emptyChart")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    stroke={isDark ? "#344338" : "#E5E7EB"}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    stroke={isDark ? "#9AA89C" : "#6B7280"}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}y`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    stroke={isDark ? "#9AA89C" : "#6B7280"}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                      return String(value);
                    }}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatPrice(Number(value)),
                      name === "investmentValue"
                        ? t("invest.chartEstimatedValue")
                        : t("invest.chartTotalContributions"),
                    ]}
                    labelFormatter={(value) =>
                      t("invest.chartYearLabel", { year: String(value ?? "") })
                    }
                    contentStyle={{
                      backgroundColor: isDark ? "#101713" : "#FFFFFF",
                      border: isDark ? "1px solid #344338" : "1px solid #E5E7EB",
                      borderRadius: "12px",
                      color: isDark ? "#FFFFFF" : "#111A14",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="contributed"
                    name={t("invest.chartTotalContributions")}
                    fill={isDark ? "#60796A" : "#94A3B8"}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="investmentValue"
                    name={t("invest.chartEstimatedValue")}
                    stroke={isDark ? "#B8F27C" : "#2F7317"}
                    strokeWidth={3}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Explanation */}
        <section className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:p-5">
          <Info className="mt-0.5 sm:mt-1 shrink-0 text-sky-600 dark:text-sky-300" size={18} />
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
              {t("invest.understandingTitle")}
            </h3>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {t("invest.understandingDesc")}
            </p>
          </div>
        </section>

        <div className="mt-6">
          <Link
            href="/savings"
            className="text-xs sm:text-sm font-medium text-[#2F7317] hover:underline dark:text-[#B8F27C]"
          >
            {t("invest.reviewSavingsLink")}
          </Link>
        </div>
      </div>
    </main>
  );
}
