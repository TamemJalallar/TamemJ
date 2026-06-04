import path from 'node:path';
import { config as loadDotEnv } from 'dotenv';
import { z } from 'zod';
import { HttpError } from '../lib/errors.js';

loadDotEnv();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4242),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  BASE_URL: z.string().url().default('http://localhost:4242'),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://127.0.0.1:3000,https://tamemj.com,https://www.tamemj.com'),
  STRIPE_MOCK_MODE: z.coerce.boolean().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_CONNECT_COUNTRY: z.string().length(2).default('US'),
  STRIPE_CONNECT_BUSINESS_TYPE: z.enum(['individual', 'company', 'non_profit', 'government_entity']).default('individual'),
  STRIPE_PAYOUT_CURRENCY: z.string().length(3).default('usd'),
  STRIPE_INSTANT_PAYOUT_FEE_BPS: z.coerce.number().int().nonnegative().default(100),
  STRIPE_INSTANT_PAYOUT_MIN_FEE: z.coerce.number().int().nonnegative().default(50),
  STRIPE_APPLICATION_FEE_BPS: z.coerce.number().int().nonnegative().default(0),
  PERSISTENCE_FILE_PATH: z.string().default('./.runtime/stripe-payments-store.json')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const env = parsed.data;
const hasLiveStripeConfig = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY);
const mockMode = env.STRIPE_MOCK_MODE ?? !hasLiveStripeConfig;

if (env.NODE_ENV === 'production' && mockMode) {
  throw new Error('Production startup blocked: Stripe mock mode is enabled or Stripe keys are missing.');
}

if (!mockMode && !env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required when Stripe mock mode is disabled.');
}

export const appEnv = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  baseUrl: env.BASE_URL,
  corsAllowedOrigins: env.CORS_ALLOWED_ORIGINS.split(',').map((value) => value.trim()).filter(Boolean),
  mockMode,
  stripeSecretKey: env.STRIPE_SECRET_KEY,
  stripePublishableKey: env.STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
  stripeConnectCountry: env.STRIPE_CONNECT_COUNTRY.toUpperCase(),
  stripeConnectBusinessType: env.STRIPE_CONNECT_BUSINESS_TYPE,
  stripePayoutCurrency: env.STRIPE_PAYOUT_CURRENCY.toLowerCase(),
  stripeInstantPayoutFeeBps: env.STRIPE_INSTANT_PAYOUT_FEE_BPS,
  stripeInstantPayoutMinimumFee: env.STRIPE_INSTANT_PAYOUT_MIN_FEE,
  stripeApplicationFeeBps: env.STRIPE_APPLICATION_FEE_BPS,
  persistenceFilePath: path.resolve(process.cwd(), env.PERSISTENCE_FILE_PATH)
} as const;

export function assertLiveStripeConfigured(): void {
  if (appEnv.mockMode || !appEnv.stripeSecretKey || !appEnv.stripePublishableKey || !appEnv.stripeWebhookSecret) {
    throw new HttpError(503, 'stripe_unavailable', 'Stripe is running in mock mode or missing live credentials.');
  }
}
