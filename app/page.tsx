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
import { useI18n } from "@/context/i18n-context";

import {
  calculateMonthlySpending,
  calculateAnnualSpending,
  calculateSavings,
} from "@/lib/calculations";

export default function Home() {
  const { selected, cancelledIds, isLoaded } = useSubscriptions();
  const { t, formatPrice } = useI18n();

  const monthly = calculateMonthlySpending(selected);
  const annual = calculateAnnualSpending(selected);
  const potentialSavings = calculateSavings(selected, cancelledIds);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F4] p-10 text-gray-900 transition-colors dark:bg-[#101713] dark:text-white">
        {t("overview.loading")}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F4] text-gray-900 transition-colors duration-200 dark:bg-[#101713] dark:text-white">
      <Sidebar />

      {/* Main Content Area: Responsive margins and padding */}
      <div className="ml-0 min-w-0 p-4 pt-20 sm:p-6 sm:pt-22 lg:ml-64 lg:p-8 lg:pt-8 transition-all">
        <Header />

        {/* Overview Cards: 1 col on mobile, 2 col on tablet, 4 col on desktop */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <StatCard
            title={t("overview.monthlySpending")}
            value={formatPrice(monthly)}
            description={t("overview.monthlyDesc")}
            icon={DollarSign}
          />

          <StatCard
            title={t("overview.annualSpending")}
            value={formatPrice(annual)}
            description={t("overview.annualDesc")}
            icon={CreditCard}
          />

          <StatCard
            title={t("overview.activeSubs")}
            value={String(selected.length)}
            description={t("overview.activeDesc")}
            icon={TrendingUp}
          />

          <StatCard
            title={t("overview.potentialSavings")}
            value={formatPrice(potentialSavings)}
            description={t("overview.savingsDesc")}
            icon={PiggyBank}
          />
        </section>

        {/* Analytics: 1 col on mobile/tablet, 2 cols on desktop */}
        <section className="mt-6 sm:mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SpendingChart />
          <SubscriptionList />
        </section>

        {/* Savings Banner */}
        <section className="mt-6 sm:mt-8 rounded-2xl border border-[#3B871D]/25 bg-[#B8F27C]/30 p-5 sm:p-6 shadow-xs transition dark:border-[#B8F27C]/20 dark:bg-[#B8F27C]/10">
          <p className="text-xs sm:text-sm font-semibold text-[#1F5410] dark:text-[#B8F27C]">
            {t("overview.insight")}
          </p>

          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {t("overview.annualInsight", { amount: formatPrice(annual) })}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {selected.length === 0
              ? t("overview.insightEmpty")
              : t("overview.insightActive")}
          </p>
        </section>
      </div>
    </main>
  );
}
