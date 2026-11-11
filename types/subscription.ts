export type SubscriptionCategory =
  | "Streaming"
  | "Music"
  | "AI Tools"
  | "Cloud Storage"
  | "Fitness"
  | "Food Delivery"
  | "Shopping";

export type RegionalPrice = {
  USD: number;
  JPY: number;
  IDR: number;
};

export type Subscription = {
  id: string;
  name: string;
  category: SubscriptionCategory;
  description: string;
  defaultPlan: string;
  defaultPrice: number;
  prices?: RegionalPrice;
  billingCycle: "monthly" | "yearly";
  iconText: string;
  regions?: ("US" | "JP" | "ID" | "GLOBAL")[];
};

export type UserSubscription = {
  subscriptionId: string;
  actualMonthlyPrice: number;
  currency?: "USD" | "JPY" | "IDR";
};
