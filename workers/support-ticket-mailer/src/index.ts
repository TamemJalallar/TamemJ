interface TicketLike {
  id: string;
  requesterEmail?: string;
}

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

interface TicketEmailRequest {
  source?: string;
  ticket?: TicketLike;
  email?: EmailPayload;
  turnstileToken?: string;
}

interface RateLimitStore {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
}

interface Env {
  RESEND_API_KEY: string;
  SUPPORT_EMAIL_TO?: string;
  SUPPORT_EMAIL_FROM?: string;
  ALLOWED_ORIGIN?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_EXPECTED_HOSTNAME?: string;
  RATE_LIMIT_MAX_PER_MINUTE?: string;
  RATE_LIMIT_KV?: RateLimitStore;
}

interface TurnstileVerificationResponse {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
}

function jsonResponse(body: Record<string, unknown>, status = 200, origin = "*"): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin"
    }
  });
}

function resolveAllowedOrigin(request: Request, env: Env): { allowed: boolean; responseOrigin: string } {
  const configured = env.ALLOWED_ORIGIN?.trim();
  if (!configured) {
    return { allowed: true, responseOrigin: "*" };
  }

  const requestOrigin = request.headers.get("Origin")?.trim() ?? "";
  if (!requestOrigin) {
    return { allowed: true, responseOrigin: configured };
  }

  if (requestOrigin === configured) {
    return { allowed: true, responseOrigin: requestOrigin };
  }

  return { allowed: false, responseOrigin: configured };
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function resolveClientIp(request: Request): string {
  const cfIp = request.headers.get("CF-Connecting-IP")?.trim();
  if (cfIp) {
    return cfIp;
  }

  const forwarded = request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();
  if (forwarded) {
    return forwarded;
  }

  return "unknown";
}

function resolveRateLimitMax(env: Env): number {
  const parsed = Number.parseInt(env.RATE_LIMIT_MAX_PER_MINUTE?.trim() ?? "6", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 6;
  }

  return parsed;
}

async function enforceRateLimit(
  request: Request,
  env: Env
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!env.RATE_LIMIT_KV) {
    return { ok: true };
  }

  const ip = resolveClientIp(request);
  const minuteBucket = Math.floor(Date.now() / 60_000);
  const key = `rate:${ip}:${minuteBucket}`;

  try {
    const existingRaw = await env.RATE_LIMIT_KV.get(key);
    const existing = existingRaw ? Number.parseInt(existingRaw, 10) : 0;
    const limit = resolveRateLimitMax(env);

    if (Number.isFinite(existing) && existing >= limit) {
      return {
        ok: false,
        status: 429,
        error: "Rate limit exceeded. Retry in about one minute."
      };
    }

    const nextCount = Number.isFinite(existing) && existing > 0 ? existing + 1 : 1;
    await env.RATE_LIMIT_KV.put(key, String(nextCount), { expirationTtl: 120 });
    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 503,
      error: "Rate limiter is temporarily unavailable."
    };
  }
}

async function verifyTurnstile(
  token: string,
  request: Request,
  env: Env
): Promise<{ ok: true } | { ok: false; status: number; error: string; details?: string[] }> {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return {
      ok: false,
      status: 500,
      error: "Missing TURNSTILE_SECRET_KEY secret"
    };
  }

  if (!token.trim()) {
    return {
      ok: false,
      status: 400,
      error: "Missing turnstileToken"
    };
  }

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token.trim());

  const ip = resolveClientIp(request);
  if (ip !== "unknown") {
    form.set("remoteip", ip);
  }

  let verifyResponse: Response;
  try {
    verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Unable to reach Turnstile verification endpoint"
    };
  }

  if (!verifyResponse.ok) {
    return {
      ok: false,
      status: 502,
      error: `Turnstile verification endpoint returned ${verifyResponse.status}`
    };
  }

  let verification: TurnstileVerificationResponse;
  try {
    verification = (await verifyResponse.json()) as TurnstileVerificationResponse;
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Invalid Turnstile verification response"
    };
  }

  if (!verification.success) {
    return {
      ok: false,
      status: 400,
      error: "Turnstile verification failed",
      details: verification["error-codes"]
    };
  }

  const expectedHostname = env.TURNSTILE_EXPECTED_HOSTNAME?.trim();
  if (expectedHostname && verification.hostname !== expectedHostname) {
    return {
      ok: false,
      status: 400,
      error: "Turnstile hostname mismatch",
      details: verification.hostname ? [verification.hostname] : undefined
    };
  }

  return { ok: true };
}

async function sendViaResend(env: Env, payload: EmailPayload, replyTo?: string): Promise<Response> {
  const from = env.SUPPORT_EMAIL_FROM?.trim() || "TamemJ Support <tickets@tamemj.com>";
  const to = env.SUPPORT_EMAIL_TO?.trim() || payload.to;

  const resendBody: Record<string, unknown> = {
    from,
    to: [to],
    subject: payload.subject,
    text: payload.text
  };

  if (replyTo && isValidEmail(replyTo)) {
    resendBody.reply_to = [replyTo.trim()];
  }

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resendBody)
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = resolveAllowedOrigin(request, env);

    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true }, 200, origin.responseOrigin);
    }

    if (!origin.allowed) {
      return jsonResponse({ error: "Origin not allowed" }, 403, origin.responseOrigin);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin.responseOrigin);
    }

    const rateLimitResult = await enforceRateLimit(request, env);
    if (!rateLimitResult.ok) {
      return jsonResponse({ error: rateLimitResult.error }, rateLimitResult.status, origin.responseOrigin);
    }

    if (!env.RESEND_API_KEY?.trim()) {
      return jsonResponse({ error: "Missing RESEND_API_KEY secret" }, 500, origin.responseOrigin);
    }

    let payload: TicketEmailRequest;

    try {
      payload = (await request.json()) as TicketEmailRequest;
    } catch {
      return jsonResponse({ error: "Invalid JSON payload" }, 400, origin.responseOrigin);
    }

    const email = payload.email;

    if (!email || typeof email.to !== "string" || typeof email.subject !== "string" || typeof email.text !== "string") {
      return jsonResponse({ error: "Missing email payload fields" }, 400, origin.responseOrigin);
    }

    if (!isValidEmail(email.to)) {
      return jsonResponse({ error: "Invalid recipient email format" }, 400, origin.responseOrigin);
    }

    const turnstile = await verifyTurnstile(payload.turnstileToken ?? "", request, env);
    if (!turnstile.ok) {
      return jsonResponse(
        {
          error: turnstile.error,
          details: turnstile.details ?? null
        },
        turnstile.status,
        origin.responseOrigin
      );
    }

    const resendResponse = await sendViaResend(env, email, payload.ticket?.requesterEmail);

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      return jsonResponse(
        {
          error: `Resend API error: ${resendResponse.status}`,
          details
        },
        502,
        origin.responseOrigin
      );
    }

    return jsonResponse(
      {
        ok: true,
        message: "Support ticket email sent",
        ticketId: payload.ticket?.id ?? null,
        source: payload.source ?? "support-portal"
      },
      200,
      origin.responseOrigin
    );
  }
};
