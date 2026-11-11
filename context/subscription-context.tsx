
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { UserSubscription } from "@/types/subscription";

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
  const [selected, setSelected] = useState<UserSubscription[]>([]);
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("subsentry");

      if (saved) {
        const parsed = JSON.parse(saved);

        queueMicrotask(() => {
          // Support old format: an array of subscriptions
          if (Array.isArray(parsed)) {
            setSelected(parsed);
          } else {
            // New format: object containing subscriptions and cancellation choices
            if (Array.isArray(parsed.selected)) {
              setSelected(parsed.selected);
            }

            if (Array.isArray(parsed.cancelledIds)) {
              setCancelledIds(parsed.cancelledIds);
            }
          }
        });
      }
    } catch {
      localStorage.removeItem("subsentry");
    } finally {
      queueMicrotask(() => {
        setIsLoaded(true);
      });
    }
  }, []);

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
