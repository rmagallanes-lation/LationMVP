import { createHash, randomUUID } from "node:crypto";
import type { Request } from "express";

type LogLevel = "info" | "warn" | "error";

const defaultAllowedOrigins = ["https://lation.com.mx", "https://www.lation.com.mx"];
const developmentLimiter = new Map<string, { count: number; expiresAt: number }>();
const defaultTurnstileAction = "contact_form";
const defaultTurnstileTimeoutMs = 5000;

export function getAllowedOrigins(rawValue: string | undefined): Set<string> {
  if (!rawValue) return new Set(defaultAllowedOrigins);
  const parsed = rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (parsed.length === 0) {
    return new Set(defaultAllowedOrigins);
  }

  return new Set(parsed);
}

function parseCsv(rawValue: string | undefined): string[] {
  if (!rawValue) return [];
  return rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeHostname(value: string): string {
  let candidate = value.trim();
  if (!candidate) return "";
  if (!candidate.includes("://")) {
    candidate = `https://${candidate}`;
  }

  try {
    return new URL(candidate).hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return "";
  }
}

function resolveTurnstileExpectedAction(): string {
  return process.env.CF_TURNSTILE_EXPECTED_ACTION?.trim() || defaultTurnstileAction;
}

function resolveTurnstileTimeoutMs(): number {
  const raw = Number(process.env.CF_TURNSTILE_VERIFY_TIMEOUT_MS);
  if (!Number.isFinite(raw)) return defaultTurnstileTimeoutMs;
  return Math.min(Math.max(raw, 1000), 15000);
}

function resolveTurnstileHostnames(requestHost: string): string[] {
  const explicit = parseCsv(process.env.CF_TURNSTILE_ALLOWED_HOSTNAMES)
    .map((value) => normalizeHostname(value))
    .filter(Boolean);
  if (explicit.length > 0) {
    return explicit;
  }

  const configuredOrigins = getAllowedOrigins(
    process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL
  );
  const hostnames = Array.from(configuredOrigins)
    .map((origin) => normalizeHostname(origin))
    .filter(Boolean);

  const requestHostname = normalizeHostname(requestHost || "");
  if (requestHostname) {
    hostnames.push(requestHostname);
  }

  if (process.env.NODE_ENV !== "production") {
    hostnames.push("localhost", "127.0.0.1");
  }

  return [...new Set(hostnames)];
}

export function extractRequestIp(req: Request): string {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor.length > 0) {
    return xForwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
    return xForwardedFor[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "";
}

export function hashIdentifier(value: string): string {
  if (!value) return "unknown";
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

export function getRequestId(headerValue: string | string[] | undefined): string {
  if (typeof headerValue === "string" && headerValue.length > 0) {
    return headerValue.slice(0, 64);
  }
  return randomUUID();
}

export function logSecurityEvent(
  level: LogLevel,
  route: string,
  status: number,
  code: string,
  requestId: string,
  ipHash: string
): void {
  const payload = {
    timestamp: new Date().toISOString(),
    request_id: requestId,
    route,
    status,
    code,
    ip_hash: ipHash,
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

type RateLimitResult = {
  ok: boolean;
  retryAfter: number;
  error?: "service_unavailable";
};

async function checkUpstashLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    return null;
  }

  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["TTL", key],
      ["EXPIRE", key, windowSeconds, "NX"],
    ]),
  });

  if (!response.ok) {
    throw new Error("upstash_error");
  }

  const results = await response.json();
  const count = Number(results?.[0]?.result ?? 0);
  let ttl = Number(results?.[1]?.result ?? windowSeconds);
  if (!Number.isFinite(ttl) || ttl < 0) {
    ttl = windowSeconds;
  }

  return {
    ok: count <= limit,
    retryAfter: ttl,
  };
}

function checkDevelopmentLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = developmentLimiter.get(key);

  if (!record || now > record.expiresAt) {
    developmentLimiter.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true, retryAfter: windowSeconds };
  }

  record.count += 1;
  developmentLimiter.set(key, record);

  const retryAfter = Math.max(Math.ceil((record.expiresAt - now) / 1000), 1);
  return {
    ok: record.count <= limit,
    retryAfter,
  };
}

export async function enforceRateLimit(params: {
  key: string;
  limit: number;
  windowSeconds: number;
  isProduction: boolean;
}): Promise<RateLimitResult> {
  try {
    const upstashResult = await checkUpstashLimit(
      params.key,
      params.limit,
      params.windowSeconds
    );
    if (upstashResult !== null) {
      return upstashResult;
    }

    if (params.isProduction) {
      return {
        ok: false,
        error: "service_unavailable",
        retryAfter: params.windowSeconds,
      };
    }

    return checkDevelopmentLimit(params.key, params.limit, params.windowSeconds);
  } catch {
    if (params.isProduction) {
      return {
        ok: false,
        error: "service_unavailable",
        retryAfter: params.windowSeconds,
      };
    }

    return checkDevelopmentLimit(params.key, params.limit, params.windowSeconds);
  }
}

export async function verifyTurnstileToken(token: string, ip: string, requestHost = "") {
  const secret = process.env.CF_TURNSTILE_SECRET?.trim();
  if (!secret) {
    return { ok: false, reason: "service_unavailable" as const };
  }

  const expectedAction = resolveTurnstileExpectedAction();
  const expectedHostnames = resolveTurnstileHostnames(requestHost);
  const timeoutMs = resolveTurnstileTimeoutMs();
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);

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
      signal: abortController.signal,
    });

    if (!response.ok) {
      return { ok: false, reason: "service_unavailable" as const };
    }

    const parsed = await response.json();
    if (parsed?.success !== true) {
      return { ok: false, reason: "bot_verification_failed" as const };
    }

    const action = typeof parsed.action === "string" ? parsed.action.trim() : "";
    if (expectedAction && action !== expectedAction) {
      return { ok: false, reason: "invalid_turnstile_action" as const };
    }

    const hostname = normalizeHostname(
      typeof parsed.hostname === "string" ? parsed.hostname : ""
    );
    if (expectedHostnames.length > 0 && (!hostname || !expectedHostnames.includes(hostname))) {
      return { ok: false, reason: "invalid_turnstile_hostname" as const };
    }

    return { ok: true as const };
  } catch {
    return { ok: false, reason: "service_unavailable" as const };
  } finally {
    clearTimeout(timeout);
  }
}
