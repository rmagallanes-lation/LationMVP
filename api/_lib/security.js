import { createHash, randomUUID } from "node:crypto";

const MAX_BODY_BYTES = 10 * 1024;
const DEFAULT_ALLOWED_ORIGINS = [
  "https://lation.com.mx",
  "https://www.lation.com.mx",
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseAllowedOrigins(rawValue) {
  if (!rawValue) return DEFAULT_ALLOWED_ORIGINS;
  const values = rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return values.length > 0 ? values : DEFAULT_ALLOWED_ORIGINS;
}

export function getAllowedOrigins() {
  return parseAllowedOrigins(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL);
}

export function isAllowedOrigin(origin, allowedOrigins, isProduction) {
  if (!origin) return !isProduction;
  return allowedOrigins.includes(origin);
}

export function getClientIp(req) {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor.length > 0) {
    return xForwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
    return xForwardedFor[0].trim();
  }

  return (
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    ""
  );
}

function hashValue(value) {
  if (!value) return "unknown";
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

export function createRequestContext(req, route) {
  const headerRequestId = req.headers["x-request-id"];
  const requestId =
    typeof headerRequestId === "string" && headerRequestId.length > 0
      ? headerRequestId.slice(0, 64)
      : randomUUID();
  const ip = getClientIp(req);

  return {
    requestId,
    route,
    ip,
    ipHash: hashValue(ip),
  };
}

export function logEvent(level, context, status, code) {
  const payload = {
    timestamp: new Date().toISOString(),
    request_id: context.requestId,
    route: context.route,
    status,
    code,
    ip_hash: context.ipHash,
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.info(JSON.stringify(payload));
}

export function isRequestBodyWithinLimit(req, maxBytes = MAX_BODY_BYTES) {
  const rawContentLength = req.headers["content-length"];
  const contentLength = Number(rawContentLength);
  return !Number.isFinite(contentLength) || contentLength <= maxBytes;
}

export function validateLeadPayload(rawBody) {
  let body = rawBody;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return { ok: false };
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const turnstileToken =
    typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";

  if (!name || name.length > 100) return { ok: false };
  if (!email || !emailRegex.test(email)) return { ok: false };
  if (company.length > 100) return { ok: false };
  if (!message || message.length > 2000) return { ok: false };
  if (!turnstileToken) return { ok: false };
  if (website.length > 200) return { ok: false };

  return {
    ok: true,
    value: {
      name,
      email,
      company: company || null,
      message,
      website,
      turnstileToken,
    },
  };
}

export async function verifyTurnstileToken(token, ip) {
  const secret = process.env.CF_TURNSTILE_SECRET?.trim();
  if (!secret) {
    return { ok: false, reason: "service_unavailable" };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    if (ip) {
      body.set("remoteip", ip);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });

    if (!response.ok) {
      return { ok: false, reason: "service_unavailable" };
    }

    const parsed = await response.json();
    if (parsed?.success === true) {
      return { ok: true };
    }

    return { ok: false, reason: "bot_verification_failed" };
  } catch {
    return { ok: false, reason: "service_unavailable" };
  }
}

