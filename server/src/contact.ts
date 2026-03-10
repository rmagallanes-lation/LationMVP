import { Router } from "express";
import { z } from "zod";
import {
  enforceRateLimit,
  extractRequestIp,
  getRequestId,
  hashIdentifier,
  logSecurityEvent,
  verifyTurnstileToken,
} from "./security";

const router = Router();
const routePath = "/api/contact";
const rateWindowSeconds = 10 * 60;
const maxRequestsPerWindow = 5;

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  company: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(1).max(2000),
  website: z.string().trim().max(200).optional().default(""),
  turnstileToken: z.string().trim().min(1),
});

router.post("/", async (req, res) => {
  const requestId = getRequestId(req.headers["x-request-id"]);
  const ip = extractRequestIp(req);
  const ipHash = hashIdentifier(ip);
  const isProduction = process.env.NODE_ENV === "production";

  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    logSecurityEvent("warn", routePath, 400, "validation_error", requestId, ipHash);
    return res.status(400).json({ error: "validation_error" });
  }

  const rateLimit = await enforceRateLimit({
    key: `contact:${ipHash}`,
    limit: maxRequestsPerWindow,
    windowSeconds: rateWindowSeconds,
    isProduction,
  });

  if (!rateLimit.ok) {
    const statusCode = rateLimit.error === "service_unavailable" ? 503 : 429;
    const errorCode = rateLimit.error || "rate_limited";
    res.setHeader("Retry-After", String(rateLimit.retryAfter ?? rateWindowSeconds));
    logSecurityEvent("warn", routePath, statusCode, errorCode, requestId, ipHash);
    return res.status(statusCode).json({ error: errorCode });
  }

  if (parsed.data.website) {
    logSecurityEvent("info", routePath, 200, "ok", requestId, ipHash);
    return res.status(200).json({ ok: true });
  }

  const turnstileResult = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileResult.ok) {
    const statusCode = turnstileResult.reason === "service_unavailable" ? 503 : 403;
    logSecurityEvent("warn", routePath, statusCode, turnstileResult.reason, requestId, ipHash);
    return res.status(statusCode).json({ error: turnstileResult.reason });
  }

  const n8nUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678";
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;
  const timeoutMs = 5000;
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(n8nSecret ? { "x-form-secret": n8nSecret } : {}),
      },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || "",
        message: parsed.data.message,
      }),
      signal: abortController.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      logSecurityEvent("error", routePath, 502, "upstream_error", requestId, ipHash);
      return res.status(502).json({ error: "service_unavailable" });
    }

    logSecurityEvent("info", routePath, 200, "ok", requestId, ipHash);
    return res.status(200).json({ ok: true });
  } catch {
    clearTimeout(timeout);
    logSecurityEvent("error", routePath, 502, "upstream_error", requestId, ipHash);
    return res.status(502).json({ error: "service_unavailable" });
  }
});

export default router;

