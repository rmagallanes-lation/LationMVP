import { Resend } from "resend";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseRecipients(value) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function resolveLeadSubjectPrefix() {
  const targetTable = process.env.LEADS_TARGET_TABLE?.trim();
  if (targetTable === "leads_dev") return "[DEV] ";
  if (targetTable === "leads_demo" || process.env.VITE_DEMO_MODE === "true") return "[DEMO] ";
  return "";
}

export async function sendLeadNotification(payload, requestId) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const recipientsRaw = process.env.RESEND_NOTIFICATION_TO?.trim();

  if (!apiKey || !fromEmail || !recipientsRaw) {
    return;
  }

  const recipients = parseRecipients(recipientsRaw);
  if (recipients.length === 0) {
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const safeName = escapeHtml(payload.name);
    const safeEmail = escapeHtml(payload.email);
    const safeCompany = payload.company ? escapeHtml(payload.company) : "No company";
    const safeMessage = escapeHtml(payload.message);
    const subjectPrefix = resolveLeadSubjectPrefix();

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `${subjectPrefix}New Lead: ${payload.name} (${payload.company || "No company"})`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Message:</strong> ${safeMessage}</p>
        <p><strong>Source:</strong> landing-page</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
    });

    if (error) {
      console.warn(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          request_id: requestId,
          route: "/api/lead",
          status: 200,
          code: "notification_failed",
        })
      );
    }
  } catch {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        request_id: requestId,
        route: "/api/lead",
        status: 200,
        code: "notification_failed",
      })
    );
  }
}
