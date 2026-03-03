import { Resend } from "resend";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parsePayload(body) {
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return { error: "invalid_payload" };
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "invalid_payload" };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) return { error: "name_required" };
  if (!email || !isValidEmail(email)) return { error: "email_invalid" };
  if (!message) return { error: "message_required" };

  return { name, email, company, message };
}

function parseRecipients(value) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const missingEnv = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_NOTIFICATION_TO"].filter(
    (key) => !process.env[key]
  );

  if (missingEnv.length > 0) {
    console.warn("send-notification misconfigured", { missing: missingEnv.join(",") });
    return res.status(503).json({ error: "service_unavailable" });
  }

  const recipients = parseRecipients(process.env.RESEND_NOTIFICATION_TO);
  if (recipients.length === 0) {
    console.warn("send-notification misconfigured", { missing: "RESEND_NOTIFICATION_TO recipients" });
    return res.status(503).json({ error: "service_unavailable" });
  }

  const parsed = parsePayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const submittedAt = new Date().toISOString();
    const safeName = escapeHtml(parsed.name);
    const safeEmail = escapeHtml(parsed.email);
    const safeCompany = parsed.company ? escapeHtml(parsed.company) : "No company";
    const safeMessage = escapeHtml(parsed.message);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: recipients,
      subject: `New Lead: ${parsed.name} (${parsed.company || "No company"})`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Message:</strong> ${safeMessage}</p>
        <p><strong>Source:</strong> landing-page</p>
        <p><strong>Timestamp:</strong> ${submittedAt}</p>
      `,
    });

    if (error) {
      console.error("send-notification provider error", { message: error.message, name: error.name });
      return res.status(500).json({ error: "notification_failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    console.error("send-notification unexpected error", { message });
    return res.status(500).json({ error: "internal_error" });
  }
}
