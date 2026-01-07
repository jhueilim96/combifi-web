import { Json } from './database.types';

/**
 * Payment method from the instant_split_detailed_view
 */
export interface InstantSplitPaymentMethod {
  image_url: string | null;
  image_key: string | null;
  image_expired_at: string | null;
  is_primary: boolean;
  type: string;
  label: string;
  details: Json | null;
}

/**
 * Transaction image from the instant_split_detailed_view
 */
export interface InstantSplitTransactionImage {
  id: string;
  image_key: string;
  is_active: boolean;
  image_url?: string; // Added after fetching signed URL
}

/**
 * Type for data returned from instant_split_detailed_view
 */
export interface InstantSplitDetailedView {
  id: string;
  amount: number;
  category_id: string | null;
  converted_amount: number | null;
  converted_currency: string | null;
  created_at: string;
  currency: string;
  date: string | null;
  description: string | null;
  is_deleted: boolean;
  link: string | null;
  notes: string | null;
  settle_metadata: Json | null;
  settle_mode: string | null;
  status: string | null;
  updated_at: string;
  user_id: string;

  // Profile name (from joined profiles table)
  name: string | null;

  // Aggregated payment methods as JSON array
  payment_methods: InstantSplitPaymentMethod[];

  // Aggregated transaction images as JSON array
  transaction_images: InstantSplitTransactionImage[];
}
