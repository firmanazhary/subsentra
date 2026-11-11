"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import { useSubscriptions } from "@/context/subscription-context";
import { useI18n } from "@/context/i18n-context";
import {
  getCategoryBreakdown,
  getSmartRecommendations,
  getSpendingInsights,
} from "@/lib/insights";

export default function InsightsPage() {
  const { selected, cancelledIds, isLoaded } = useSubscriptions();
  const { t, formatPrice } = useI18n();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F4] p-10 text-gray-900 transition-colors dark:bg-[#101713] dark:text-white">
        {t("insights.loading")}
      </div>
    );
  }

  const insights = getSpendingInsights(selected, cancelledIds, formatPrice, t);
  const categories = getCategoryBreakdown(
    selected.filter(
      (item) => !cancelledIds.includes(item.subscriptionId)
    )
  );
  const recommendations = getSmartRecommendations(
    selected,
    cancelledIds,
    formatPrice,
    t
  );

  const categoryColors = [
    "bg-[#3B871D] dark:bg-[#B8F27C]",
    "bg-sky-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-yellow-500",
  ];

  return (
    <main className="min-h-screen bg-[#F4F6F4] text-gray-900 transition-colors duration-200 dark:bg-[#101713] dark:text-white">
      <Sidebar />

      <div className="ml-0 min-w-0 p-4 pt-20 sm:p-6 sm:pt-22 lg:ml-64 lg:p-8 lg:pt-8 transition-all">
        <Link
          href="/"
          className="mb-4 sm:mb-5 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-[#2F7317] dark:text-gray-400 dark:hover:text-[#B8F27C]"
        >
          <ArrowLeft size={16} />
          {t("insights.back")}
        </Link>

        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm font-semibold text-[#2F7317] dark:text-[#B8F27C]">
            {t("insights.badge")}
          </p>
          <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("insights.title")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t("insights.subtitle")}
          </p>
        </div>

        {/* Key insights: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {insights.map((insight, index) => {
            const Icon =
              index === 0
                ? AlertTriangle
                : index === 1
                  ? Wallet
                  : TrendingUp;

            return (
              <div
                key={insight.title}
                className={`rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720] ${
                  index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black/5 text-[#2F7317] dark:bg-[#B8F27C]/10 dark:text-[#B8F27C]">
                  <Icon size={22} />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {insight.title}
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {insight.value}
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-500">
                  {insight.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Category breakdown */}
        <section className="mt-6 sm:mt-8 rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {t("insights.spendingByCategory")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("insights.spendingByCategoryDesc")}
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="py-8 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
              {t("insights.emptyCategory")}
            </p>
          ) : (
            <>
              <div className="mb-6 flex h-3 sm:h-4 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                {categories.map((category, index) => (
                  <div
                    key={category.category}
                    className={categoryColors[index % categoryColors.length]}
                    style={{ width: `${category.percentage}%` }}
                    title={`${t(`cat.${category.category}`)}: ${category.percentage.toFixed(1)}%`}
                  />
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`h-3 w-3 shrink-0 rounded-full ${
                          categoryColors[index % categoryColors.length]
                        }`}
                      />
                      <span className="truncate text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {t(`cat.${category.category}`)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {category.percentage.toFixed(1)}%
                      </span>
                      <span className="w-16 sm:w-24 text-right text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPrice(category.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Recommendations */}
        <section className="mt-6 sm:mt-8 rounded-2xl border border-[#3B871D]/25 bg-[#B8F27C]/30 p-5 sm:p-6 shadow-xs transition dark:border-[#B8F27C]/20 dark:bg-[#1B2720]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-[#1F5410] dark:bg-[#B8F27C]/10 dark:text-[#B8F27C]">
              <Lightbulb size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {t("insights.smartRecs")}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t("insights.smartRecsDesc")}
              </p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <p className="py-6 text-xs sm:text-sm text-gray-500">
              {t("insights.noRecs")}
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recommendations.map((recommendation, index) => (
                <div
                  key={`${recommendation.title}-${index}`}
                  className="rounded-xl border border-black/10 bg-white p-4 sm:p-5 shadow-xs dark:border-white/10 dark:bg-[#101713]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="max-w-2xl">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                        {recommendation.title}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {recommendation.description}
                      </p>
                    </div>

                    {recommendation.potentialSavings > 0 && (
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {t("insights.potentialMonthly")}
                        </p>
                        <p className="mt-0.5 sm:mt-1 font-semibold text-sm sm:text-base text-[#1F5410] dark:text-[#B8F27C]">
                          {formatPrice(
                            recommendation.potentialSavings
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/savings"
            className="mt-6 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#B8F27C] px-5 py-3 text-sm font-semibold text-[#101713] shadow-xs transition hover:bg-[#c9ff8d]"
          >
            {t("insights.openSimulator")}
          </Link>
        </section>

        <p className="mt-6 text-[11px] sm:text-xs text-gray-500">
          {t("insights.disclaimer")}
        </p>
      </div>
    </main>
  );
}
