
"use client";

import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/" },
  { name: "My Subscriptions", icon: CreditCard, href: "/subscriptions" },
  { name: "Savings Simulator", icon: TrendingUp, href: "/savings-simulator" },
  { name: "Investment Growth", icon: PiggyBank, href: "/investment-growth" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-[#111A14] p-5">
      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8F27C]">
          <Wallet className="text-[#142018]" size={22} />
        </div>

        <span className="text-xl font-bold text-white">
          Sub<span className="text-[#B8F27C]">Sentry</span>
        </span>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        Workspace
      </p>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-[#B8F27C] font-semibold text-[#142018]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
        <Settings size={19} />
        Settings
      </button>
    </aside>
  );
}
