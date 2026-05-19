import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { contactSchema } from "./lib/validations";
import { sendWhatsAppMessage } from "./lib/whatsapp";

const app = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ────────────────────────────────────────────────── */
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

/* ── Rate limiter: max 5 submissions per 15 min per IP ─────────── */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please wait 15 minutes before trying again.",
  },
});

/* ── Anti-spam: honeypot + keyword filter ──────────────────────── */
const spamKeywords = ["casino", "crypto", "bitcoin", "loan", "prize", "winner", "click here", "buy now"];

function isSpam(data: Record<string, string>): boolean {
  const combined = Object.values(data).join(" ").toLowerCase();
  return spamKeywords.some((kw) => combined.includes(kw));
}

/* ── POST /api/contact ─────────────────────────────────────────── */
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    /* 1. Honeypot check */
    if (req.body._honeypot) {
      return res.status(400).json({ success: false, error: "Bot detected." });
    }

    /* 2. Zod validation */
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return res.status(422).json({ success: false, errors: fieldErrors });
    }

    /* 3. Spam filter */
    if (isSpam(result.data as Record<string, string>)) {
      return res.status(400).json({ success: false, error: "Message flagged as spam." });
    }

    /* 4. Send WhatsApp */
    await sendWhatsAppMessage(result.data);

    return res.status(200).json({
      success: true,
      message: "Message sent! You will receive a reply on WhatsApp shortly.",
    });
  } catch (err: unknown) {
    console.error("[Contact API Error]", err);

    const isTwilioError =
      err instanceof Error && err.message.includes("Twilio");

    return res.status(500).json({
      success: false,
      error: isTwilioError
        ? "Failed to send WhatsApp message. Please try emailing directly."
        : "Server error. Please try again.",
    });
  }
});

/* ── Health check ──────────────────────────────────────────────── */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio API running at http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log(`   GET  http://localhost:${PORT}/api/health\n`);
});
