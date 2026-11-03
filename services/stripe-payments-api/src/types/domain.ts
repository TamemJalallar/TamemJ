export type PaymentAppStatus =
  | 'pending'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'unknown';

export type PayoutAppStatus = 'pending' | 'paid' | 'failed' | 'canceled' | 'in_transit' | 'unknown';

export interface PaymentRecord {
  dedupeKey: string;
  billId: string;
  paymentRequestId: string;
  participantId: string;
  participantName: string;
  hostUserId: string;
  amount: number;
  currency: string;
  memo?: string | undefined;
  receiptEmail?: string | undefined;
  connectedAccountId?: string | undefined;
  paymentIntentId: string;
  stripeStatus: string;
  appStatus: PaymentAppStatus;
  providerReferenceIds: string[];
  metadata: Record<string, string>;
  lastError?: {
    code?: string | undefined;
    message: string;
  } | undefined;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | undefined;
}

export interface ConnectedAccountRecord {
  accountId: string;
  hostUserId: string;
  email: string;
  country: string;
  businessType: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirementsCurrentlyDue: string[];
  requirementsEventuallyDue: string[];
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutRecord {
  payoutId: string;
  providerReferenceId: string;
  billId: string;
  hostUserId: string;
  connectedAccountId: string;
  amount: number;
  currency: string;
  payoutType: 'standard' | 'instant';
  feeAmount: number;
  netAmount: number;
  estimatedArrival?: string | undefined;
  stripeStatus: string;
  appStatus: PayoutAppStatus;
  providerReferenceIds: string[];
  metadata: Record<string, string>;
  failureCode?: string | undefined;
  failureMessage?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEventRecord {
  eventId: string;
  type: string;
  objectId: string;
  receivedAt: string;
  processedAt: string;
}

export interface StripeStoreShape {
  paymentsByDedupeKey: Record<string, PaymentRecord>;
  paymentIntentIndex: Record<string, string>;
  connectedAccountsById: Record<string, ConnectedAccountRecord>;
  payoutsById: Record<string, PayoutRecord>;
  webhookEventsById: Record<string, WebhookEventRecord>;
}
