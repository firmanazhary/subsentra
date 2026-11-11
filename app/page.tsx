
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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#101713]">
      <Sidebar />

      <div className="ml-64 p-8">
        <Header />

        {/* Overview Cards */}
        <section className="grid grid-cols-4 gap-5">
          <StatCard
            title="Monthly Spending"
            value="$147.96"
            description="Your recurring monthly costs"
            icon={DollarSign}
          />

          <StatCard
            title="Annual Spending"
            value="$1,775.52"
            description="Projected yearly expenses"
            icon={CreditCard}
          />

          <StatCard
            title="Active Subscriptions"
            value="8"
            description="Currently tracking"
            icon={TrendingUp}
          />

          <StatCard
            title="Potential Savings"
            value="$45.00"
            description="Possible monthly savings"
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
            {"You're spending $1,775.52 every year."}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Small changes today can make a big difference
            to your financial future.
          </p>
        </section>
      </div>
    </main>
  );
}
