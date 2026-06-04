import { z } from 'zod';

const metadataSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional();
const optionalString = z.string().trim().min(1).optional();
const currencySchema = z.string().trim().length(3).transform((value) => value.toLowerCase());

export const createIntentSchema = z.object({
  billId: z.string().trim().min(1),
  paymentRequestId: z.string().trim().min(1),
  participantId: z.string().trim().min(1),
  participantName: z.string().trim().min(1).max(120),
  hostUserId: z.string().trim().min(1),
  amount: z.number().int().positive(),
  currency: currencySchema,
  memo: optionalString,
  receiptEmail: z.string().email().optional(),
  connectedAccountId: z.string().trim().regex(/^acct_[A-Za-z0-9]+$/).optional(),
  metadata: metadataSchema
});

export const connectAccountCreateSchema = z.object({
  hostUserId: z.string().trim().min(1),
  email: z.string().email(),
  country: z.string().trim().length(2).transform((value) => value.toUpperCase()).default('US'),
  businessType: z.enum(['individual', 'company', 'non_profit', 'government_entity']).default('individual'),
  displayName: optionalString,
  metadata: metadataSchema
});

export const connectAccountLinkSchema = z.object({
  accountId: z.string().trim().regex(/^acct_[A-Za-z0-9]+$/),
  refreshUrl: z.string().url(),
  returnUrl: z.string().url()
});

export const payoutQuoteSchema = z.object({
  billId: z.string().trim().min(1),
  hostUserId: z.string().trim().min(1),
  connectedAccountId: z.string().trim().regex(/^acct_[A-Za-z0-9]+$/),
  amount: z.number().int().positive(),
  currency: currencySchema,
  payoutType: z.enum(['standard', 'instant'])
});

export const payoutCreateSchema = payoutQuoteSchema.extend({
  metadata: metadataSchema,
  memo: optionalString
});

export const accountIdParamSchema = z.object({
  accountId: z.string().trim().regex(/^acct_[A-Za-z0-9]+$/)
});
