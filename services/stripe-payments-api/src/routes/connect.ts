import { Router } from 'express';
import type Stripe from 'stripe';
import { appEnv, assertLiveStripeConfigured } from '../config/env.js';
import { getStripeClient } from '../config/stripe.js';
import { HttpError } from '../lib/errors.js';
import { createMockId, sanitizeMetadata } from '../lib/stripe-helpers.js';
import type { StripePersistence } from '../persistence/contracts.js';
import {
  accountIdParamSchema,
  connectAccountCreateSchema,
  connectAccountLinkSchema
} from '../schemas/stripe.js';
import type { ConnectedAccountRecord } from '../types/domain.js';

export function createConnectRouter(store: StripePersistence) {
  const router = Router();

  router.post('/accounts', async (request, response, next) => {
    try {
      const input = connectAccountCreateSchema.parse(request.body);
      const metadata = sanitizeMetadata({ ...input.metadata, hostUserId: input.hostUserId });

      if (appEnv.mockMode) {
        const accountId = createMockId('acct');
        const now = new Date().toISOString();
        const record: ConnectedAccountRecord = {
          accountId,
          hostUserId: input.hostUserId,
          email: input.email,
          country: input.country,
          businessType: input.businessType,
          chargesEnabled: false,
          payoutsEnabled: false,
          detailsSubmitted: false,
          requirementsCurrentlyDue: ['external_account', 'representative.verification.document'],
          requirementsEventuallyDue: [],
          metadata,
          createdAt: now,
          updatedAt: now
        };

        await store.saveConnectedAccount(record);

        response.status(201).json({
          ok: true,
          mockMode: true,
          accountId,
          chargesEnabled: record.chargesEnabled,
          payoutsEnabled: record.payoutsEnabled,
          detailsSubmitted: record.detailsSubmitted,
          requirementsCurrentlyDue: record.requirementsCurrentlyDue,
          requirementsEventuallyDue: record.requirementsEventuallyDue
        });
        return;
      }

      assertLiveStripeConfigured();
      const stripe = getStripeClient();
      if (!stripe) {
        throw new HttpError(503, 'stripe_unavailable', 'Stripe client could not be initialized.');
      }

      const accountParams: Stripe.V2.Core.AccountCreateParams = {
        contact_email: input.email,
        dashboard: 'express',
        ...(input.displayName ? { display_name: input.displayName } : {}),
        defaults: {
          currency: appEnv.stripePayoutCurrency,
          profile: {
            business_url: 'https://tamemj.com/apps/lets-split-it/',
            ...(input.displayName ? { doing_business_as: input.displayName } : {}),
            product_description: 'Peer-to-peer expense sharing and shared bill settlement software'
          },
          responsibilities: {
            fees_collector: 'application',
            losses_collector: 'application'
          }
        },
        identity: {
          country: input.country,
          entity_type: input.businessType
        },
        configuration: {
          merchant: {
            capabilities: {
              card_payments: { requested: true }
            },
            support: {
              email: 'support@tamemj.com',
              url: 'https://tamemj.com/apps/lets-split-it/'
            }
          },
          recipient: {
            capabilities: {
              stripe_balance: {
                stripe_transfers: { requested: true }
              }
            }
          }
        },
        include: ['configuration.merchant', 'configuration.recipient', 'requirements', 'future_requirements'],
        metadata
      };

      const account = await stripe.v2.core.accounts.create(accountParams);
      const status = getV2AccountStatus(account);

      const now = new Date().toISOString();
      const record: ConnectedAccountRecord = {
        accountId: account.id,
        hostUserId: input.hostUserId,
        email: input.email,
        country: input.country,
        businessType: input.businessType,
        chargesEnabled: status.chargesEnabled,
        payoutsEnabled: status.payoutsEnabled,
        detailsSubmitted: status.requirementsCurrentlyDue.length === 0,
        requirementsCurrentlyDue: status.requirementsCurrentlyDue,
        requirementsEventuallyDue: status.requirementsEventuallyDue,
        metadata,
        createdAt: now,
        updatedAt: now
      };

      await store.saveConnectedAccount(record);

      response.status(201).json({
        ok: true,
        accountId: account.id,
        chargesEnabled: status.chargesEnabled,
        payoutsEnabled: status.payoutsEnabled,
        detailsSubmitted: status.requirementsCurrentlyDue.length === 0,
        requirementsCurrentlyDue: status.requirementsCurrentlyDue,
        requirementsEventuallyDue: status.requirementsEventuallyDue,
        appliedConfigurations: account.applied_configurations
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/account-link', async (request, response, next) => {
    try {
      const input = connectAccountLinkSchema.parse(request.body);

      if (appEnv.mockMode) {
        response.status(201).json({
          ok: true,
          mockMode: true,
          url: `${input.returnUrl}?mockAccount=${encodeURIComponent(input.accountId)}`,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        });
        return;
      }

      assertLiveStripeConfigured();
      const stripe = getStripeClient();
      if (!stripe) {
        throw new HttpError(503, 'stripe_unavailable', 'Stripe client could not be initialized.');
      }

      const accountLink = await stripe.v2.core.accountLinks.create({
        account: input.accountId,
        use_case: {
          type: 'account_onboarding',
          account_onboarding: {
            configurations: ['merchant', 'recipient'],
            collection_options: {
              fields: 'eventually_due',
              future_requirements: 'include'
            },
            refresh_url: input.refreshUrl,
            return_url: input.returnUrl
          }
        }
      });

      response.status(201).json({
        ok: true,
        url: accountLink.url,
        expiresAt: accountLink.expires_at
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/accounts/:accountId/status', async (request, response, next) => {
    try {
      const { accountId } = accountIdParamSchema.parse(request.params);

      if (appEnv.mockMode) {
        const saved = await store.getConnectedAccount(accountId);
        response.json({
          ok: true,
          accountId,
          chargesEnabled: saved?.chargesEnabled ?? false,
          payoutsEnabled: saved?.payoutsEnabled ?? false,
          requirementsCurrentlyDue: saved?.requirementsCurrentlyDue ?? [],
          requirementsEventuallyDue: saved?.requirementsEventuallyDue ?? []
        });
        return;
      }

      assertLiveStripeConfigured();
      const stripe = getStripeClient();
      if (!stripe) {
        throw new HttpError(503, 'stripe_unavailable', 'Stripe client could not be initialized.');
      }

      const account = await stripe.v2.core.accounts.retrieve(accountId, {
        include: ['configuration.merchant', 'configuration.recipient', 'requirements', 'future_requirements']
      });
      const status = getV2AccountStatus(account);

      response.json({
        ok: true,
        accountId: account.id,
        chargesEnabled: status.chargesEnabled,
        payoutsEnabled: status.payoutsEnabled,
        requirementsCurrentlyDue: status.requirementsCurrentlyDue,
        requirementsEventuallyDue: status.requirementsEventuallyDue,
        detailsSubmitted: status.requirementsCurrentlyDue.length === 0,
        appliedConfigurations: account.applied_configurations
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function getV2AccountStatus(account: Stripe.V2.Core.Account) {
  const cardPayments = account.configuration?.merchant?.capabilities?.card_payments;
  const stripePayouts = account.configuration?.recipient?.capabilities?.stripe_balance?.payouts;

  return {
    chargesEnabled: cardPayments?.status === 'active',
    payoutsEnabled: stripePayouts?.status === 'active',
    requirementsCurrentlyDue: requirementReferences(account.requirements, ['currently_due', 'past_due']),
    requirementsEventuallyDue: requirementReferences(account.future_requirements, ['eventually_due'])
  };
}

function requirementReferences(
  requirements: Stripe.V2.Core.Account.Requirements | undefined,
  statuses: Array<'currently_due' | 'eventually_due' | 'past_due'>
): string[] {
  return [
    ...new Set(
      requirements?.entries
        ?.filter((entry) => statuses.includes(entry.minimum_deadline.status))
        .map((entry) => entry.reference?.resource ?? entry.reference?.inquiry ?? entry.description)
        .filter((value): value is string => Boolean(value)) ?? []
    )
  ];
}
