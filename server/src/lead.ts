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
const routePath = "/api/lead";
const rateWindowSeconds = 10 * 60;
const maxRequestsPerWindow = 5;
const allowedLeadTables = new Set(["leads", "leads_demo", "leads_dev"]);

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  company: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(1).max(2000),
  website: z.string().trim().max(200).optional().default(""),
  turnstileToken: z.string().trim().min(1),
});

function resolveLeadTargetTable() {
  const configuredTable = process.env.LEADS_TARGET_TABLE?.trim();
  if (configuredTable) {
    if (!allowedLeadTables.has(configuredTable)) {
      return { ok: false as const, error: "invalid_target_table" as const };
    }

    return { ok: true as const, value: configuredTable };
  }

  if (process.env.VITE_DEMO_MODE === "true") {
    return { ok: true as const, value: "leads_demo" };
  }

  return { ok: true as const, value: "leads" };
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return { supabaseUrl, serviceRoleKey };
}

router.post("/", async (req, res) => {
  const requestId = getRequestId(req.headers["x-request-id"]);
  const ip = extractRequestIp(req);
  const ipHash = hashIdentifier(ip);
  const isProduction = process.env.NODE_ENV === "production";

  const parsed = LeadSchema.safeParse(req.body);
  if (!parsed.success) {
    logSecurityEvent("warn", routePath, 400, "validation_error", requestId, ipHash);
    return res.status(400).json({ error: "validation_error" });
  }

  const rateLimit = await enforceRateLimit({
    key: `lead:${ipHash}`,
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

  const requestHost = Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host;
  const turnstileResult = await verifyTurnstileToken(
    parsed.data.turnstileToken,
    ip,
    requestHost || ""
  );
  if (!turnstileResult.ok) {
    const statusCode = turnstileResult.reason === "service_unavailable" ? 503 : 403;
    logSecurityEvent("warn", routePath, statusCode, turnstileResult.reason, requestId, ipHash);
    return res.status(statusCode).json({ error: turnstileResult.reason });
  }

  const targetTableResult = resolveLeadTargetTable();
  if (!targetTableResult.ok) {
    logSecurityEvent("error", routePath, 503, targetTableResult.error, requestId, ipHash);
    return res.status(503).json({ error: "service_unavailable" });
  }

  const supabase = getSupabaseConfig();
  if (!supabase) {
    logSecurityEvent("error", routePath, 503, "service_unavailable", requestId, ipHash);
    return res.status(503).json({ error: "service_unavailable" });
  }

  try {
    const response = await fetch(
      `${supabase.supabaseUrl.replace(/\/+$/, "")}/rest/v1/${targetTableResult.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabase.serviceRoleKey,
          Authorization: `Bearer ${supabase.serviceRoleKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          company: parsed.data.company || "",
          message: parsed.data.message,
          source: "landing-page",
          status: "new",
        }),
      }
    );

    if (!response.ok) {
      logSecurityEvent("error", routePath, 500, "internal_error", requestId, ipHash);
      return res.status(500).json({ error: "internal_error" });
    }

    logSecurityEvent("info", routePath, 200, "ok", requestId, ipHash);
    return res.status(200).json({ ok: true });
  } catch {
    logSecurityEvent("error", routePath, 500, "internal_error", requestId, ipHash);
    return res.status(500).json({ error: "internal_error" });
  }
});

export default router;
