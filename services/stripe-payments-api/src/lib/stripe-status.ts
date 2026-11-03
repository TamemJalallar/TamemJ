import type Stripe from 'stripe';
import type { PaymentAppStatus, PayoutAppStatus } from '../types/domain.js';

export function normalizePaymentIntentStatus(status: Stripe.PaymentIntent.Status): PaymentAppStatus {
  switch (status) {
    case 'requires_action':
      return 'requires_action';
    case 'processing':
      return 'processing';
    case 'succeeded':
      return 'succeeded';
    case 'canceled':
      return 'canceled';
    case 'requires_payment_method':
    case 'requires_capture':
    case 'requires_confirmation':
      return 'pending';
    default:
      return 'unknown';
  }
}

export function normalizePayoutStatus(status: Stripe.Payout['status']): PayoutAppStatus {
  switch (status) {
    case 'paid':
      return 'paid';
    case 'pending':
      return 'pending';
    case 'failed':
      return 'failed';
    case 'canceled':
      return 'canceled';
    case 'in_transit':
      return 'in_transit';
    default:
      return 'unknown';
  }
}
