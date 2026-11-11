
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { UserSubscription } from "@/types/subscription";
import type { Currency } from "@/types/i18n";
import { useI18n } from "@/context/i18n-context";
import { subscriptions } from "@/data/subscriptions";

type SubscriptionContextType = {
  selected: UserSubscription[];
  setSelected: Dispatch<SetStateAction<UserSubscription[]>>;
  cancelledIds: string[];
  setCancelledIds: Dispatch<SetStateAction<string[]>>;
  isLoaded: boolean;
};

const SubscriptionContext =
  createContext<SubscriptionContextType | undefined>(undefined);

const DEFAULT_INITIAL_SUBS: { id: string; priceUSD: number }[] = [
  { id: "netflix", priceUSD: 19.99 },
  { id: "spotify", priceUSD: 12.99 },
  { id: "chatgpt", priceUSD: 20.0 },
  { id: "youtube-premium", priceUSD: 13.99 },
];

export function SubscriptionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { currency, convertFromUSD } = useI18n();
  const [selected, setSelected] = useState<UserSubscription[]>([]);
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const prevCurrencyRef = useRef<Currency | null>(null);

  // Load data from LocalStorage (or initialize with realistic defaults)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("subsentry");

      if (saved) {
        const parsed = JSON.parse(saved);

        queueMicrotask(() => {
          if (Array.isArray(parsed)) {
            setSelected(parsed);
          } else {
            if (Array.isArray(parsed.selected)) {
              setSelected(parsed.selected);
            }
            if (Array.isArray(parsed.cancelledIds)) {
              setCancelledIds(parsed.cancelledIds);
            }
          }
        });
      } else {
        // Initialize first-time users with popular subscriptions in current regional currency
        const initialSelected: UserSubscription[] = DEFAULT_INITIAL_SUBS.map((item) => {
          const sub = subscriptions.find((s) => s.id === item.id);
          const price =
            sub?.prices?.[currency] ??
            (currency === "USD" ? item.priceUSD : convertFromUSD(item.priceUSD, currency));
          return {
            subscriptionId: item.id,
            actualMonthlyPrice: price,
            currency,
          };
        });

        queueMicrotask(() => {
          setSelected(initialSelected);
        });
      }
    } catch {
      localStorage.removeItem("subsentry");
    } finally {
      queueMicrotask(() => {
        setIsLoaded(true);
      });
    }
  }, [currency, convertFromUSD]); // Initialize on mount

  // Auto-adapt selected subscription prices when currency switches
  useEffect(() => {
    if (!isLoaded) return;

    if (prevCurrencyRef.current === null) {
      prevCurrencyRef.current = currency;
      return;
    }

    if (prevCurrencyRef.current === currency) return;

    const prevCurr = prevCurrencyRef.current;
    prevCurrencyRef.current = currency;

    queueMicrotask(() => {
      setSelected((prevSelected) => {
        return prevSelected.map((item) => {
          const sub = subscriptions.find((s) => s.id === item.subscriptionId);
          if (!sub) return item;

          const fromCurr = item.currency || prevCurr;
          const toCurr = currency;

          if (fromCurr === toCurr) return item;

          // Official price in old currency
          const oldOfficial =
            sub.prices?.[fromCurr] ??
            (fromCurr === "USD" ? sub.defaultPrice : convertFromUSD(sub.defaultPrice, fromCurr));

          // Official price in new currency
          const newOfficial =
            sub.prices?.[toCurr] ??
            (toCurr === "USD" ? sub.defaultPrice : convertFromUSD(sub.defaultPrice, toCurr));

          const oldMonthly = sub.billingCycle === "yearly" ? oldOfficial / 12 : oldOfficial;
          const newMonthly = sub.billingCycle === "yearly" ? newOfficial / 12 : newOfficial;

          // Check if price was standard or user-customized
          const isStandard =
            Math.abs(item.actualMonthlyPrice - oldMonthly) < (fromCurr === "USD" ? 0.05 : 1);

          let updatedPrice: number;
          if (isStandard || oldMonthly === 0) {
            // Snap directly to the official regional nominal! (e.g. Netflix $19.99 -> ¥1,980 -> Rp 186.000)
            updatedPrice = newMonthly;
          } else {
            // Scale custom adjustments proportionally
            const ratio = item.actualMonthlyPrice / oldMonthly;
            const scaled = ratio * newMonthly;
            updatedPrice = toCurr === "USD" ? Number(scaled.toFixed(2)) : Math.round(scaled);
          }

          return {
            ...item,
            actualMonthlyPrice: updatedPrice,
            currency: toCurr,
          };
        });
      });
    });
  }, [currency, isLoaded, convertFromUSD]);

  // Save data after initial loading is complete
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "subsentry",
      JSON.stringify({
        selected,
        cancelledIds,
      })
    );
  }, [selected, cancelledIds, isLoaded]);

  return (
    <SubscriptionContext.Provider
      value={{
        selected,
        setSelected,
        cancelledIds,
        setCancelledIds,
        isLoaded,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error(
      "useSubscriptions must be used inside SubscriptionProvider"
    );
  }

  return context;
}
