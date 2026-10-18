import Stripe from 'stripe';

export interface Price {
  id: string;
  product_id: string;
  active: boolean;
  description: string | null;
  unit_amount: number;
  currency: string;
  type: string;
  interval: string | null;
  interval_count: number | null;
  trial_period_days: number | null;
  metadata: Stripe.Metadata;
}

export interface Product {
  id: string;
  active: boolean;
  name: string;
  description: string | null;
  image: string | null;
  metadata: Stripe.Metadata;
}

export interface ProductWithPrices extends Product {
  prices: Price[];
}

export interface Subscription {
  id: string;
  user_id: string;
  status: Stripe.Subscription.Status;
  metadata: Stripe.Metadata;
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
}
