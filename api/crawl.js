import { timingSafeEqual } from "node:crypto";
import { createRequestContext, isRequestBodyWithinLimit, logEvent } from "./_lib/security.js";

const ROUTE_PATH = "/api/crawl";
const DEFAULT_LIMIT = 25;
const DEFAULT_MAX_DEPTH = 2;
const DEFAULT_OUTPUT_FORMAT = "markdown";
const MAX_LIMIT = 1000;
const MAX_DEPTH = 10;
const VALID_FORMATS = new Set(["markdown", "html", "json"]);

function getHeaderValue(value) {
  if (Array.isArray(value)) return value[0] || "";
  return typeof value === "string" ? value : "";
}

function secureEquals(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseBody(rawBody) {
  if (!rawBody) return null;
  if (typeof rawBody === "object" && !Array.isArray(rawBody)) return rawBody;
  if (typeof rawBody !== "string") return null;

  try {
    const parsed = JSON.parse(rawBody);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function clampInteger(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(Math.trunc(number), min), max);
}

function isPrivateIpv4(hostname) {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return false;
  const [a, b] = hostname.split(".").map((part) => Number(part));
  if ([a, b].some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isBlockedHostname(hostname) {
  const host = hostname.toLowerCase();
  if (!host) return true;
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return true;
  }

  if (isPrivateIpv4(host)) return true;
  if (host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) return true;

  return false;
}

function validateTargetUrl(rawUrl) {
  if (typeof rawUrl !== "string") {
    return { ok: false, error: "validation_error" };
  }

  const url = rawUrl.trim();
  if (!url) {
    return { ok: false, error: "validation_error" };
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "validation_error" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, error: "validation_error" };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: "validation_error" };
  }

  if (isBlockedHostname(parsed.hostname)) {
    return { ok: false, error: "private_network_target" };
  }

  return { ok: true, value: parsed.toString() };
}

function validateCreatePayload(rawBody) {
  const body = parseBody(rawBody);
  if (!body) {
    return { ok: false, error: "validation_error" };
  }

  const targetUrl = validateTargetUrl(body.url);
  if (!targetUrl.ok) {
    return targetUrl;
  }

  const outputFormatRaw =
    typeof body.outputFormat === "string" ? body.outputFormat.trim().toLowerCase() : "";
  const outputFormat = outputFormatRaw || DEFAULT_OUTPUT_FORMAT;
  if (!VALID_FORMATS.has(outputFormat)) {
    return { ok: false, error: "validation_error" };
  }

  return {
    ok: true,
    value: {
      url: targetUrl.value,
      limit: clampInteger(body.limit, 1, MAX_LIMIT, DEFAULT_LIMIT),
      maxDepth: clampInteger(body.maxDepth, 1, MAX_DEPTH, DEFAULT_MAX_DEPTH),
      outputFormat,
    },
  };
}

function getInternalApiKeyStatus(req) {
  const expectedApiKey = process.env.INTERNAL_CRAWL_API_KEY?.trim();
  if (!expectedApiKey) {
    return { ok: false, status: 503, error: "service_unavailable" };
  }

  const providedApiKey = getHeaderValue(req.headers["x-internal-api-key"]).trim();
  if (!providedApiKey || !secureEquals(providedApiKey, expectedApiKey)) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  return { ok: true };
}

function getCloudflareConfig() {
  const accountId = process.env.CF_BROWSER_RENDERING_ACCOUNT_ID?.trim();
  const apiToken = process.env.CF_BROWSER_RENDERING_API_TOKEN?.trim();
  if (!accountId || !apiToken) {
    return null;
  }

  return { accountId, apiToken };
}

function normalizeCrawlResult(jobId, upstreamResult) {
  const records = Array.isArray(upstreamResult?.records)
    ? upstreamResult.records.map((record) => ({
        url: typeof record?.url === "string" ? record.url : "",
        status: typeof record?.status === "string" ? record.status : "",
        title:
          typeof record?.metadata?.title === "string"
            ? record.metadata.title
            : typeof record?.title === "string"
              ? record.title
              : "",
        httpStatus:
          typeof record?.metadata?.status === "number"
            ? record.metadata.status
            : typeof record?.statusCode === "number"
              ? record.statusCode
              : null,
      }))
    : [];

  return {
    jobId,
    status: typeof upstreamResult?.status === "string" ? upstreamResult.status : "unknown",
    total: typeof upstreamResult?.total === "number" ? upstreamResult.total : null,
    finished: typeof upstreamResult?.finished === "number" ? upstreamResult.finished : null,
    cursor: typeof upstreamResult?.cursor === "string" ? upstreamResult.cursor : null,
    records,
  };
}

async function createCrawlJob(req, res, context) {
  if (!isRequestBodyWithinLimit(req, 25 * 1024)) {
    logEvent("warn", context, 400, "validation_error");
    return res.status(400).json({ error: "validation_error" });
  }

  const parsed = validateCreatePayload(req.body);
  if (!parsed.ok) {
    logEvent("warn", context, 400, parsed.error);
    return res.status(400).json({ error: parsed.error });
  }

  const cloudflare = getCloudflareConfig();
  if (!cloudflare) {
    logEvent("error", context, 503, "service_unavailable");
    return res.status(503).json({ error: "service_unavailable" });
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}/browser-rendering/crawl`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cloudflare.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: parsed.value.url,
          limit: parsed.value.limit,
          depth: parsed.value.maxDepth,
          formats: [parsed.value.outputFormat],
        }),
      }
    );

    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success !== true || typeof payload?.result !== "string") {
      logEvent("error", context, 502, "upstream_error");
      return res.status(502).json({ error: "upstream_error" });
    }

    const jobId = payload.result;
    logEvent("info", context, 202, "accepted");
    return res.status(202).json({
      jobId,
      status: "queued",
      pollUrl: `${ROUTE_PATH}?jobId=${encodeURIComponent(jobId)}`,
    });
  } catch {
    logEvent("error", context, 503, "service_unavailable");
    return res.status(503).json({ error: "service_unavailable" });
  }
}

async function getCrawlJob(req, res, context) {
  const jobId = typeof req.query.jobId === "string" ? req.query.jobId.trim() : "";
  if (!jobId) {
    logEvent("warn", context, 400, "validation_error");
    return res.status(400).json({ error: "validation_error" });
  }

  const cloudflare = getCloudflareConfig();
  if (!cloudflare) {
    logEvent("error", context, 503, "service_unavailable");
    return res.status(503).json({ error: "service_unavailable" });
  }

  const cursor =
    typeof req.query.cursor === "string" && req.query.cursor.trim() ? req.query.cursor.trim() : "";
  const limit =
    typeof req.query.limit === "string" && req.query.limit.trim()
      ? clampInteger(req.query.limit, 1, MAX_LIMIT, DEFAULT_LIMIT)
      : DEFAULT_LIMIT;
  const statusFilter =
    typeof req.query.status === "string" && req.query.status.trim() ? req.query.status.trim() : "";

  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  query.set("limit", String(limit));
  if (statusFilter) query.set("status", statusFilter);

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}/browser-rendering/crawl/${encodeURIComponent(jobId)}?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cloudflare.apiToken}`,
        },
      }
    );

    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success !== true || typeof payload?.result !== "object") {
      logEvent("error", context, 502, "upstream_error");
      return res.status(502).json({ error: "upstream_error" });
    }

    const normalized = normalizeCrawlResult(jobId, payload.result);
    logEvent("info", context, 200, "ok");
    return res.status(200).json({
      ...normalized,
      pollUrl: `${ROUTE_PATH}?jobId=${encodeURIComponent(jobId)}`,
    });
  } catch {
    logEvent("error", context, 503, "service_unavailable");
    return res.status(503).json({ error: "service_unavailable" });
  }
}

export default async function handler(req, res) {
  const context = createRequestContext(req, ROUTE_PATH);
  const auth = getInternalApiKeyStatus(req);
  if (!auth.ok) {
    logEvent("warn", context, auth.status, auth.error);
    return res.status(auth.status).json({ error: auth.error });
  }

  if (req.method === "POST") {
    return createCrawlJob(req, res, context);
  }

  if (req.method === "GET") {
    return getCrawlJob(req, res, context);
  }

  res.setHeader("Allow", "GET, POST");
  logEvent("warn", context, 405, "method_not_allowed");
  return res.status(405).json({ error: "method_not_allowed" });
}
