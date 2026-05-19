import twilio from "twilio";
import type { ContactFormData } from "./validations";

function sanitize(text: string): string {
  return text
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export async function sendWhatsAppMessage(data: ContactFormData): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  const toNumber = process.env.ADMIN_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    throw new Error(
      "Twilio credentials are not configured. Please fill in api/.env with your Twilio credentials."
    );
  }

  /* Lazy init — only create client when actually sending */
  const client = twilio(accountSid, authToken);

  const priorityEmoji: Record<string, string> = {
    Low: "🟢", Medium: "🟡", High: "🟠", Urgent: "🔴",
  };
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

  await client.messages.create({
    from: fromNumber,
    to: toNumber,
    body: messageBody,
  });
}
