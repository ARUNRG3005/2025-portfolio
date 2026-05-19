import { useRef } from "react"
import { motion, useInView } from "motion/react"

/* ─── Experience data ─────────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: "exp-1",
    role: "Software Development",
    type: "Internship · Hybrid",
    company: "Dream Yours Infotech Consulting & Services",
    duration: "Apr 2026 – Present",
    badge: "Current",
    badgeColor: "#22c55e",
    description:
      "Developing and maintaining full-stack web applications using React, Node.js, and modern UI frameworks. Contributing to client-facing projects with clean, scalable code and responsive design.",
    skills: ["React", "Node.js", "TypeScript", "REST APIs"],
    accentColor: "#818cf8",
    accentGlow: "rgba(129,140,248,0.22)",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&auto=format&fit=crop",
  },
  {
    id: "exp-2",
    role: "Graphic Design Specialist",
    type: "Internship · Remote",
    company: "CodSoft IT Services and IT Consulting",
    duration: "Mar 2025 – Apr 2025 · 2 mos",
    badge: "UI/UX",
    badgeColor: "#06b6d4",
    description:
      "Completed four solo UI/UX projects including a responsive restaurant menu, email poster, and e-commerce design. Emphasized intuitive navigation, mobile-first principles and modern visual aesthetics.",
    skills: ["UI/UX", "Figma", "Photoshop", "Canva"],
    accentColor: "#22d3ee",
    accentGlow: "rgba(34,211,238,0.22)",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=80&auto=format&fit=crop",
  },
  {
    id: "exp-3",
    role: "Software Engineer",
    type: "Internship · Remote",
    company: "OctaNet Services Pvt Ltd.",
    duration: "Feb 2025 – Mar 2025 · 2 mos",
    badge: "Backend",
    badgeColor: "#f97316",
    description:
      "Sharpened Python fundamentals — file handling, OOP, loops and conditionals. Built real-world logic for secure and efficient backend systems.",
    skills: ["Python", "OOP", "FastAPI", "PostgreSQL"],
    accentColor: "#f97316",
    accentGlow: "rgba(249,115,22,0.22)",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=80&auto=format&fit=crop",
  },
  {
    id: "exp-4",
    role: "Web Developer",
    type: "Internship · Remote",
    company: "OctaNet Services Pvt Ltd.",
    duration: "Feb 2025 – Mar 2025 · 2 mos",
    badge: "Frontend",
    badgeColor: "#a78bfa",
    description:
      "Built visually appealing, user-friendly web interfaces by blending functionality with design aesthetics. Gained practical experience in real-world development workflows and client expectations.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    accentColor: "#a78bfa",
    accentGlow: "rgba(167,139,250,0.22)",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=80&auto=format&fit=crop",
  },
]

/* ─── Single experience card ──────────────────────────────────── */
function ExpCard({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Card shell */}
      <div
        style={{
          borderRadius: "1.25rem",
          overflow: "hidden",
          border: `1px solid ${exp.accentColor}28`,
          background: "var(--card-gradient)",
          boxShadow: `0 6px 32px -6px ${exp.accentGlow}`,
          transition: "box-shadow 0.4s, transform 0.35s",
          cursor: "default",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = "translateY(-5px)"
          el.style.boxShadow = `0 18px 52px -10px ${exp.accentGlow}, 0 4px 20px rgba(0,0,0,0.18)`
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = ""
          el.style.boxShadow = `0 6px 32px -6px ${exp.accentGlow}`
        }}
      >
        {/* Cover image */}
        <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
          <img
            src={exp.image}
            alt={exp.role}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "" }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.58) 100%)`,
          }} />
          {/* Accent tint */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${exp.accentColor}22 0%, transparent 60%)`,
          }} />

          {/* Badge pill */}
          <span style={{
            position: "absolute", top: "0.9rem", left: "0.9rem",
            background: exp.badgeColor,
            color: "#fff",
            fontSize: "0.65rem", fontWeight: 800,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0.22rem 0.7rem", borderRadius: "999px",
            boxShadow: `0 2px 10px ${exp.badgeColor}55`,
          }}>
            {exp.badge}
          </span>

          {/* Live indicator */}
          {exp.badge === "Current" && (
            <span style={{
              position: "absolute", top: "0.9rem", right: "0.9rem",
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: "rgba(0,0,0,0.55)", color: "#22c55e",
              fontSize: "0.65rem", fontWeight: 700,
              padding: "0.2rem 0.6rem", borderRadius: "999px",
              backdropFilter: "blur(6px)",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e",
                animation: "exp-pulse 1.6s ease-in-out infinite",
                display: "inline-block",
              }} />
              LIVE
            </span>
          )}

          {/* Logo */}
          <div style={{
            position: "absolute", bottom: "-22px", left: "1.1rem",
            width: "44px", height: "44px", borderRadius: "10px",
            overflow: "hidden", border: "2.5px solid var(--background)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            background: "#fff",
          }}>
            <img src={exp.logo} alt={exp.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "2rem 1.4rem 1.4rem" }}>
          {/* Company + type */}
          <div style={{ marginBottom: "0.65rem" }}>
            <p style={{
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: exp.accentColor, marginBottom: "0.2rem",
            }}>
              {exp.type}
            </p>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              {exp.company}
            </p>
          </div>

          {/* Role */}
          <h3 style={{
            fontSize: "1.2rem", fontWeight: 800, lineHeight: 1.25,
            marginBottom: "0.35rem",
            background: `linear-gradient(120deg, var(--foreground) 0%, ${exp.accentColor} 140%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {exp.role}
          </h3>

          {/* Duration */}
          <p style={{
            fontSize: "0.77rem", color: "var(--muted-foreground)",
            display: "flex", alignItems: "center", gap: "0.4rem",
            marginBottom: "0.85rem",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: exp.accentColor, flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {exp.duration}
          </p>

          {/* Description */}
          <p style={{
            fontSize: "0.845rem", color: "var(--muted-foreground)",
            lineHeight: 1.7, marginBottom: "1rem",
          }}>
            {exp.description}
          </p>

          {/* Skills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
            {exp.skills.map(skill => (
              <span
                key={skill}
                style={{
                  fontSize: "0.7rem", fontWeight: 600,
                  padding: "0.22rem 0.65rem", borderRadius: "999px",
                  border: `1.5px solid ${exp.accentColor}44`,
                  color: exp.accentColor,
                  background: `${exp.accentColor}0f`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Bottom accent bar */}
          <div style={{
            height: "3px", borderRadius: "99px",
            background: `linear-gradient(90deg, ${exp.accentColor} 0%, ${exp.accentColor}00 100%)`,
          }} />
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main section ────────────────────────────────────────────── */
export function ExperienceSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 })

  return (
    <section
      id="experience"
      style={{
        padding: "5rem 0 4rem",
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div style={{
        position: "absolute", top: "-8rem", left: "50%",
        transform: "translateX(-50%)",
        width: "70rem", height: "22rem", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.32rem 1.1rem", borderRadius: "999px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.28)",
            marginBottom: "1.25rem",
          }}>
            <span style={{
              fontSize: "0.72rem", fontWeight: 700,
              color: "hsl(217,91%,60%)",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              ✱ Professional Journey
            </span>
          </div>

          <h2 className="section-title">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="section-description" style={{ marginTop: "0.75rem" }}>
            Internships &amp; roles where I sharpened my skills and delivered real impact
          </p>
        </motion.div>

        {/* ── Cards grid — 2-col on ≥768px, 1-col mobile ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
          gap: "1.75rem",
        }}>
          {EXPERIENCES.map((exp, i) => (
            <ExpCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>

        {/* ── LinkedIn CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          style={{ textAlign: "center", marginTop: "3rem" }}
        >
          <a
            href="https://www.linkedin.com/in/arun-r-g-487537312/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary hero-gradient"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 2rem",
              fontSize: "0.9rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            View Full Profile on LinkedIn
          </a>
        </motion.div>
      </div>

      {/* Keyframe for live pulse dot */}
      <style>{`
        @keyframes exp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%        { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </section>
  )
}
