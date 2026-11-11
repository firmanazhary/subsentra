
"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Check, Trash2 } from "lucide-react";
import { useSubscriptions } from "@/context/subscription-context";
import { subscriptions } from "@/data/subscriptions";

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

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export default function SubscriptionSelector() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { selected, setSelected, isLoaded } = useSubscriptions();

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

  const addSubscription = (id: string) => {
    const exists = selected.some(
      (item) => item.subscriptionId === id
    );

    if (exists) return;

    const sub = subscriptions.find((item) => item.id === id);

    if (!sub) return;

    setSelected((prev) => [
      ...prev,
      {
        subscriptionId: id,
        actualMonthlyPrice:
          sub.billingCycle === "yearly"
            ? sub.defaultPrice / 12
            : sub.defaultPrice,
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
    <div className="py-20 text-center text-gray-400">
      Loading your subscriptions...
    </div>
  );
}

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <p className="text-sm text-[#B8F27C]">
          SUBSCRIPTION MANAGER
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Manage your subscriptions
        </h1>

        <p className="mt-2 text-gray-400">
          Select the services you currently pay for.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-[#B8F27C]/20 bg-[#B8F27C]/10 p-6">
        <p className="text-sm text-gray-400">
          Your monthly subscription spending
        </p>

        <h2 className="mt-2 text-4xl font-bold text-[#B8F27C]">
          {formatPrice(totalMonthly)}
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          {selected.length} active subscriptions ·{" "}
          {formatPrice(totalMonthly * 12)} / year
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subscriptions..."
          className="w-full rounded-xl border border-white/10 bg-[#1B2720] py-4 pl-12 pr-4 text-white outline-none focus:border-[#B8F27C]"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeCategory === category
                ? "bg-[#B8F27C] font-semibold text-[#142018]"
                : "border border-white/10 text-gray-400 hover:bg-white/5"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Catalog */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Popular subscriptions
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubscriptions.map((sub) => {
            const isSelected = selected.some(
              (item) => item.subscriptionId === sub.id
            );

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-white/10 bg-[#1B2720] p-5 transition hover:border-[#B8F27C]/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 font-bold text-[#B8F27C]">
                    {sub.iconText}
                  </div>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                    {sub.category}
                  </span>
                </div>

                <h3 className="mt-4 font-semibold text-white">
                  {sub.name}
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {sub.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">
                      {formatPrice(
                        sub.billingCycle === "yearly"
                          ? sub.defaultPrice / 12
                          : sub.defaultPrice
                      )}
                      <span className="text-xs text-gray-500">
                        /mo
                      </span>
                    </p>

                    <p className="text-xs text-gray-500">
                      {sub.defaultPlan} · Reference price
                    </p>
                  </div>

                  <button
                    onClick={() => addSubscription(sub.id)}
                    disabled={isSelected}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      isSelected
                        ? "bg-[#B8F27C]/10 text-[#B8F27C]"
                        : "bg-[#B8F27C] text-[#142018] hover:opacity-90"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={16} />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubscriptions.length === 0 && (
          <p className="py-10 text-center text-gray-400">
            No subscriptions found.
          </p>
        )}
      </div>

      {/* Selected Subscriptions */}
      <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
        <h2 className="text-xl font-semibold text-white">
          Your selected subscriptions
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Adjust these prices to match your actual bills.
        </p>

        <div className="mt-6 space-y-4">
          {selected.map((item) => {
            const sub = subscriptions.find(
              (s) => s.id === item.subscriptionId
            );

            if (!sub) return null;

            return (
              <div
                key={item.subscriptionId}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {sub.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sub.defaultPlan}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-white/10 bg-[#101713] px-3">
                    <span className="text-gray-400">$</span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.actualMonthlyPrice}
                      onChange={(e) =>
                        updatePrice(
                          item.subscriptionId,
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      className="w-24 bg-transparent p-2 text-right text-white outline-none"
                    />

                    <span className="text-xs text-gray-500">
                      /mo
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      removeSubscription(item.subscriptionId)
                    }
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Remove ${sub.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {selected.length === 0 && (
            <p className="py-8 text-center text-gray-500">
              No subscriptions selected yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
