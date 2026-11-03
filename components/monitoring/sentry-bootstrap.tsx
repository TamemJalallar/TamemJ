"use client";

import { useEffect, useRef } from "react";

function getSampleRate(envValue: string | undefined, fallback: number): number {
  if (!envValue) return fallback;
  const parsed = Number.parseFloat(envValue);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(1, Math.max(0, parsed));
}

export function SentryBootstrap() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) {
      return;
    }

    void import("@sentry/browser").then((Sentry) => {
      Sentry.init({
        dsn,
        enabled: process.env.NODE_ENV === "production",
        tracesSampleRate: getSampleRate(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, 0.15),
        replaysSessionSampleRate: getSampleRate(
          process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
          0
        ),
        replaysOnErrorSampleRate: getSampleRate(
          process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
          1
        ),
        integrations: [Sentry.replayIntegration()],
        environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
        sendDefaultPii: false
      });
    });

    initializedRef.current = true;
  }, []);

  return null;
}
