import { Router, type Request, type Response } from 'express';
import type Stripe from 'stripe';
import { ZodError } from 'zod';
import { appEnv, assertLiveStripeConfigured } from '../config/env.js';
import { getStripeClient } from '../config/stripe.js';
import { HttpError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { assertMinorUnitAmount } from '../lib/money.js';
import {
  buildMetadataForPaymentIntent,
  buildPaymentDedupeKey,
  createMockId,
  getExpandableId
} from '../lib/stripe-helpers.js';
import { normalizePaymentIntentStatus, normalizePayoutStatus } from '../lib/stripe-status.js';
import type { StripePersistence } from '../persistence/contracts.js';
import { createIntentSchema } from '../schemas/stripe.js';
import type { PaymentRecord, PayoutRecord, WebhookEventRecord } from '../types/domain.js';

export function createPaymentsRouter(store: StripePersistence) {
  const router = Router();

  router.post('/create-intent', async (request, response, next) => {
    try {
      const input = createIntentSchema.parse(request.body);
      assertMinorUnitAmount(input.amount);
      const dedupeKey = buildPaymentDedupeKey(input.paymentRequestId, input.participantId);
      const existing = await store.getPaymentByDedupeKey(dedupeKey);

      if (existing && !['failed', 'canceled'].includes(existing.appStatus)) {
        throw new HttpError(409, 'duplicate_payment_attempt', 'A non-terminal payment attempt already exists for this participant and request.', {
          paymentIntentId: existing.paymentIntentId,
          status: existing.stripeStatus,
          appStatus: existing.appStatus
        });
      }

      const metadata = buildMetadataForPaymentIntent(input);

      if (appEnv.mockMode) {
        const paymentIntentId = createMockId('pi');
        const clientSecret = `${paymentIntentId}_secret_${createMockId('mock')}`;
        const createdAt = new Date().toISOString();
        const record: PaymentRecord = {
          dedupeKey,
          billId: input.billId,
          paymentRequestId: input.paymentRequestId,
          participantId: input.participantId,
          participantName: input.participantName,
          hostUserId: input.hostUserId,
          amount: input.amount,
          currency: input.currency,
          memo: input.memo,
          receiptEmail: input.receiptEmail,
          connectedAccountId: input.connectedAccountId,
          paymentIntentId,
          stripeStatus: 'requires_payment_method',
          appStatus: 'pending',
          providerReferenceIds: [paymentIntentId],
          metadata,
          createdAt,
          updatedAt: createdAt
        };

        await store.savePayment(record);

        response.status(201).json({
          ok: true,
          mockMode: true,
          paymentIntentId,
          clientSecret,
          publishableKey: appEnv.stripePublishableKey ?? 'pk_test_mock_not_for_real_payments',
          amount: input.amount,
          currency: input.currency,
          status: 'requires_payment_method',
          appStatus: 'pending'
        });
        return;
      }

      assertLiveStripeConfigured();
      const stripe = getStripeClient();
      if (!stripe) {
        throw new HttpError(503, 'stripe_unavailable', 'Stripe client could not be initialized.');
      }

      const params: Stripe.PaymentIntentCreateParams = {
        amount: input.amount,
        currency: input.currency,
        automatic_payment_methods: { enabled: true },
        description: input.memo ?? `Shared bill repayment for ${input.participantName}`,
        metadata,
        transfer_group: `bill_${input.billId}`
      };

      if (input.receiptEmail) {
        params.receipt_email = input.receiptEmail;
      }

      if (input.connectedAccountId) {
        params.transfer_data = { destination: input.connectedAccountId };
        params.on_behalf_of = input.connectedAccountId;
        if (appEnv.stripeApplicationFeeBps > 0) {
          params.application_fee_amount = Math.ceil((input.amount * appEnv.stripeApplicationFeeBps) / 10_000);
        }
      }

      const paymentIntent = await stripe.paymentIntents.create(params, {
        idempotencyKey: `create-intent:${dedupeKey}`
      });

      const createdAt = new Date().toISOString();
      const record: PaymentRecord = {
        dedupeKey,
        billId: input.billId,
        paymentRequestId: input.paymentRequestId,
        participantId: input.participantId,
        participantName: input.participantName,
        hostUserId: input.hostUserId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        memo: input.memo,
        receiptEmail: input.receiptEmail,
        connectedAccountId: input.connectedAccountId,
        paymentIntentId: paymentIntent.id,
        stripeStatus: paymentIntent.status,
        appStatus: normalizePaymentIntentStatus(paymentIntent.status),
        providerReferenceIds: [
          paymentIntent.id,
          ...(getExpandableId(paymentIntent.latest_charge) ? [getExpandableId(paymentIntent.latest_charge)!] : [])
        ],
        metadata,
        createdAt,
        updatedAt: createdAt
      };

      await store.savePayment(record);

      response.status(201).json({
        ok: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        publishableKey: appEnv.stripePublishableKey,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        appStatus: record.appStatus
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export async function handleStripeWebhook(request: Request, response: Response, store: StripePersistence) {
  try {
    const rawBody = request.body instanceof Buffer ? request.body : Buffer.from(String(request.body ?? ''), 'utf8');
    const signature = request.header('stripe-signature');

    let event: Stripe.Event;

    if (appEnv.mockMode) {
      const parsedBody = JSON.parse(rawBody.toString('utf8')) as Stripe.Event;
      event = parsedBody;
    } else {
      assertLiveStripeConfigured();
      if (!signature) {
        throw new HttpError(400, 'invalid_webhook_signature', 'Missing Stripe-Signature header.');
      }

      const stripe = getStripeClient();
      if (!stripe) {
        throw new HttpError(503, 'stripe_unavailable', 'Stripe client could not be initialized.');
      }

      event = stripe.webhooks.constructEvent(rawBody, signature, appEnv.stripeWebhookSecret ?? '');
    }

    if (await store.hasProcessedWebhook(event.id)) {
      response.json({ ok: true, duplicate: true });
      return;
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await persistPaymentIntentEvent(paymentIntent, event, store);
        break;
      }
      case 'payout.paid':
      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout;
        await persistPayoutEvent(payout, event, store);
        break;
      }
      default:
        logger.info({ eventType: event.type, eventId: event.id }, 'Ignoring unhandled Stripe webhook event.');
        break;
    }

    const record: WebhookEventRecord = {
      eventId: event.id,
      type: event.type,
      objectId:
        'id' in event.data.object && typeof event.data.object.id === 'string'
          ? event.data.object.id
          : 'unknown',
      receivedAt: new Date(event.created * 1000).toISOString(),
      processedAt: new Date().toISOString()
    };

    await store.markWebhookProcessed(record);
    response.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ ok: false, code: 'invalid_payload', message: error.message });
      return;
    }

    if (error instanceof HttpError) {
      response.status(error.statusCode).json({ ok: false, code: error.code, message: error.message, details: error.details });
      return;
    }

    logger.error({ error }, 'Stripe webhook processing failed.');
    response.status(500).json({ ok: false, code: 'webhook_processing_failed', message: 'Webhook processing failed.' });
  }
}

async function persistPaymentIntentEvent(paymentIntent: Stripe.PaymentIntent, event: Stripe.Event, store: StripePersistence) {
  const metadata = paymentIntent.metadata ?? {};
  const dedupeKey = buildPaymentDedupeKey(metadata.paymentRequestId ?? paymentIntent.id, metadata.participantId ?? paymentIntent.id);
  const existing = await store.getPaymentByPaymentIntentId(paymentIntent.id);
  const now = new Date().toISOString();
  const record: PaymentRecord = {
    dedupeKey: existing?.dedupeKey ?? dedupeKey,
    billId: existing?.billId ?? metadata.billId ?? 'unknown',
    paymentRequestId: existing?.paymentRequestId ?? metadata.paymentRequestId ?? paymentIntent.id,
    participantId: existing?.participantId ?? metadata.participantId ?? 'unknown',
    participantName: existing?.participantName ?? metadata.participantName ?? 'Unknown participant',
    hostUserId: existing?.hostUserId ?? metadata.hostUserId ?? 'unknown',
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    memo: existing?.memo ?? metadata.memo,
    receiptEmail: existing?.receiptEmail ?? paymentIntent.receipt_email ?? undefined,
    connectedAccountId: existing?.connectedAccountId ?? metadata.connectedAccountId,
    paymentIntentId: paymentIntent.id,
    stripeStatus: paymentIntent.status,
    appStatus: normalizePaymentIntentStatus(paymentIntent.status),
    providerReferenceIds: uniqueIds([
      paymentIntent.id,
      getExpandableId(paymentIntent.latest_charge),
      event.id,
      ...(existing?.providerReferenceIds ?? [])
    ]),
    metadata: Object.fromEntries(Object.entries(metadata)),
    lastError: paymentIntent.last_payment_error?.message
      ? {
          code: paymentIntent.last_payment_error.code ?? undefined,
          message: paymentIntent.last_payment_error.message
        }
      : existing?.lastError,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    completedAt: ['succeeded', 'canceled'].includes(paymentIntent.status) ? now : existing?.completedAt
  };

  await store.savePayment(record);
}

async function persistPayoutEvent(payout: Stripe.Payout, event: Stripe.Event, store: StripePersistence) {
  const existing = await store.getPayout(payout.id);
  const now = new Date().toISOString();
  const metadata = payout.metadata ?? {};
  const record: PayoutRecord = {
    payoutId: payout.id,
    providerReferenceId: payout.id,
    billId: existing?.billId ?? metadata.billId ?? 'unknown',
    hostUserId: existing?.hostUserId ?? metadata.hostUserId ?? 'unknown',
    connectedAccountId: existing?.connectedAccountId ?? metadata.connectedAccountId ?? 'unknown',
    amount: payout.amount,
    currency: payout.currency,
    payoutType: existing?.payoutType ?? ((payout.method as 'standard' | 'instant' | undefined) === 'instant' ? 'instant' : 'standard'),
    feeAmount: existing?.feeAmount ?? 0,
    netAmount: existing?.netAmount ?? payout.amount,
    estimatedArrival: existing?.estimatedArrival ?? (payout.arrival_date ? new Date(payout.arrival_date * 1000).toISOString() : undefined),
    stripeStatus: payout.status,
    appStatus: normalizePayoutStatus(payout.status),
    providerReferenceIds: uniqueIds([
      payout.id,
      getExpandableId(payout.balance_transaction),
      getExpandableId(payout.failure_balance_transaction),
      event.id,
      ...(existing?.providerReferenceIds ?? [])
    ]),
    metadata: Object.fromEntries(Object.entries(metadata)),
    failureCode: payout.failure_code ?? existing?.failureCode,
    failureMessage: payout.failure_message ?? existing?.failureMessage,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };

  await store.savePayout(record);
}

function uniqueIds(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}
