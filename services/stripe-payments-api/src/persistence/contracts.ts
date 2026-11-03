import type {
  ConnectedAccountRecord,
  PaymentRecord,
  PayoutRecord,
  WebhookEventRecord
} from '../types/domain.js';

export interface StripePersistence {
  getPaymentByDedupeKey(dedupeKey: string): Promise<PaymentRecord | null>;
  getPaymentByPaymentIntentId(paymentIntentId: string): Promise<PaymentRecord | null>;
  savePayment(record: PaymentRecord): Promise<void>;
  getConnectedAccount(accountId: string): Promise<ConnectedAccountRecord | null>;
  saveConnectedAccount(record: ConnectedAccountRecord): Promise<void>;
  getPayout(payoutId: string): Promise<PayoutRecord | null>;
  savePayout(record: PayoutRecord): Promise<void>;
  hasProcessedWebhook(eventId: string): Promise<boolean>;
  markWebhookProcessed(record: WebhookEventRecord): Promise<void>;
}
