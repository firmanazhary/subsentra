
import { subscriptions } from "@/data/subscriptions";
import type { UserSubscription } from "@/types/subscription";

// Convert yearly prices into monthly equivalents
export function getMonthlyPrice(
  price: number,
  billingCycle: "monthly" | "yearly"
) {
  return billingCycle === "yearly"
    ? price / 12
    : price;
}

// Calculate total monthly spending
export function calculateMonthlySpending(
  selected: UserSubscription[]
) {
  return selected.reduce(
    (total, item) => total + item.actualMonthlyPrice,
    0
  );
}

// Calculate annual spending
export function calculateAnnualSpending(
  selected: UserSubscription[]
) {
  return calculateMonthlySpending(selected) * 12;
}

// Calculate potential savings
export function calculateSavings(
  selected: UserSubscription[],
  cancelledIds: string[]
) {
  return selected
    .filter((item) =>
      cancelledIds.includes(item.subscriptionId)
    )
    .reduce(
      (total, item) => total + item.actualMonthlyPrice,
      0
    );
}

// Calculate spending by category
export function calculateCategorySpending(
  selected: UserSubscription[]
) {
  const result: Record<string, number> = {};

  selected.forEach((item) => {
    const subscription = subscriptions.find(
      (sub) => sub.id === item.subscriptionId
    );

    if (!subscription) return;

    const category = subscription.category;

    result[category] =
      (result[category] || 0) + item.actualMonthlyPrice;
  });

  return result;
}

// Calculate spending after cancellation
export function calculateRemainingSpending(
  selected: UserSubscription[],
  cancelledIds: string[]
) {
  return selected
    .filter(
      (item) =>
        !cancelledIds.includes(item.subscriptionId)
    )
    .reduce(
      (total, item) => total + item.actualMonthlyPrice,
      0
    );
}
