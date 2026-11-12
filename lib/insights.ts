
import { findSubscription } from "@/data/subscriptions";
import type { UserSubscription } from "@/types/subscription";

export type SpendingInsight = {
  title: string;
  description: string;
  value: string;
  type: "positive" | "warning" | "info";
};

export type SmartRecommendation = {
  title: string;
  description: string;
  potentialSavings: number;
  subscriptionId?: string;
};

const currency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export function getSubscriptionDetails(selected: UserSubscription[]) {
  return selected
    .map((item) => {
      const subscription = findSubscription(item.subscriptionId);

      return subscription
        ? { ...subscription, monthlyPrice: item.actualMonthlyPrice }
        : {
            id: item.subscriptionId,
            name: item.subscriptionId,
            category: "Other",
            description: "",
            defaultPlan: "Custom",
            defaultPrice: item.actualMonthlyPrice,
            billingCycle: "monthly" as const,
            iconText: item.subscriptionId.charAt(0).toUpperCase(),
            monthlyPrice: item.actualMonthlyPrice,
          };
    });
}

export function getTopSubscription(selected: UserSubscription[]) {
  const details = getSubscriptionDetails(selected);

  return [...details].sort(
    (a, b) => b.monthlyPrice - a.monthlyPrice
  )[0] ?? null;
}

export function getCategoryBreakdown(selected: UserSubscription[]) {
  const details = getSubscriptionDetails(selected);
  const totals: Record<string, number> = {};

  details.forEach((item) => {
    totals[item.category] =
      (totals[item.category] || 0) + item.monthlyPrice;
  });

  const totalSpending = details.reduce(
    (sum, item) => sum + item.monthlyPrice,
    0
  );

  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getSmartRecommendations(
  selected: UserSubscription[],
  cancelledIds: string[],
  formatPriceFn?: (amount: number) => string,
  tFn?: (key: string, params?: Record<string, string | number>) => string
): SmartRecommendation[] {
  const format = formatPriceFn || currency;
  const details = getSubscriptionDetails(selected);
  const active = details.filter(
    (item) => !cancelledIds.includes(item.id)
  );

  const recommendations: SmartRecommendation[] = [];

  // 1. Highlight the most expensive active subscription
  const mostExpensive = [...active].sort(
    (a, b) => b.monthlyPrice - a.monthlyPrice
  )[0];

  if (mostExpensive && mostExpensive.monthlyPrice > 0) {
    recommendations.push({
      title: tFn
        ? tFn("insights.recExpensiveTitle")
        : "Review your most expensive subscription",
      description: tFn
        ? tFn("insights.recExpensiveDesc", {
            name: mostExpensive.name,
            price: format(mostExpensive.monthlyPrice),
          })
        : `${mostExpensive.name} costs ${format(
            mostExpensive.monthlyPrice
          )} per month. Check whether you use it enough to justify the cost.`,
      potentialSavings: mostExpensive.monthlyPrice,
      subscriptionId: mostExpensive.id,
    });
  }

  // 2. Highlight categories that take a large share of spending
  const breakdown = getCategoryBreakdown(
    active.map((item) => ({
      subscriptionId: item.id,
      actualMonthlyPrice: item.monthlyPrice,
    }))
  );

  const topCategory = breakdown[0];

  if (topCategory && topCategory.percentage >= 40) {
    const catName = tFn
      ? tFn(`cat.${topCategory.category}`)
      : topCategory.category;
    recommendations.push({
      title: tFn
        ? tFn("insights.recConcentratedTitle")
        : "Your spending is concentrated in one category",
      description: tFn
        ? tFn("insights.recConcentratedDesc", {
            category: catName,
            percent: topCategory.percentage.toFixed(0),
          })
        : `${topCategory.category} accounts for ${topCategory.percentage.toFixed(
            0
          )}% of your active subscription spending. Review whether you need every service in this category.`,
      potentialSavings: 0,
    });
  }

  // 3. Identify multiple services in the same category
  const categoryGroups = new Map<string, typeof active>();

  active.forEach((item) => {
    const group = categoryGroups.get(item.category) || [];
    group.push(item);
    categoryGroups.set(item.category, group);
  });

  categoryGroups.forEach((items, category) => {
    if (items.length >= 2) {
      const catName = tFn ? tFn(`cat.${category}`) : category;
      recommendations.push({
        title: tFn
          ? tFn("insights.recOverlapTitle", { category: catName })
          : `Review overlapping ${category} services`,
        description: tFn
          ? tFn("insights.recOverlapDesc", {
              count: items.length,
              category: catName,
            })
          : `You have ${items.length} subscriptions in ${category}. Check whether their features overlap.`,
        potentialSavings: Math.min(
          ...items.map((item) => item.monthlyPrice)
        ),
      });
    }
  });

  // 4. Acknowledge services already marked for cancellation
  const plannedSavings = details
    .filter((item) => cancelledIds.includes(item.id))
    .reduce((sum, item) => sum + item.monthlyPrice, 0);

  if (plannedSavings > 0) {
    recommendations.push({
      title: tFn
        ? tFn("insights.recSavingsTitle")
        : "You have a savings plan in progress",
      description: tFn
        ? tFn("insights.recSavingsDesc", {
            monthly: format(plannedSavings),
            annual: format(plannedSavings * 12),
          })
        : `Your selected cancellations could save ${format(
            plannedSavings
          )} every month, or ${format(plannedSavings * 12)} per year.`,
      potentialSavings: plannedSavings,
    });
  }

  return recommendations;
}

export function getSpendingInsights(
  selected: UserSubscription[],
  cancelledIds: string[],
  formatPriceFn?: (amount: number) => string,
  tFn?: (key: string, params?: Record<string, string | number>) => string
): SpendingInsight[] {
  const format = formatPriceFn || currency;
  const active = selected.filter(
    (item) => !cancelledIds.includes(item.subscriptionId)
  );

  const monthlyTotal = active.reduce(
    (sum, item) => sum + item.actualMonthlyPrice,
    0
  );

  const top = getTopSubscription(active);
  const categories = getCategoryBreakdown(active);
  const topCategory = categories[0];

  if (active.length === 0) {
    return [
      {
        title: tFn
          ? tFn("insights.noActiveSpending")
          : "No active spending to analyze",
        description: tFn
          ? tFn("insights.noActiveSpendingDesc")
          : "Add subscriptions or clear your cancellation selections to see your insights.",
        value: format(0),
        type: "info",
      },
    ];
  }

  const insights: SpendingInsight[] = [];

  if (top) {
    insights.push({
      title: tFn
        ? tFn("insights.mostExpensive")
        : "Most expensive subscription",
      description: tFn
        ? tFn("insights.mostExpensiveDesc", { name: top.name })
        : `${top.name} is your highest monthly subscription cost.`,
      value: format(top.monthlyPrice),
      type: "warning",
    });
  }

  if (topCategory) {
    const catName = tFn
      ? tFn(`cat.${topCategory.category}`)
      : topCategory.category;
    insights.push({
      title: tFn ? tFn("insights.topCategory") : "Top spending category",
      description: tFn
        ? tFn("insights.topCategoryDesc", {
            category: catName,
            percent: topCategory.percentage.toFixed(0),
          })
        : `${topCategory.category} represents ${topCategory.percentage.toFixed(
            0
          )}% of your monthly subscription spending.`,
      value: format(topCategory.amount),
      type: "info",
    });
  }

  insights.push({
    title: tFn
      ? tFn("insights.projectedAnnual")
      : "Projected annual spending",
    description: tFn
      ? tFn("insights.projectedAnnualDesc")
      : "If your current monthly spending stays the same.",
    value: format(monthlyTotal * 12),
    type: "positive",
  });

  return insights;
}
