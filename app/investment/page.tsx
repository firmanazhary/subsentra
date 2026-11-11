
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Wallet,
  PiggyBank,
  Info,
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
import { calculateSavings } from "@/lib/calculations";
import {
  calculateInvestmentGrowth,
  formatInvestmentCurrency,
} from "@/lib/investment";

const periods = [1, 3, 5, 10, 20];

export default function InvestmentPage() {
  const { selected, cancelledIds, isLoaded } = useSubscriptions();

  const potentialSavings = calculateSavings(selected, cancelledIds);

  const [monthlyContribution, setMonthlyContribution] =
    useState<number | null>(null);

  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(5);

  // Use potential savings as the initial monthly contribution.
  const contribution = monthlyContribution ?? potentialSavings;

  const projections = useMemo(
    () =>
      calculateInvestmentGrowth(
        contribution,
        annualReturn,
        years
      ),
    [contribution, annualReturn, years]
  );

  const finalProjection = projections[projections.length - 1];

  // Display one data point per year on the chart.
  const chartData = projections.filter(
    (point) => point.month % 12 === 0
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#101713] p-10 text-white">
        Loading investment simulator...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101713] text-white">
      <Sidebar />

      <div className="ml-64 p-8">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#B8F27C]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-[#B8F27C]">
            BUILD YOUR FUTURE
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Investment Growth
          </h1>
          <p className="mt-2 max-w-2xl text-gray-400">
            See what your subscription savings could become when
            invested consistently over time.
          </p>
        </div>

        {/* Summary cards */}
        <section className="grid grid-cols-3 gap-5">
          <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-[#B8F27C]">
              <Wallet size={22} />
            </div>
            <p className="text-sm text-gray-400">
              Monthly Contribution
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {formatInvestmentCurrency(contribution)}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-[#B8F27C]">
              <PiggyBank size={22} />
            </div>
            <p className="text-sm text-gray-400">
              Total Contributions
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {formatInvestmentCurrency(
                finalProjection.contributed
              )}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#B8F27C]/20 bg-[#B8F27C]/10 p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#B8F27C]/15 text-[#B8F27C]">
              <TrendingUp size={22} />
            </div>
            <p className="text-sm text-gray-400">
              Estimated Future Value
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#B8F27C]">
              {formatInvestmentCurrency(
                finalProjection.investmentValue
              )}
            </h2>
          </div>
        </section>

        {/* Investment settings */}
        <section className="mt-8 grid grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">
                Investment Settings
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Customize your monthly contribution and return assumption.
              </p>
            </div>

            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="monthly-contribution"
                  className="text-sm text-gray-300"
                >
                  Monthly contribution
                </label>
                <span className="font-semibold text-[#B8F27C]">
                  {formatInvestmentCurrency(contribution)}
                </span>
              </div>

              <input
                id="monthly-contribution"
                type="range"
                min="0"
                max={Math.max(
                  500,
                  Math.ceil(Math.max(potentialSavings, contribution) / 10) * 10
                )}
                step="5"
                value={contribution}
                onChange={(event) =>
                  setMonthlyContribution(Number(event.target.value))
                }
                className="w-full accent-[#B8F27C]"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>
                  {formatInvestmentCurrency(
                    Math.max(
                      500,
                      Math.ceil(
                        Math.max(potentialSavings, contribution) / 10
                      ) * 10
                    )
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMonthlyContribution(null)}
                className="mt-3 text-xs text-[#B8F27C] hover:underline"
              >
                Reset to potential subscription savings
              </button>

              {potentialSavings === 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  No cancellation savings selected yet. You can still
                  adjust the contribution manually.
                </p>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="annual-return"
                  className="text-sm text-gray-300"
                >
                  Assumed annual return
                </label>
                <span className="font-semibold text-[#B8F27C]">
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
                className="w-full accent-[#B8F27C]"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
            <h2 className="text-lg font-semibold">
              Investment Duration
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Choose how long you plan to invest.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {periods.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setYears(period)}
                  className={`rounded-xl border px-4 py-4 text-center transition ${
                    years === period
                      ? "border-[#B8F27C] bg-[#B8F27C]/10 text-[#B8F27C]"
                      : "border-white/10 bg-[#101713] text-gray-400 hover:border-white/30"
                  }`}
                >
                  <span className="block text-2xl font-bold">
                    {period}
                  </span>
                  <span className="text-xs">
                    {period === 1 ? "Year" : "Years"}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-[#101713] p-4">
              <p className="text-sm text-gray-400">
                Estimated investment profit
              </p>
              <p className="mt-2 text-2xl font-bold text-[#B8F27C]">
                {formatInvestmentCurrency(finalProjection.profit)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Future value minus total contributions.
              </p>
            </div>
          </div>
        </section>

        {/* Growth chart */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#1B2720] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Your Investment Projection
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Contributions compared with estimated investment value.
            </p>
          </div>

          <div className="h-80 w-full">
            {contribution === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Increase your monthly contribution to see the growth chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    stroke="#344338"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    stroke="#9AA89C"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}y`}
                  />
                  <YAxis
                    stroke="#9AA89C"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatInvestmentCurrency(Number(value)),
                      name === "investmentValue"
                        ? "Estimated value"
                        : "Contributions",
                    ]}
                    labelFormatter={(value) => `Year ${value}`}
                    contentStyle={{
                      backgroundColor: "#101713",
                      border: "1px solid #344338",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="contributed"
                    name="Total contributions"
                    fill="#60796A"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="investmentValue"
                    name="Estimated investment value"
                    stroke="#B8F27C"
                    strokeWidth={3}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Explanation */}
        <section className="mt-8 flex gap-4 rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5">
          <Info className="mt-1 shrink-0 text-sky-300" size={20} />
          <div>
            <h3 className="font-semibold">Understanding this projection</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              This calculator assumes a constant annual return converted
              into a monthly rate, with contributions made at the end of
              each month. Real investments fluctuate. Actual results can
              be higher or lower, including losses. Fees, taxes, and
              inflation are not included.
            </p>
          </div>
        </section>

        <div className="mt-6">
          <Link
            href="/savings"
            className="text-sm text-[#B8F27C] hover:underline"
          >
            Review your subscription savings →
          </Link>
        </div>
      </div>
    </main>
  );
}
