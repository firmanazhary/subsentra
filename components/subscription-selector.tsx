"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Check, Trash2 } from "lucide-react";
import { useSubscriptions } from "@/context/subscription-context";
import { useI18n } from "@/context/i18n-context";
import { subscriptions } from "@/data/subscriptions";
import { CURRENCY_CONFIGS } from "@/types/i18n";

const categories = [
  "All",
  "Streaming",
  "Music",
  "AI Tools",
  "Cloud Storage",
  "Fitness",
  "Food Delivery",
  "Shopping",
];

export default function SubscriptionSelector() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { selected, setSelected, isLoaded } = useSubscriptions();
  const { t, formatPrice, currency, convertFromUSD } = useI18n();

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = sub.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        sub.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const totalMonthly = selected.reduce(
    (total, item) => total + item.actualMonthlyPrice,
    0
  );

  const getSubRegionalMonthlyPrice = (sub: (typeof subscriptions)[0]) => {
    const rawPrice =
      sub.prices?.[currency] ??
      (currency === "USD" ? sub.defaultPrice : convertFromUSD(sub.defaultPrice, currency));

    return sub.billingCycle === "yearly" ? rawPrice / 12 : rawPrice;
  };

  const addSubscription = (id: string) => {
    const exists = selected.some(
      (item) => item.subscriptionId === id
    );

    if (exists) return;

    const sub = subscriptions.find((item) => item.id === id);
    if (!sub) return;

    const regionalPrice = getSubRegionalMonthlyPrice(sub);

    setSelected((prev) => [
      ...prev,
      {
        subscriptionId: id,
        actualMonthlyPrice: regionalPrice,
        currency,
      },
    ]);
  };

  const removeSubscription = (id: string) => {
    setSelected((prev) =>
      prev.filter((item) => item.subscriptionId !== id)
    );
  };

  const updatePrice = (id: string, price: number) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.subscriptionId === id
          ? { ...item, actualMonthlyPrice: price }
          : item
      )
    );
  };

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        {t("subs.loading")}
      </div>
    );
  }

  const curSymbol = CURRENCY_CONFIGS[currency].symbol;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-xs sm:text-sm font-semibold text-[#2F7317] dark:text-[#B8F27C]">
          {t("subs.badge")}
        </p>

        <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t("subs.title")}
        </h1>

        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {t("subs.subtitle")}
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-[#3B871D]/25 bg-[#B8F27C]/30 p-5 sm:p-6 shadow-xs transition dark:border-[#B8F27C]/20 dark:bg-[#B8F27C]/10">
        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          {t("subs.monthlySpending")}
        </p>

        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1C4E10] dark:text-[#B8F27C]">
          {formatPrice(totalMonthly)}
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {t("subs.activeSummary", {
            count: selected.length,
            annual: formatPrice(totalMonthly * 12),
          })}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("subs.searchPlaceholder")}
          className="w-full rounded-xl border border-black/10 bg-white py-3.5 pl-11 pr-4 text-xs sm:text-sm text-gray-900 shadow-xs outline-none transition focus:border-[#2F7317] dark:border-white/10 dark:bg-[#1B2720] dark:text-white dark:focus:border-[#B8F27C]"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm transition ${
              activeCategory === category
                ? "bg-[#B8F27C] font-semibold text-[#142018] shadow-xs"
                : "border border-black/10 bg-white text-gray-600 hover:bg-black/5 dark:border-white/10 dark:bg-transparent dark:text-gray-400 dark:hover:bg-white/5"
            }`}
          >
            {t(`cat.${category}`)}
          </button>
        ))}
      </div>

      {/* Catalog */}
      <div>
        <h2 className="mb-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {t("subs.popular")}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubscriptions.map((sub) => {
            const isSelected = selected.some(
              (item) => item.subscriptionId === sub.id
            );
            const monthlyPrice = getSubRegionalMonthlyPrice(sub);

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs transition hover:border-[#2F7317]/50 dark:border-white/10 dark:bg-[#1B2720] dark:hover:border-[#B8F27C]/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-black/5 font-bold text-[#2F7317] dark:bg-white/5 dark:text-[#B8F27C]">
                    {sub.iconText}
                  </div>

                  <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] sm:text-xs text-gray-600 dark:bg-white/5 dark:text-gray-400">
                    {t(`cat.${sub.category}`)}
                  </span>
                </div>

                <h3 className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                  {sub.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {sub.description}
                </p>

                <div className="mt-4 sm:mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(monthlyPrice)}
                      <span className="text-xs text-gray-500">
                        {t("subs.perMonth")}
                      </span>
                    </p>

                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {sub.defaultPlan} · {t("subs.referencePrice")}
                    </p>
                  </div>

                  <button
                    onClick={() => addSubscription(sub.id)}
                    disabled={isSelected}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
                      isSelected
                        ? "bg-[#2F7317]/10 text-[#2F7317] dark:bg-[#B8F27C]/10 dark:text-[#B8F27C]"
                        : "bg-[#B8F27C] text-[#142018] hover:opacity-90 shadow-xs"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={15} />
                        {t("subs.added")}
                      </>
                    ) : (
                      <>
                        <Plus size={15} />
                        {t("subs.add")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubscriptions.length === 0 && (
          <p className="py-10 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {t("subs.noResults")}
          </p>
        )}
      </div>

      {/* Selected Subscriptions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {t("subs.selectedTitle")} ({selected.length})
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {t("subs.selectedSubtitle")}
        </p>

        <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
          {selected.map((item) => {
            const sub = subscriptions.find(
              (s) => s.id === item.subscriptionId
            );

            if (!sub) return null;

            return (
              <div
                key={item.subscriptionId}
                className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-black/5 pb-3 sm:pb-4 last:border-0 dark:border-white/5"
              >
                <div>
                  <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                    {sub.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {sub.defaultPlan}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex items-center rounded-lg border border-black/10 bg-black/[0.03] px-2.5 sm:px-3 dark:border-white/10 dark:bg-[#101713]">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {curSymbol}
                    </span>

                    <input
                      type="number"
                      min="0"
                      step={CURRENCY_CONFIGS[currency].hasDecimals ? "0.01" : "1"}
                      value={item.actualMonthlyPrice}
                      onChange={(e) =>
                        updatePrice(
                          item.subscriptionId,
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      className="w-24 sm:w-28 bg-transparent p-1.5 sm:p-2 text-right text-xs sm:text-sm text-gray-900 outline-none dark:text-white"
                    />

                    <span className="text-[10px] sm:text-xs text-gray-500">
                      /mo
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      removeSubscription(item.subscriptionId)
                    }
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-500"
                    aria-label={`Remove ${sub.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {selected.length === 0 && (
            <p className="py-8 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
              {t("subs.noSelected")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
