
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
import { findSubscription } from "@/data/subscriptions";

type SubscriptionContextType = {
  selected: UserSubscription[];
  setSelected: Dispatch<SetStateAction<UserSubscription[]>>;
  cancelledIds: string[];
  setCancelledIds: Dispatch<SetStateAction<string[]>>;
  isLoaded: boolean;
};

const SubscriptionContext =
  createContext<SubscriptionContextType | undefined>(undefined);

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

  // Load data from LocalStorage and sanitize / auto-migrate any outdated IDs
  useEffect(() => {
    try {
      const saved = localStorage.getItem("subsentry");

      if (saved) {
        const parsed = JSON.parse(saved);

        const sanitizeList = (list: UserSubscription[]) => {
          return list.map((item) => {
            const found = findSubscription(item.subscriptionId);
            return found ? { ...item, subscriptionId: found.id } : item;
          });
        };

        queueMicrotask(() => {
          if (Array.isArray(parsed)) {
            setSelected(sanitizeList(parsed));
          } else {
            if (Array.isArray(parsed.selected)) {
              setSelected(sanitizeList(parsed.selected));
            }
            if (Array.isArray(parsed.cancelledIds)) {
              setCancelledIds(parsed.cancelledIds);
            }
          }
        });
      } else {
        // Clean default: 0 subscriptions on fresh start
        queueMicrotask(() => {
          setSelected([]);
          setCancelledIds([]);
        });
      }
    } catch {
      localStorage.removeItem("subsentry");
      queueMicrotask(() => {
        setSelected([]);
        setCancelledIds([]);
      });
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
          const sub = findSubscription(item.subscriptionId);
          if (!sub) return item;
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
