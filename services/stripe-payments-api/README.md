# Stripe Payments API

Standalone Express + TypeScript backend for Stripe payments, webhooks, Connect onboarding, and payouts.

This service is separate from the static Next.js frontend because the site currently exports as static HTML. That means Stripe webhooks and server-side payment operations need a Node-capable deployment target.

## What this service provides

- `POST /api/payments/create-intent`
- `POST /api/payments/webhook`
- `POST /api/connect/accounts`
- `POST /api/connect/account-link`
- `GET /api/connect/accounts/:accountId/status`
- `POST /api/payouts/quote`
- `POST /api/payouts/create`
- `GET /health`

The Stripe client is centralized in `src/config/stripe.ts`, uses the official Stripe SDK, and pins API version `2026-02-25.clover`. Connect account creation uses Accounts v2 (`stripe.v2.core.accounts`) with `merchant` and `recipient` configurations, Express dashboard access, application-collected fees/losses, card payment capability requests, and Stripe transfer capability requests. Payout readiness is checked against the returned `stripe_balance.payouts` capability before creating payouts.

## Local setup

1. Install dependencies:

```bash
cd /Users/tamem.jalallar/Library/CloudStorage/OneDrive-Ogilvy/Documents/TamemJ/TamemJ/services/stripe-payments-api
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. For mock mode only, leave Stripe keys blank and keep:

```env
STRIPE_MOCK_MODE=true
```

4. For live Stripe mode, set:

```env
STRIPE_MOCK_MODE=false
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. Start the API:

```bash
npm run dev
```

The default local server is:

- `http://localhost:4242`

You can also run the service from the repo root:

```bash
npm run stripe-api:dev
```

## Environment variables

Required in live mode:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Important optional settings:

- `PORT`
- `BASE_URL`
- `CORS_ALLOWED_ORIGINS`
- `STRIPE_CONNECT_COUNTRY`
- `STRIPE_CONNECT_BUSINESS_TYPE`
- `STRIPE_PAYOUT_CURRENCY`
- `STRIPE_INSTANT_PAYOUT_FEE_BPS`
- `STRIPE_INSTANT_PAYOUT_MIN_FEE`
- `STRIPE_APPLICATION_FEE_BPS`
- `PERSISTENCE_FILE_PATH`

## Request expectations

### Payment intent amounts

`amount` must be sent in the smallest currency unit.

Examples:

- `1099` = `$10.99 USD`
- `2500` = `$25.00 USD`

### Example create-intent request

```bash
curl -X POST http://localhost:4242/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "billId": "bill_123",
    "paymentRequestId": "pr_123",
    "participantId": "user_456",
    "participantName": "Chris",
    "hostUserId": "host_789",
    "amount": 2450,
    "currency": "usd",
    "memo": "Dinner at Lilia",
    "receiptEmail": "chris@example.com",
    "connectedAccountId": "acct_1234",
    "metadata": {
      "groupName": "Brooklyn dinner"
    }
  }'
```

The payment response includes a `clientSecret` for Stripe.js/Payment Element or Apple Pay confirmation on the client. Treat it as client-safe, but never expose `STRIPE_SECRET_KEY` or trust a client-side success result as final. Fulfillment should be driven by `payment_intent.succeeded` in the webhook.

## Stripe CLI

Install and authenticate the Stripe CLI, then forward events to the webhook route:

```bash
stripe listen --forward-to http://localhost:4242/api/payments/webhook
```

Stripe prints a signing secret like:

```txt
whsec_...
```

Put that value into:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Keep that listener running while you test locally. The webhook route verifies the `Stripe-Signature` header in live mode, so the `STRIPE_WEBHOOK_SECRET` must come from the same `stripe listen` session or from the webhook endpoint configured in Stripe Workbench.

If you already registered a public webhook in Stripe, you can mirror that configuration locally with:

```bash
stripe listen --load-from-webhooks-api --forward-to http://localhost:4242
```

## Local webhook testing

In one terminal, start the service:

```bash
npm run dev
```

In a second terminal, start the Stripe listener:

```bash
stripe listen --forward-to http://localhost:4242/api/payments/webhook
```

In a third terminal, trigger a successful payment event:

```bash
stripe trigger payment_intent.succeeded
```

Trigger a failed payment event:

```bash
stripe trigger payment_intent.payment_failed
```

Trigger payout events:

```bash
stripe trigger payout.paid
stripe trigger payout.failed
```

The file-backed development store records processed webhook event IDs, provider reference IDs, normalized payment states, and normalized payout states under `.runtime/`.

## Public deployment

Deploy this service to any Node-capable platform such as:

- Render
- Railway
- Fly.io
- Vercel Functions with an adapter layer
- a dedicated VM or container host

Recommended public base URL shape:

- `https://api.tamemj.com`

Recommended webhook endpoint:

- `https://api.tamemj.com/api/payments/webhook`

After deploy:

1. Set the live environment variables on the host.
2. Point Stripe webhooks to the public endpoint.
3. Copy the Stripe webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Set `STRIPE_MOCK_MODE=false`.
5. Restrict `CORS_ALLOWED_ORIGINS` to your real site origins.

## Persistence note

The service ships with a file-backed persistence adapter so local development can store provider reference IDs, dedupe payment attempts, and remember processed webhook events.

That is enough for development and single-instance testing, but before multi-instance production you should replace it with a shared store such as Postgres, Redis, or another durable datastore. The persistence interface is already isolated under `src/persistence/` for that swap.

## Production setup still required

- Deploy the API to a public Node-capable host.
- Replace file-backed persistence with a shared durable store if you plan to run more than one instance.
- Configure Stripe webhook endpoints in Workbench.
- Complete Stripe Connect platform onboarding and review Accounts v2 capability availability for your account.
- Confirm your connected-account payout settings support the payout modes you want, especially standard manual payouts and instant payouts.
- If you want platform fees on destination charges, set `STRIPE_APPLICATION_FEE_BPS` deliberately and verify the fee model with your Stripe account configuration.
