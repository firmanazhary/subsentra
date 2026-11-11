"use client";

import {
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StatCard from "@/components/stat-card";
import SpendingChart from "@/components/spending-chart";
import SubscriptionList from "@/components/subscription-list";

import { useSubscriptions } from "@/context/subscription-context";

import {
  calculateMonthlySpending,
  calculateAnnualSpending,
  calculateSavings,
} from "@/lib/calculations";

export default function Home() {
  const { selected, cancelledIds, isLoaded } = useSubscriptions();

  const monthly = calculateMonthlySpending(selected);
  const annual = calculateAnnualSpending(selected);
  const potentialSavings = calculateSavings(selected, cancelledIds);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#101713] p-10 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101713]">
      <Sidebar />

      <div className="ml-64 p-8">
        <Header />

        {/* Overview Cards */}
        <section className="grid grid-cols-4 gap-5">
          <StatCard
            title="Monthly Spending"
            value={formatPrice(monthly)}
            description="Your recurring monthly costs"
            icon={DollarSign}
          />

          <StatCard
            title="Annual Spending"
            value={formatPrice(annual)}
            description="Projected yearly expenses"
            icon={CreditCard}
          />

          <StatCard
            title="Active Subscriptions"
            value={String(selected.length)}
            description="Currently tracking"
            icon={TrendingUp}
          />

          <StatCard
            title="Potential Savings"
            value={formatPrice(potentialSavings)}
            description="Monthly savings if selected subscriptions are cancelled"
            icon={PiggyBank}
          />
        </section>

        {/* Analytics */}
        <section className="mt-8 grid grid-cols-2 gap-5">
          <SpendingChart />
          <SubscriptionList />
        </section>

        {/* Savings Banner */}
        <section className="mt-8 rounded-2xl border border-[#B8F27C]/20 bg-[#B8F27C]/10 p-6">
          <p className="text-sm text-[#B8F27C]">
            Your money insight
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {"You're spending "}
            {formatPrice(annual)} every year.
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            {selected.length === 0
              ? "Start adding subscriptions to discover your spending."
              : "Review your subscriptions and find opportunities to save."}
          </p>
        </section>
      </div>
    </main>
  );
}
