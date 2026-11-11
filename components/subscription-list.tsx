"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { subscriptions } from "@/data/subscriptions";
import { useSubscriptions } from "@/context/subscription-context";
import { useI18n } from "@/context/i18n-context";

export default function SubscriptionList() {
  const { selected, isLoaded } = useSubscriptions();
  const { t, formatPrice } = useI18n();

  if (!isLoaded) return null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {t("overview.activeListTitle")}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {t("overview.activeListDesc")}
          </p>
        </div>

        <Link
          href="/subscriptions"
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2F7317] transition hover:underline dark:text-[#B8F27C]"
        >
          {t("overview.manage")} <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {selected.map((item) => {
          const sub = subscriptions.find(
            (s) => s.id === item.subscriptionId
          );

          if (!sub) return null;

          return (
            <div
              key={sub.id}
              className="flex items-center justify-between border-b border-black/5 pb-3 sm:pb-4 last:border-0 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black/5 font-bold text-[#2F7317] dark:bg-white/5 dark:text-[#B8F27C]">
                  {sub.iconText}
                </div>

                <div>
                  <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                    {sub.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    {t(`cat.${sub.category}`)}
                  </p>
                </div>
              </div>

              <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                {formatPrice(item.actualMonthlyPrice)}
                <span className="text-[10px] sm:text-xs text-gray-500">
                  /mo
                </span>
              </p>
            </div>
          );
        })}

        {selected.length === 0 && (
          <p className="py-8 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            {t("overview.noSubs")}
          </p>
        )}
      </div>
    </div>
  );
}
