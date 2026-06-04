import { Router } from 'express';
import type Stripe from 'stripe';
import { appEnv, assertLiveStripeConfigured } from '../config/env.js';
import { getStripeClient } from '../config/stripe.js';
import { HttpError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { assertMinorUnitAmount } from '../lib/money.js';
import { buildPayoutQuote, createMockId, sanitizeMetadata } from '../lib/stripe-helpers.js';
import { normalizePayoutStatus } from '../lib/stripe-status.js';
import type { StripePersistence } from '../persistence/contracts.js';
import { payoutCreateSchema, payoutQuoteSchema } from '../schemas/stripe.js';
import type { PayoutRecord } from '../types/domain.js';

export function createPayoutsRouter(store: StripePersistence) {
  const router = Router();

  router.post('/quote', async (request, response, next) => {
    try {
      const input = payoutQuoteSchema.parse(request.body);
      assertMinorUnitAmount(input.amount);

      if (!appEnv.mockMode) {
        await assertPayoutReady(input.connectedAccountId, input.payoutType);
      }

      const quote = buildPayoutQuote({
        amount: input.amount,
        payoutType: input.payoutType,
        feeBps: appEnv.stripeInstantPayoutFeeBps,
        minimumFee: appEnv.stripeInstantPayoutMinimumFee
      });

      response.json({
        ok: true,
        feeAmount: quote.feeAmount,
        netAmount: quote.netAmount,
        estimatedArrival: quote.estimatedArrival,
        payoutType: input.payoutType
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/create', async (request, response, next) => {
    try {
      const input = payoutCreateSchema.parse(request.body);
      assertMinorUnitAmount(input.amount);
      const metadata = sanitizeMetadata({ ...input.metadata, billId: input.billId, hostUserId: input.hostUserId, connectedAccountId: input.connectedAccountId });
      const quote = buildPayoutQuote({
        amount: input.amount,
        payoutType: input.payoutType,
        feeBps: appEnv.stripeInstantPayoutFeeBps,
        minimumFee: appEnv.stripeInstantPayoutMinimumFee
      });

      if (appEnv.mockMode) {
        const payoutId = createMockId('po');
        const now = new Date().toISOString();
        const record: PayoutRecord = {
          payoutId,
          providerReferenceId: payoutId,
          billId: input.billId,
          hostUserId: input.hostUserId,
          connectedAccountId: input.connectedAccountId,
          amount: input.amount,
          currency: input.currency,
          payoutType: input.payoutType,
          feeAmount: quote.feeAmount,
          netAmount: quote.netAmount,
          estimatedArrival: quote.estimatedArrival,
          stripeStatus: 'pending',
          appStatus: 'pending',
          providerReferenceIds: [payoutId],
          metadata,
          createdAt: now,
          updatedAt: now
        };

        await store.savePayout(record);

        response.status(201).json({
          ok: true,
          mockMode: true,
          payoutId,
          providerReferenceId: payoutId,
          status: 'pending',
          amount: input.amount,
          feeAmount: quote.feeAmount,
          netAmount: quote.netAmount,
          currency: input.currency
        });
        return;
      }

      await assertPayoutReady(input.connectedAccountId, input.payoutType);
      assertLiveStripeConfigured();
      const stripe = getStripeClient();
      if (!stripe) {
        throw new HttpError(503, 'stripe_unavailable', 'Stripe client could not be initialized.');
      }

      const payout = await stripe.payouts.create(
        {
          amount: quote.netAmount,
          currency: input.currency,
          method: input.payoutType,
          description: input.memo ?? `Split-bill payout for ${input.hostUserId}`,
          metadata
        },
        {
          stripeAccount: input.connectedAccountId,
          idempotencyKey: `payout:${input.billId}:${input.hostUserId}:${input.payoutType}`
        }
      );

      const now = new Date().toISOString();
      const record: PayoutRecord = {
        payoutId: payout.id,
        providerReferenceId: payout.id,
        billId: input.billId,
        hostUserId: input.hostUserId,
        connectedAccountId: input.connectedAccountId,
        amount: input.amount,
        currency: payout.currency,
        payoutType: input.payoutType,
        feeAmount: quote.feeAmount,
        netAmount: quote.netAmount,
        estimatedArrival: quote.estimatedArrival,
        stripeStatus: payout.status,
        appStatus: normalizePayoutStatus(payout.status),
        providerReferenceIds: uniqueIds([
          payout.id,
          typeof payout.balance_transaction === 'string' ? payout.balance_transaction : undefined
        ]),
        metadata,
        createdAt: now,
        updatedAt: now
      };

      await store.savePayout(record);

      response.status(201).json({
        ok: true,
        payoutId: payout.id,
        providerReferenceId: payout.id,
        status: payout.status,
        amount: input.amount,
        feeAmount: quote.feeAmount,
        netAmount: quote.netAmount,
        currency: payout.currency
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

async function assertPayoutReady(connectedAccountId: string, payoutType: 'standard' | 'instant') {
  assertLiveStripeConfigured();
  const stripe = getStripeClient();
  if (!stripe) {
    throw new HttpError(503, 'stripe_unavailable', 'Stripe client could not be initialized.');
  }

  const account = await stripe.v2.core.accounts.retrieve(connectedAccountId, {
    include: ['configuration.recipient', 'requirements']
  });
  const payoutCapability = account.configuration?.recipient?.capabilities?.stripe_balance?.payouts;

  if (payoutCapability?.status !== 'active') {
    throw new HttpError(409, 'payout_unavailable', 'Connected account is not enabled for payouts.', {
      requirementsCurrentlyDue:
        account.requirements?.entries
          ?.filter((entry) => ['currently_due', 'past_due'].includes(entry.minimum_deadline.status))
          .map((entry) => entry.reference?.resource ?? entry.reference?.inquiry ?? entry.description) ?? [],
      capabilityStatus: payoutCapability?.status ?? 'unknown'
    });
  }

  if (payoutType === 'instant') {
    const externalAccounts = await stripe.accounts.listExternalAccounts(connectedAccountId, { limit: 10 });
    const hasInstantDestination = externalAccounts.data.some((account) => {
      const payoutMethods = 'available_payout_methods' in account ? account.available_payout_methods : undefined;
      return Array.isArray(payoutMethods) && payoutMethods.includes('instant');
    });

    if (!hasInstantDestination) {
      throw new HttpError(409, 'payout_unavailable', 'Connected account does not have an external account eligible for instant payouts.');
    }
  }

  logger.info({ connectedAccountId, payoutType }, 'Connected account passed payout readiness checks.');
}

function uniqueIds(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}
