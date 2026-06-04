import Stripe from 'stripe';
import { appEnv } from './env.js';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (!appEnv.stripeSecretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(appEnv.stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
      appInfo: {
        name: 'TamemJ Stripe Payments API',
        version: '1.0.0'
      },
      maxNetworkRetries: 2,
      timeout: 30_000
    });
  }

  return stripeClient;
}
