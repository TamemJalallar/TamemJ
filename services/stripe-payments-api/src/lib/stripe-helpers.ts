import crypto from 'node:crypto';
import type Stripe from 'stripe';
import { calculateInstantPayoutFee, estimateArrivalIso } from './money.js';

export function createMockId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
}

export function sanitizeMetadata(input?: Record<string, unknown>): Record<string, string> {
  const metadata: Record<string, string> = {};
  if (!input) return metadata;

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    const trimmedKey = key.trim();
    if (!trimmedKey) continue;
    metadata[trimmedKey] = String(value).slice(0, 500);
  }

  return metadata;
}

export function buildPaymentDedupeKey(paymentRequestId: string, participantId: string): string {
  return `${paymentRequestId}:${participantId}`;
}

export function buildMetadataForPaymentIntent(input: {
  billId: string;
  paymentRequestId: string;
  participantId: string;
  participantName: string;
  hostUserId: string;
  connectedAccountId?: string | undefined;
  memo?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}): Record<string, string> {
  return sanitizeMetadata({
    ...input.metadata,
    billId: input.billId,
    paymentRequestId: input.paymentRequestId,
    participantId: input.participantId,
    participantName: input.participantName,
    hostUserId: input.hostUserId,
    connectedAccountId: input.connectedAccountId,
    memo: input.memo
  });
}

export function getExpandableId(value: string | Stripe.Charge | Stripe.BalanceTransaction | null | undefined): string | undefined {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.id;
}

export function buildPayoutQuote(args: {
  amount: number;
  payoutType: 'standard' | 'instant';
  feeBps: number;
  minimumFee: number;
}) {
  const feeAmount = args.payoutType === 'instant'
    ? calculateInstantPayoutFee(args.amount, args.feeBps, args.minimumFee)
    : 0;

  return {
    feeAmount,
    netAmount: Math.max(args.amount - feeAmount, 0),
    estimatedArrival: estimateArrivalIso(args.payoutType)
  };
}
