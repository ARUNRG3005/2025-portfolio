import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast, Toaster } from "sonner"

/* ── Zod schema (client-side mirror) ─────────────────────────── */
const contactSchema = z.object({
  name: z.string().min(2, "At least 2 characters").max(80),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "At least 3 characters").max(120),
  message: z.string().min(10, "At least 10 characters").max(2000),
  projectType: z.string().optional(),
  priority: z.string().optional(),
  _honeypot: z.string().max(0).optional(), // anti-bot
})

type FormValues = z.infer<typeof contactSchema>

const PROJECT_TYPES = ["Web App", "Mobile App", "UI/UX Design", "API/Backend", "Data Analytics", "Other"]
const PRIORITIES = ["Low", "Medium", "High", "Urgent"]

const PRIORITY_COLORS: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#f97316",
  Urgent: "#ef4444",
}

/* ── Reusable field wrapper ─────────────────────────────────── */
function Field({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--foreground)", letterSpacing: "0.03em" }}>
        {label}
      </label>
      {children}
      {hint && !error && <p style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}>{hint}</p>}
      {error && (
        <p style={{ fontSize: "0.72rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </p>
      )}
    </div>
  )
}

/* ── Shared input style ─────────────────────────────────────── */
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "0.65rem 0.9rem",
    fontSize: "0.9rem",
    background: "var(--card)",
    border: `1.5px solid ${hasError ? "#ef4444" : "var(--border)"}`,
    borderRadius: "0.6rem",
    color: "var(--foreground)",
    outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
    fontFamily: "inherit",
  }
}

function focusStyle(color = "hsl(217,91%,60%)") {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = color
      e.target.style.boxShadow = `0 0 0 3px ${color}22`
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = "var(--border)"
      e.target.style.boxShadow = "none"
    },
  }
}

/* ── Main component ─────────────────────────────────────────── */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
  })

  const priority = watch("priority")
  const messageLen = watch("message")?.length ?? 0

  async function onSubmit(data: FormValues) {
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Something went wrong")
      }
      setStatus("success")
      reset()
      toast.success("Message sent to WhatsApp! 🎉", {
        description: "Arun will reply to you shortly.",
        duration: 5000,
      })
    } catch (err: unknown) {
      setStatus("idle")
      toast.error("Failed to send message", {
        description: err instanceof Error ? err.message : "Please try again or email directly.",
        duration: 6000,
      })
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          },
        }}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
      >
        {/* Honeypot — hidden, bots fill this */}
        <input type="text" {...register("_honeypot")} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        {/* Row: Name + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Full Name *" error={errors.name?.message}>
            <input
              type="text"
              placeholder="Arun R G"
              style={inputStyle(!!errors.name)}
              {...register("name")}
              {...focusStyle()}
            />
          </Field>
          <Field label="Email Address *" error={errors.email?.message}>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle(!!errors.email)}
              {...register("email")}
              {...focusStyle()}
            />
          </Field>
        </div>

        {/* Subject */}
        <Field label="Subject *" error={errors.subject?.message}>
          <input
            type="text"
            placeholder="Project inquiry, collaboration, etc."
            style={inputStyle(!!errors.subject)}
            {...register("subject")}
            {...focusStyle()}
          />
        </Field>

        {/* Row: Project Type + Priority */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Project Type" error={errors.projectType?.message}>
            <select
              style={{ ...inputStyle(false), cursor: "pointer", appearance: "none" }}
              {...register("projectType")}
              {...focusStyle()}
            >
              <option value="">Select type…</option>
              {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select
              style={{
                ...inputStyle(false),
                cursor: "pointer",
                appearance: "none",
                color: priority && PRIORITY_COLORS[priority] ? PRIORITY_COLORS[priority] : "var(--foreground)",
                fontWeight: priority ? 600 : 400,
              }}
              {...register("priority")}
              {...focusStyle()}
            >
              <option value="">Select priority…</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        {/* Message */}
        <Field
          label="Message *"
          error={errors.message?.message}
          hint={`${messageLen}/2000 characters`}
        >
          <textarea
            rows={5}
            placeholder="Tell me about your project, idea, or question…"
            style={{ ...inputStyle(!!errors.message), resize: "vertical", minHeight: "120px", lineHeight: 1.65 }}
            {...register("message")}
            {...(focusStyle() as Record<string, unknown>)}
          />
        </Field>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.55rem",
            padding: "0.8rem 2rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            letterSpacing: "0.03em",
            borderRadius: "0.7rem",
            border: "none",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            opacity: status === "loading" ? 0.75 : 1,
            background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(243,91%,70%) 100%)",
            color: "#fff",
            boxShadow: "0 6px 24px -6px rgba(65,105,225,0.45)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: "100%",
          }}
          onMouseEnter={e => {
            if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = ""
          }}
        >
          {status === "loading" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ animation: "spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Sending via WhatsApp…
            </>
          ) : status === "success" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Sent to WhatsApp!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Send via WhatsApp
            </>
          )}
        </button>

        {/* Info note */}
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "-0.25rem" }}>
          🔒 Your data is secure. Messages sent directly to Arun's WhatsApp.
        </p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </form>
    </>
  )
}
