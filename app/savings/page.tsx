
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
import {
  calculateSavings,
  calculateRemainingSpending,
} from "@/lib/calculations";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export default function SavingsPage() {
  const {
    selected,
    cancelledIds,
    setCancelledIds,
    isLoaded,
  } = useSubscriptions();

  const [investmentRate, setInvestmentRate] = useState(8);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#101713] p-10 text-white">
        Loading savings simulator...
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
    <main className="min-h-screen bg-[#101713] text-white">
      <Sidebar />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#B8F27C]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <p className="text-sm font-medium text-[#B8F27C]">
            SMART SAVINGS
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Savings Simulator
          </h1>

          <p className="mt-2 text-gray-400">
            Find subscriptions you can live without and see how much
            you could save.
          </p>
        </div>

        {/* Savings summary */}
        <section className="grid grid-cols-3 gap-5">
          <div className="rounded-2xl border border-[#B8F27C]/20 bg-[#1B2720] p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#B8F27C]/10 text-[#B8F27C]">
              <PiggyBank size={22} />
            </div>
            <p className="text-sm text-gray-400">
              Potential Monthly Savings
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#B8F27C]">
              {formatPrice(monthlySavings)}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white">
              <CircleDollarSign size={22} />
            </div>
            <p className="text-sm text-gray-400">
              Potential Annual Savings
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {formatPrice(annualSavings)}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white">
              <TrendingUp size={22} />
            </div>
            <p className="text-sm text-gray-400">
              Spending After Cancellation
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {formatPrice(remainingSpending)}
            </h2>
          </div>
        </section>

        {/* Subscription selection */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#1B2720] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Review Your Subscriptions
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Select the subscriptions you are considering cancelling.
            </p>
          </div>

          {selected.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400">
                {"You haven't added any subscriptions yet."}
              </p>
              <Link
                href="/subscriptions"
                className="mt-4 inline-block rounded-xl bg-[#B8F27C] px-5 py-3 text-sm font-semibold text-[#101713] transition hover:bg-[#c9ff8d]"
              >
                Add Subscriptions
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
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                      isCancelled
                        ? "border-[#B8F27C]/40 bg-[#B8F27C]/10"
                        : "border-white/10 bg-[#101713] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 font-bold text-[#B8F27C]">
                        {sub.iconText}
                      </div>

                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {sub.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.actualMonthlyPrice)}
                        </p>
                        <p className="text-xs text-gray-500">/ month</p>
                      </div>

                      {isCancelled ? (
                        <CheckCircle2
                          className="text-[#B8F27C]"
                          size={22}
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selected.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <p className="text-sm text-gray-400">
                {cancelledIds.filter((id) =>
                  selected.some((item) => item.subscriptionId === id)
                ).length}{" "}
                subscription(s) selected for cancellation
              </p>

              <button
                type="button"
                onClick={() => setCancelledIds([])}
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Clear selection
              </button>
            </div>
          )}
        </section>

        {/* Investment projection */}
        <section className="mt-8 rounded-2xl border border-[#B8F27C]/20 bg-[#1B2720] p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-[#B8F27C]">
              WHAT IF YOU INVESTED IT?
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              Turn savings into future wealth
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Estimate what your monthly savings could grow into if
              invested consistently.
            </p>
          </div>

          <div className="mb-6 max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="investment-rate"
                className="text-sm text-gray-400"
              >
                Assumed annual return
              </label>
              <span className="font-semibold text-[#B8F27C]">
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
              className="w-full accent-[#B8F27C]"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>15%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {projections.map((years) => (
              <div
                key={years}
                className="rounded-xl border border-white/10 bg-[#101713] p-5"
              >
                <p className="text-sm text-gray-400">
                  After {years} {years === 1 ? "year" : "years"}
                </p>
                <p className="mt-3 text-2xl font-bold text-[#B8F27C]">
                  {formatPrice(calculateFutureValue(years))}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Estimated future value
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-gray-500">
            Illustrative estimate only. Assumes monthly contributions,
            monthly compounding, and a constant annual return. Actual
            investment returns are not guaranteed and may be negative.
            Taxes, fees, and inflation are not included.
          </p>
        </section>

        <p className="mt-6 text-xs leading-relaxed text-gray-500">
          This tool only estimates potential savings. It does not
          cancel subscriptions or contact service providers.
        </p>
      </div>
    </main>
  );
}
