"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import { subscriptions } from "@/data/subscriptions";
import { useSubscriptions } from "@/context/subscription-context";
import { useI18n } from "@/context/i18n-context";
import {
  calculateSavings,
  calculateRemainingSpending,
} from "@/lib/calculations";

export default function SavingsPage() {
  const {
    selected,
    cancelledIds,
    setCancelledIds,
    isLoaded,
  } = useSubscriptions();
  const { t, formatPrice } = useI18n();

  const [investmentRate, setInvestmentRate] = useState(8);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F4] p-10 text-gray-900 transition-colors dark:bg-[#101713] dark:text-white">
        {t("savings.loading")}
      </div>
    );
  }

  const monthlySavings = calculateSavings(selected, cancelledIds);
  const annualSavings = monthlySavings * 12;
  const remainingSpending = calculateRemainingSpending(
    selected,
    cancelledIds
  );

  const toggleCancellation = (subscriptionId: string) => {
    setCancelledIds((current) =>
      current.includes(subscriptionId)
        ? current.filter((id) => id !== subscriptionId)
        : [...current, subscriptionId]
    );
  };

  // Hypothetical future value if monthly savings are invested.
  const calculateFutureValue = (years: number) => {
    const monthlyRate = investmentRate / 100 / 12;
    const months = years * 12;

    if (monthlyRate === 0) {
      return monthlySavings * months;
    }

    return (
      monthlySavings *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    );
  };

  const projections = [1, 3, 5];

  return (
    <main className="min-h-screen bg-[#F4F6F4] text-gray-900 transition-colors duration-200 dark:bg-[#101713] dark:text-white">
      <Sidebar />

      <div className="ml-0 min-w-0 p-4 pt-20 sm:p-6 sm:pt-22 lg:ml-64 lg:p-8 lg:pt-8 transition-all">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="mb-4 sm:mb-5 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 transition hover:text-[#2F7317] dark:text-gray-400 dark:hover:text-[#B8F27C]"
          >
            <ArrowLeft size={16} />
            {t("savings.back")}
          </Link>

          <p className="text-xs sm:text-sm font-semibold text-[#2F7317] dark:text-[#B8F27C]">
            {t("savings.badge")}
          </p>

          <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("savings.title")}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t("savings.subtitle")}
          </p>
        </div>

        {/* Savings summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          <div className="rounded-2xl border border-[#3B871D]/25 bg-[#B8F27C]/30 p-5 sm:p-6 shadow-xs transition dark:border-[#B8F27C]/20 dark:bg-[#1B2720]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-[#1F5410] dark:bg-[#B8F27C]/10 dark:text-[#B8F27C]">
              <PiggyBank size={22} />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
              {t("savings.potentialMonthly")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#1C4E10] dark:text-[#B8F27C]">
              {formatPrice(monthlySavings)}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black/5 text-gray-800 dark:bg-white/5 dark:text-white">
              <CircleDollarSign size={22} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("savings.potentialAnnual")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(annualSavings)}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition sm:col-span-2 lg:col-span-1 dark:border-white/10 dark:bg-[#1B2720]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black/5 text-gray-800 dark:bg-white/5 dark:text-white">
              <TrendingUp size={22} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("savings.spendingAfter")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(remainingSpending)}
            </h2>
          </div>
        </section>

        {/* Subscription selection */}
        <section className="mt-6 sm:mt-8 rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {t("savings.reviewTitle")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("savings.reviewDesc")}
            </p>
          </div>

          {selected.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {t("savings.empty")}
              </p>
              <Link
                href="/subscriptions"
                className="mt-4 inline-block rounded-xl bg-[#B8F27C] px-5 py-3 text-sm font-semibold text-[#101713] shadow-xs transition hover:bg-[#c9ff8d]"
              >
                {t("savings.addBtn")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {selected.map((item) => {
                const sub = subscriptions.find(
                  (subscription) =>
                    subscription.id === item.subscriptionId
                );

                if (!sub) return null;

                const isCancelled = cancelledIds.includes(sub.id);

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleCancellation(sub.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 sm:p-4 text-left transition ${
                      isCancelled
                        ? "border-[#3B871D]/40 bg-[#B8F27C]/20 text-gray-900 dark:border-[#B8F27C]/40 dark:bg-[#B8F27C]/10 dark:text-white"
                        : "border-black/10 bg-black/[0.02] hover:border-black/20 dark:border-white/10 dark:bg-[#101713] dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-black/5 font-bold text-[#2F7317] dark:bg-white/5 dark:text-[#B8F27C]">
                        {sub.iconText}
                      </div>

                      <div>
                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{sub.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {t(`cat.${sub.category}`)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                      <div className="text-right">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          {formatPrice(item.actualMonthlyPrice)}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">/ month</p>
                      </div>

                      {isCancelled ? (
                        <CheckCircle2
                          className="text-[#2F7317] dark:text-[#B8F27C]"
                          size={20}
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-400 dark:border-gray-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selected.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4 sm:pt-5 dark:border-white/10">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {t("savings.selectedCount", {
                  count: cancelledIds.filter((id) =>
                    selected.some((item) => item.subscriptionId === id)
                  ).length,
                })}
              </p>

              <button
                type="button"
                onClick={() => setCancelledIds([])}
                className="text-xs sm:text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {t("savings.clearSelection")}
              </button>
            </div>
          )}
        </section>

        {/* Investment projection */}
        <section className="mt-6 sm:mt-8 rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-[#B8F27C]/20 dark:bg-[#1B2720]">
          <div className="mb-6">
            <p className="text-xs sm:text-sm font-semibold text-[#2F7317] dark:text-[#B8F27C]">
              {t("savings.investBadge")}
            </p>
            <h2 className="mt-1 sm:mt-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {t("savings.investTitle")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("savings.investDesc")}
            </p>
          </div>

          <div className="mb-6 max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="investment-rate"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
              >
                {t("savings.assumedReturn")}
              </label>
              <span className="font-semibold text-[#2F7317] dark:text-[#B8F27C]">
                {investmentRate}%
              </span>
            </div>

            <input
              id="investment-rate"
              type="range"
              min="0"
              max="15"
              step="1"
              value={investmentRate}
              onChange={(event) =>
                setInvestmentRate(Number(event.target.value))
              }
              className="w-full accent-[#2F7317] dark:accent-[#B8F27C]"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>15%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {projections.map((years) => (
              <div
                key={years}
                className="rounded-xl border border-black/10 bg-black/[0.02] p-4 sm:p-5 dark:border-white/10 dark:bg-[#101713]"
              >
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {years === 1
                    ? t("savings.afterYear", { years })
                    : t("savings.afterYears", { years })}
                </p>
                <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-[#2F7317] dark:text-[#B8F27C]">
                  {formatPrice(calculateFutureValue(years))}
                </p>
                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                  {t("savings.estimatedValue")}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11px] sm:text-xs leading-relaxed text-gray-500">
            {t("savings.disclaimer")}
          </p>
        </section>

        <p className="mt-6 text-[11px] sm:text-xs leading-relaxed text-gray-500">
          {t("savings.toolDisclaimer")}
        </p>
      </div>
    </main>
  );
}
