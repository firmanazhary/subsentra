
export type SubscriptionCategory =
  | "Streaming"
  | "Music"
  | "AI Tools"
  | "Cloud Storage"
  | "Fitness"
  | "Food Delivery"
  | "Shopping";

export type Subscription = {
  id: string;
  name: string;
  category: SubscriptionCategory;
  description: string;
  defaultPlan: string;
  defaultPrice: number;
  billingCycle: "monthly" | "yearly";
  iconText: string;
};

export type UserSubscription = {
  subscriptionId: string;
  actualMonthlyPrice: number;
};
