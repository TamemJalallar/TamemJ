import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { appEnv } from './config/env.js';
import { HttpError } from './lib/errors.js';
import { logger } from './lib/logger.js';
import type { StripePersistence } from './persistence/contracts.js';
import { createConnectRouter } from './routes/connect.js';
import { createHealthRouter } from './routes/health.js';
import { createPaymentsRouter, handleStripeWebhook } from './routes/payments.js';
import { createPayoutsRouter } from './routes/payouts.js';

export function createApp(store: StripePersistence) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({
    origin(origin, callback) {
      if (!origin || appEnv.corsAllowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    }
  }));

  app.use((request, _response, next) => {
    logger.info({ method: request.method, path: request.path }, 'Incoming request');
    next();
  });

  app.use(createHealthRouter());
  app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    void handleStripeWebhook(request, response, store);
  });

  app.use(express.json({ limit: '1mb' }));
  app.use('/api/payments', createPaymentsRouter(store));
  app.use('/api/connect', createConnectRouter(store));
  app.use('/api/payouts', createPayoutsRouter(store));

  app.use((_request, response) => {
    response.status(404).json({ ok: false, code: 'not_found', message: 'Route not found.' });
  });

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof ZodError) {
      response.status(400).json({ ok: false, code: 'invalid_request', message: 'Request validation failed.', details: error.flatten() });
      return;
    }

    if (error instanceof HttpError) {
      response.status(error.statusCode).json({ ok: false, code: error.code, message: error.message, details: error.details });
      return;
    }

    if (error instanceof Error && error.message.includes('not allowed by CORS')) {
      response.status(403).json({ ok: false, code: 'origin_forbidden', message: error.message });
      return;
    }

    logger.error({ error }, 'Unhandled API error');
    response.status(500).json({ ok: false, code: 'internal_error', message: 'Internal server error.' });
  });

  return app;
}
