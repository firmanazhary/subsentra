"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import {
  Search,
  Plus,
  Check,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from "lucide-react";
import { useSubscriptions } from "@/context/subscription-context";
import { useI18n } from "@/context/i18n-context";
import { subscriptions, findSubscription } from "@/data/subscriptions";
import { CURRENCY_CONFIGS } from "@/types/i18n";

type SortOption =
  | "default"
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc";

type RegionFilter = "ALL" | "GLOBAL" | "US" | "JP" | "ID";

export default function SubscriptionSelector() {
  const [tab, setTab] = useState<"catalog" | "selected">("catalog");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeRegion, setActiveRegion] = useState<RegionFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const catalogTopRef = useRef<HTMLDivElement>(null);

  const { selected, setSelected, isLoaded } = useSubscriptions();
  const { t, formatPrice, currency, convertFromUSD } = useI18n();

  // Extract all categories dynamically and sort by frequency
  const { categoryList, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    subscriptions.forEach((sub) => {
      const cat = sub.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return {
      categoryList: ["All", ...sorted],
      categoryCounts: counts,
    };
  }, []);

  const totalMonthly = selected.reduce(
    (total, item) => total + item.actualMonthlyPrice,
    0
  );

  const getSubRegionalMonthlyPrice = useCallback(
    (sub: (typeof subscriptions)[0]) => {
      const rawPrice =
        sub.prices?.[currency] ??
        (currency === "USD" ? sub.defaultPrice : convertFromUSD(sub.defaultPrice, currency));

      return sub.billingCycle === "yearly" ? rawPrice / 12 : rawPrice;
    },
    [currency, convertFromUSD]
  );

  // Filter and sort subscriptions
  const filteredSubscriptions = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = subscriptions.filter((sub) => {
      // Region filter
      if (activeRegion !== "ALL") {
        const subRegions = sub.regions || ["GLOBAL"];
        if (!subRegions.includes(activeRegion as "GLOBAL" | "US" | "JP" | "ID")) {
          return false;
        }
      }

      // Category filter
      if (activeCategory !== "All" && sub.category !== activeCategory) {
        return false;
      }

      // Search query (name, category, description)
      if (q) {
        const matchName = sub.name.toLowerCase().includes(q);
        const matchCat = sub.category.toLowerCase().includes(q);
        const matchDesc = sub.description.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === "name_asc") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "name_desc") {
      return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortBy === "price_asc") {
      return [...filtered].sort(
        (a, b) => getSubRegionalMonthlyPrice(a) - getSubRegionalMonthlyPrice(b)
      );
    }
    if (sortBy === "price_desc") {
      return [...filtered].sort(
        (a, b) => getSubRegionalMonthlyPrice(b) - getSubRegionalMonthlyPrice(a)
      );
    }

    return filtered;
  }, [search, activeCategory, activeRegion, sortBy, getSubRegionalMonthlyPrice]);

  // Pagination calculation
  const totalItems = filteredSubscriptions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedSubscriptions = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredSubscriptions.slice(start, start + pageSize);
  }, [filteredSubscriptions, safePage, pageSize]);

  const scrollToCatalogTop = () => {
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    scrollToCatalogTop();
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleRegionChange = (reg: RegionFilter) => {
    setActiveRegion(reg);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const addSubscription = (id: string) => {
    const exists = selected.some((item) => item.subscriptionId === id);
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
    setSelected((prev) => prev.filter((item) => item.subscriptionId !== id));
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

  // Pagination page numbers generator
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - delta && i <= safePage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (typeof i === "number" && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === "number" && i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      if (typeof i === "number") l = i;
    });

    return rangeWithDots;
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
    <div className="space-y-6 sm:space-y-8" ref={catalogTopRef}>
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

      {/* Summary Card */}
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

      {/* Main Tabs (Catalog vs Selected) */}
      <div className="flex border-b border-black/10 dark:border-white/10 gap-2 sm:gap-4">
        <button
          onClick={() => setTab("catalog")}
          className={`flex items-center gap-2 pb-3 text-sm sm:text-base font-semibold transition border-b-2 -mb-[2px] ${
            tab === "catalog"
              ? "border-[#2F7317] text-[#2F7317] dark:border-[#B8F27C] dark:text-[#B8F27C]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Layers size={18} />
          <span>{t("subs.tabBrowse")}</span>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
            {subscriptions.length}
          </span>
        </button>

        <button
          onClick={() => setTab("selected")}
          className={`flex items-center gap-2 pb-3 text-sm sm:text-base font-semibold transition border-b-2 -mb-[2px] ${
            tab === "selected"
              ? "border-[#2F7317] text-[#2F7317] dark:border-[#B8F27C] dark:text-[#B8F27C]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Sparkles size={18} />
          <span>{t("subs.tabSelected")}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold transition ${
              selected.length > 0
                ? "bg-[#B8F27C] text-[#142018]"
                : "bg-black/5 text-gray-600 dark:bg-white/10 dark:text-gray-300"
            }`}
          >
            {selected.length}
          </span>
        </button>
      </div>

      {/* TAB 1: CATALOG */}
      {tab === "catalog" && (
        <div className="space-y-5">
          {/* Quick Selected Alert when items are chosen */}
          {selected.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-[#3B871D]/20 bg-[#B8F27C]/15 p-3.5 sm:px-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                <span className="flex h-2 w-2 rounded-full bg-[#2F7317] dark:bg-[#B8F27C]" />
                <span>
                  <strong>{selected.length}</strong> {t("subs.selectedTitle")} · {t("subs.monthlySpending")}:{" "}
                  <strong>{formatPrice(totalMonthly)}</strong>
                </span>
              </div>
              <button
                onClick={() => setTab("selected")}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2F7317] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 dark:bg-[#B8F27C] dark:text-[#101713] self-start sm:self-auto"
              >
                {t("subs.viewSelected", { count: selected.length })} →
              </button>
            </div>
          )}

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: "ALL", label: t("subs.regionAll") },
              { id: "GLOBAL", label: `🌐 ${t("subs.regionGlobal")}` },
              { id: "US", label: `🇺🇸 ${t("subs.regionUS")}` },
              { id: "JP", label: `🇯🇵 ${t("subs.regionJP")}` },
              { id: "ID", label: `🇮🇩 ${t("subs.regionID")}` },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => handleRegionChange(reg.id as RegionFilter)}
                className={`rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition ${
                  activeRegion === reg.id
                    ? "bg-[#2F7317] text-white shadow-xs dark:bg-[#B8F27C] dark:text-[#101713]"
                    : "border border-black/10 bg-white text-gray-600 hover:bg-black/5 dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Search, Sort, and Page Size Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input with Clear Button */}
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("subs.searchPlaceholder")}
                className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-10 text-xs sm:text-sm text-gray-900 shadow-xs outline-none transition focus:border-[#2F7317] dark:border-white/10 dark:bg-[#1B2720] dark:text-white dark:focus:border-[#B8F27C]"
              />
              {search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
                  title={t("subs.clearSearch")}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort & Per Page Selector */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <SlidersHorizontal
                  size={14}
                  className="pointer-events-none absolute left-3 text-gray-400"
                />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="rounded-xl border border-black/10 bg-white py-3 pl-8 pr-8 text-xs sm:text-sm text-gray-800 shadow-xs outline-none transition focus:border-[#2F7317] dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-200 dark:focus:border-[#B8F27C]"
                >
                  <option value="default">{t("subs.sortDefault")}</option>
                  <option value="name_asc">{t("subs.sortNameAsc")}</option>
                  <option value="name_desc">{t("subs.sortNameDesc")}</option>
                  <option value="price_asc">{t("subs.sortPriceAsc")}</option>
                  <option value="price_desc">{t("subs.sortPriceDesc")}</option>
                </select>
              </div>

              {/* Per Page */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-black/10 bg-white py-3 px-3 text-xs sm:text-sm text-gray-800 shadow-xs outline-none transition focus:border-[#2F7317] dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-200 dark:focus:border-[#B8F27C]"
                title={t("subs.itemsPerPage")}
              >
                <option value={12}>12 / page</option>
                <option value={24}>24 / page</option>
                <option value={48}>48 / page</option>
              </select>
            </div>
          </div>

          {/* Categories: Horizontal Scrollable Chips with category count */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
            {categoryList.map((category) => {
              const count =
                category === "All"
                  ? subscriptions.length
                  : categoryCounts[category] || 0;
              const isCatActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm transition flex items-center gap-1.5 ${
                    isCatActive
                      ? "bg-[#B8F27C] font-semibold text-[#142018] shadow-xs"
                      : "border border-black/10 bg-white text-gray-600 hover:bg-black/5 dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-400 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{t(`cat.${category}`)}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isCatActive
                        ? "bg-[#142018]/15 text-[#142018]"
                        : "bg-black/5 text-gray-500 dark:bg-white/10 dark:text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result Count Status Bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
            <p>
              {totalItems > 0
                ? t("subs.showingResults", {
                    start: (safePage - 1) * pageSize + 1,
                    end: Math.min(safePage * pageSize, totalItems),
                    total: totalItems,
                  })
                : t("subs.noResults")}
            </p>
            {totalPages > 1 && (
              <p>
                {t("subs.page", { current: safePage, total: totalPages })}
              </p>
            )}
          </div>

          {/* Subscriptions Grid (Paginated 12 / 24 / 48) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedSubscriptions.map((sub) => {
              const isSelected = selected.some(
                (item) => item.subscriptionId === sub.id
              );
              const monthlyPrice = getSubRegionalMonthlyPrice(sub);

              return (
                <div
                  key={sub.id}
                  className={`rounded-2xl border bg-white p-5 shadow-xs transition hover:border-[#2F7317]/50 dark:border-white/10 dark:bg-[#1B2720] dark:hover:border-[#B8F27C]/40 ${
                    isSelected
                      ? "border-[#2F7317]/40 dark:border-[#B8F27C]/40 ring-1 ring-[#2F7317]/20 dark:ring-[#B8F27C]/20"
                      : "border-black/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-black/5 font-bold text-[#2F7317] dark:bg-white/5 dark:text-[#B8F27C]">
                      {sub.iconText}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {sub.regions && sub.regions.length > 0 && (
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-white/5 dark:text-gray-400">
                          {sub.regions[0] === "GLOBAL" ? "GLOBAL" : sub.regions[0]}
                        </span>
                      )}
                      <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] sm:text-xs text-gray-600 dark:bg-white/5 dark:text-gray-400">
                        {t(`cat.${sub.category}`)}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {sub.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 h-8">
                    {sub.description}
                  </p>

                  <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/5">
                    <div>
                      <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(monthlyPrice)}
                        <span className="text-xs text-gray-500 font-normal">
                          {t("subs.perMonth")}
                        </span>
                      </p>

                      <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[150px]">
                        {sub.defaultPlan}
                      </p>
                    </div>

                    <button
                      onClick={() => addSubscription(sub.id)}
                      disabled={isSelected}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
                        isSelected
                          ? "bg-[#2F7317]/10 text-[#2F7317] dark:bg-[#B8F27C]/10 dark:text-[#B8F27C]"
                          : "bg-[#B8F27C] text-[#142018] hover:opacity-90 shadow-xs cursor-pointer"
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

          {/* No results notice */}
          {filteredSubscriptions.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("subs.noResults")}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setActiveRegion("ALL");
                  setCurrentPage(1);
                }}
                className="mt-3 text-xs font-semibold text-[#2F7317] hover:underline dark:text-[#B8F27C]"
              >
                {t("subs.clearSearch")}
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-black/5 pt-6 dark:border-white/5">
              <button
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
                className="flex items-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-xs transition hover:bg-black/5 disabled:opacity-40 disabled:pointer-events-none dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-300 dark:hover:bg-white/5"
              >
                <ChevronLeft size={16} />
                <span>{t("subs.prev")}</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) => {
                  if (pageNum === "...") {
                    return (
                      <span
                        key={`dots-${idx}`}
                        className="px-2 text-xs text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  const isCurrent = pageNum === safePage;

                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => handlePageChange(Number(pageNum))}
                      className={`h-9 w-9 rounded-xl text-xs sm:text-sm font-semibold transition ${
                        isCurrent
                          ? "bg-[#2F7317] text-white shadow-xs dark:bg-[#B8F27C] dark:text-[#101713]"
                          : "border border-black/10 bg-white text-gray-700 hover:bg-black/5 dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-300 dark:hover:bg-white/5"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                disabled={safePage === totalPages}
                className="flex items-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-xs transition hover:bg-black/5 disabled:opacity-40 disabled:pointer-events-none dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-300 dark:hover:bg-white/5"
              >
                <span>{t("subs.next")}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SELECTED SUBSCRIPTIONS */}
      {tab === "selected" && (
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {t("subs.selectedTitle")} ({selected.length})
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {t("subs.selectedSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {selected.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm(t("subs.confirmClearAll") || "Remove all selected subscriptions?")) {
                      setSelected([]);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                >
                  <Trash2 size={15} />
                  <span>{t("subs.clearAll")}</span>
                </button>
              )}

              <button
                onClick={() => setTab("catalog")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-xs hover:bg-black/5 dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
              >
                + {t("subs.tabBrowse")}
              </button>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {selected.map((item) => {
              const sub = findSubscription(item.subscriptionId);
              const displayName = sub ? sub.name : item.subscriptionId;
              const displayPlan = sub ? sub.defaultPlan : "Custom / Legacy";
              const displayCategory = sub ? sub.category : "Other";
              const iconText = sub ? sub.iconText : displayName.charAt(0).toUpperCase();

              return (
                <div
                  key={item.subscriptionId}
                  className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-black/5 pb-3 sm:pb-4 last:border-0 dark:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 font-bold text-[#2F7317] dark:bg-white/5 dark:text-[#B8F27C]">
                      {iconText}
                    </div>
                    <div>
                      <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                        {displayName}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {displayPlan} · {t(`cat.${displayCategory}`)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex items-center rounded-xl border border-black/10 bg-black/[0.03] px-2.5 sm:px-3 dark:border-white/10 dark:bg-[#101713]">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
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
                        className="w-24 sm:w-28 bg-transparent p-1.5 sm:p-2 text-right text-xs sm:text-sm text-gray-900 font-bold outline-none dark:text-white"
                      />

                      <span className="text-[10px] sm:text-xs text-gray-500">
                        {t("subs.perMonth")}
                      </span>
                    </div>

                    <button
                      onClick={() => removeSubscription(item.subscriptionId)}
                      className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-500/10 hover:text-red-500"
                      aria-label={`Remove ${displayName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {selected.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                  {t("subs.noSelected")}
                </p>
                <button
                  onClick={() => setTab("catalog")}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#B8F27C] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#142018] shadow-xs hover:opacity-90"
                >
                  + {t("subs.tabBrowse")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
