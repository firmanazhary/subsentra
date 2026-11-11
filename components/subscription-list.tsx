
"use client";

import { ArrowUpRight } from "lucide-react";
import { subscriptions } from "@/data/subscriptions";
import { useSubscriptions } from "@/context/subscription-context";

export default function SubscriptionList() {
  const { selected, isLoaded } = useSubscriptions();

  if (!isLoaded) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Active Subscriptions
          </h3>
          <p className="text-sm text-gray-400">
            Your recurring payments
          </p>
        </div>

        <a
          href="/subscriptions"
          className="flex items-center gap-1 text-sm text-[#B8F27C]"
        >
          Manage <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="space-y-4">
        {selected.map((item) => {
          const sub = subscriptions.find(
            (s) => s.id === item.subscriptionId
          );

          if (!sub) return null;

          return (
            <div
              key={sub.id}
              className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 font-bold text-[#B8F27C]">
                  {sub.iconText}
                </div>

                <div>
                  <p className="font-medium text-white">
                    {sub.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {sub.category}
                  </p>
                </div>
              </div>

              <p className="font-semibold text-white">
                {formatPrice(item.actualMonthlyPrice)}
                <span className="text-xs text-gray-500">
                  /mo
                </span>
              </p>
            </div>
          );
        })}

        {selected.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No subscriptions yet. Add your first subscription.
          </p>
        )}
      </div>
    </div>
  );
}
