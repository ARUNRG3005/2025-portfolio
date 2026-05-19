import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";
import { z } from "zod";

/* ── Zod schema ─────────────────────────────────────────────────── */
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters"),
  email: z.string().email("Invalid email address").max(120).toLowerCase(),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
  projectType: z
    .enum(["Web App", "Mobile App", "UI/UX Design", "API/Backend", "Data Analytics", "Other", ""])
    .optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent", ""]).optional(),
  _honeypot: z.string().max(0).optional(),
});

/* ── Sanitize helper ────────────────────────────────────────────── */
function sanitize(text: string): string {
  return text.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim();
}

/* ── Spam keywords ──────────────────────────────────────────────── */
const spamKeywords = ["casino", "crypto", "bitcoin", "loan", "prize", "winner", "click here", "buy now"];
function isSpam(data: Record<string, string>): boolean {
  const combined = Object.values(data).join(" ").toLowerCase();
  return spamKeywords.some((kw) => combined.includes(kw));
}

/* ── Rate limit store (in-memory, resets per function cold start) ── */
const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

/* ── Vercel Serverless Handler ──────────────────────────────────── */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  /* Only allow POST */
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  /* CORS headers */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ?? "unknown";

  try {
    /* 1. Rate limit */
    if (isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please wait 15 minutes before trying again.",
      });
    }

    /* 2. Honeypot */
    if (req.body?._honeypot) {
      return res.status(400).json({ success: false, error: "Bot detected." });
    }

    /* 3. Zod validation */
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ success: false, errors: result.error.flatten().fieldErrors });
    }

    /* 4. Spam filter */
    if (isSpam(result.data as Record<string, string>)) {
      return res.status(400).json({ success: false, error: "Message flagged as spam." });
    }

    /* 5. Twilio credentials */
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    const toNumber = process.env.ADMIN_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      throw new Error("Twilio credentials not configured.");
    }

    /* 6. Build message */
    const data = result.data;
    const priorityEmoji: Record<string, string> = { Low: "🟢", Medium: "🟡", High: "🟠", Urgent: "🔴" };
    const projectEmoji: Record<string, string> = {
      "Web App": "🌐", "Mobile App": "📱", "UI/UX Design": "🎨",
      "API/Backend": "⚙️", "Data Analytics": "📊", Other: "📦",
    };

    const priority =
      data.priority && data.priority !== ""
        ? `\n${priorityEmoji[data.priority] || "⚪"} Priority: *${sanitize(data.priority)}*`
        : "";

    const projectType =
      data.projectType && data.projectType !== ""
        ? `\n${projectEmoji[data.projectType] || "📦"} Project Type: *${sanitize(data.projectType)}*`
        : "";

    const messageBody = `📩 *New Portfolio Message*

👤 Name: *${sanitize(data.name)}*
📧 Email: *${sanitize(data.email)}*
📝 Subject: *${sanitize(data.subject)}*${priority}${projectType}

💬 *Message:*
${sanitize(data.message)}

🌐 _Sent from Portfolio Website_
⏰ _${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST_`;

    /* 7. Send via Twilio */
    const client = twilio(accountSid, authToken);
    await client.messages.create({ from: fromNumber, to: toNumber, body: messageBody });

    return res.status(200).json({
      success: true,
      message: "Message sent! You will receive a reply on WhatsApp shortly.",
    });
  } catch (err: unknown) {
    console.error("[Contact API Error]", err);
    const isTwilio = err instanceof Error && err.message.includes("Twilio");
    return res.status(500).json({
      success: false,
      error: isTwilio
        ? "Failed to send WhatsApp message. Please try emailing directly."
        : "Server error. Please try again.",
    });
  }
}
