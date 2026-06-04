import { Router } from 'express';

export function createHealthRouter() {
  const router = Router();

  router.get('/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'stripe-payments-api',
      timestamp: new Date().toISOString()
    });
  });

  return router;
}
