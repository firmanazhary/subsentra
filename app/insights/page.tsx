
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
import {
  getCategoryBreakdown,
  getSmartRecommendations,
  getSpendingInsights,
} from "@/lib/insights";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export default function InsightsPage() {
  const { selected, cancelledIds, isLoaded } = useSubscriptions();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#101713] p-10 text-white">
        Loading insights...
      </div>
    );
  }

  const insights = getSpendingInsights(selected, cancelledIds);
  const categories = getCategoryBreakdown(
    selected.filter(
      (item) => !cancelledIds.includes(item.subscriptionId)
    )
  );
  const recommendations = getSmartRecommendations(
    selected,
    cancelledIds
  );

  const categoryColors = [
    "bg-[#B8F27C]",
    "bg-sky-400",
    "bg-purple-400",
    "bg-orange-400",
    "bg-pink-400",
    "bg-cyan-400",
    "bg-yellow-400",
  ];

  return (
    <main className="min-h-screen bg-[#101713] text-white">
      <Sidebar />

      <div className="ml-64 p-8">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#B8F27C]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-[#B8F27C]">
            YOUR MONEY, UNDERSTOOD
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Spending Insights
          </h1>
          <p className="mt-2 text-gray-400">
            Understand your recurring expenses and discover ways to
            spend smarter.
          </p>
        </div>

        {/* Key insights */}
        <section className="grid grid-cols-3 gap-5">
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
                className="rounded-2xl border border-white/10 bg-[#1B2720] p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#B8F27C]/10 text-[#B8F27C]">
                  <Icon size={22} />
                </div>
                <p className="text-sm text-gray-400">
                  {insight.title}
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {insight.value}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {insight.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Category breakdown */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#1B2720] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Spending by Category
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              See where your monthly subscription money goes.
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Add subscriptions to generate your category breakdown.
            </p>
          ) : (
            <>
              <div className="mb-6 flex h-4 w-full overflow-hidden rounded-full bg-white/5">
                {categories.map((category, index) => (
                  <div
                    key={category.category}
                    className={categoryColors[index % categoryColors.length]}
                    style={{ width: `${category.percentage}%` }}
                    title={`${category.category}: ${category.percentage.toFixed(1)}%`}
                  />
                ))}
              </div>

              <div className="space-y-4">
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
                      <span className="truncate text-sm">
                        {category.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-5">
                      <span className="text-sm text-gray-400">
                        {category.percentage.toFixed(1)}%
                      </span>
                      <span className="w-20 text-right text-sm font-semibold">
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
        <section className="mt-8 rounded-2xl border border-[#B8F27C]/20 bg-[#1B2720] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B8F27C]/10 text-[#B8F27C]">
              <Lightbulb size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Smart Recommendations
              </h2>
              <p className="text-sm text-gray-400">
                Suggestions based on your subscription patterns.
              </p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <p className="py-6 text-sm text-gray-500">
              No recommendations yet. Add subscriptions to unlock
              personalized insights.
            </p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div
                  key={`${recommendation.title}-${index}`}
                  className="rounded-xl border border-white/10 bg-[#101713] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <h3 className="font-semibold">
                        {recommendation.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">
                        {recommendation.description}
                      </p>
                    </div>

                    {recommendation.potentialSavings > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-gray-500">
                          Potential monthly savings
                        </p>
                        <p className="mt-1 font-semibold text-[#B8F27C]">
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
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#B8F27C] px-5 py-3 text-sm font-semibold text-[#101713] transition hover:bg-[#c9ff8d]"
          >
            Open Savings Simulator
          </Link>
        </section>

        <p className="mt-6 text-xs text-gray-500">
          Recommendations are generated from your saved subscription
          data using simple rules. They do not verify actual usage,
          account activity, or service cancellation terms.
        </p>
      </div>
    </main>
  );
}
