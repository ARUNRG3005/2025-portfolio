import { useEffect, useRef, useState } from "react";
import "./portfolio.css";
import { ExperienceSection } from "@/components/ui/experience-section";
import { ContactForm } from "@/components/ui/contact-form";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [year] = useState(new Date().getFullYear());
  const liveBgRef = useRef<HTMLDivElement>(null);

  // Apply theme
  useEffect(() => {
    if (theme === "dark") document.body.setAttribute("data-theme", "dark");
    else document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Particles
  useEffect(() => {
    const el = liveBgRef.current;
    if (!el) return;
    for (let i = 0; i < 15; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 60 + 20;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${Math.random()*20+10}s;animation-delay:${Math.random()*5}s`;
      el.appendChild(p);
    }
  }, []);

  // Scroll animations
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-in,.slide-in-left,.slide-in-right,.scale-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Circular project showcase (mirrors script.js initCircularProjects)
  useEffect(() => {
    const projects = [
      { name:"Scheme-Link", designation:"Full-Stack E-Commerce Platform", quote:"A full-stack e-commerce solution with payment integration, user authentication, and admin dashboard. Built with React, Node.js, PostgreSQL and JavaScript.", tech:["React","Node.js","PostgreSQL","JavaScript"], codeUrl:"https://github.com/ARUNRG3005/Schemelink", demoUrl:"https://arunrg3005.github.io/Schemelink/" },
      { name:"Focusmate", designation:"Collaborative Study Planner", quote:"A collaborative project management tool with real-time updates, team collaboration features, and intuitive drag-and-drop interface. Built with React, TypeScript, Node.js and Cloud.", tech:["React","TypeScript","Node.js","Cloud"], codeUrl:"https://github.com/ARUNRG3005/spark-study-planner", demoUrl:"https://spark-study-planner.vercel.app/" },
      { name:"KLN Event Register", designation:"Event Registration System", quote:"A comprehensive data visualization dashboard with real-time metrics, custom reports, and interactive charts. Built with HTML, Tailwind CSS, AppScript and PostgreSQL.", tech:["HTML","Tailwind CSS","AppScript","PostgreSQL"], codeUrl:"https://github.com/ARUNRG3005/KLN-EVENT-REGISTER", demoUrl:"https://arunrg3005.github.io/KLN-EVENT-REGISTER/" },
      { name:"Codsoft Technologies", designation:"UI/UX Design Internship", quote:"A professional UI/UX design project showcasing mobile and web interfaces created using Figma, Photoshop, and Canva during an industry internship.", tech:["UI & UX","Figma","Photoshop","Canva"], codeUrl:"https://github.com/ARUNRG3005/codsoft", demoUrl:"https://github.com/ARUNRG3005/codsoft/blob/main/Untitled-min.png" },
    ];
    const stage = document.getElementById("cpStage");
    if (!stage) return;
    const imgs = Array.from(stage.querySelectorAll<HTMLElement>(".cp-img"));
    const total = projects.length;
    let active = 0;
    let timer: ReturnType<typeof setInterval>;

    function applyImageStyles() {
      const gap = Math.min(Math.max(stage!.offsetWidth * 0.14, 48), 90);
      const stickUp = gap * 0.8;
      imgs.forEach((img, i) => {
        const isLeft = ((active - 1 + total) % total) === i;
        const isRight = ((active + 1) % total) === i;
        if (i === active) img.style.cssText = "z-index:3;opacity:1;pointer-events:auto;transform:translateX(0) translateY(0) scale(1) rotateY(0deg);";
        else if (isLeft) img.style.cssText = `z-index:2;opacity:1;pointer-events:auto;transform:translateX(-${gap}px) translateY(-${stickUp}px) scale(0.84) rotateY(14deg);`;
        else if (isRight) img.style.cssText = `z-index:2;opacity:1;pointer-events:auto;transform:translateX(${gap}px) translateY(-${stickUp}px) scale(0.84) rotateY(-14deg);`;
        else img.style.cssText = "z-index:1;opacity:0;pointer-events:none;";
      });
    }

    function updateContent() {
      const p = projects[active];
      const textEl = document.getElementById("cpText");
      if (textEl) { textEl.style.animation = "none"; void textEl.offsetWidth; textEl.style.animation = ""; }
      const byId = (id: string) => document.getElementById(id);
      if (byId("cpName")) byId("cpName")!.textContent = p.name;
      if (byId("cpDesig")) byId("cpDesig")!.textContent = p.designation;
      if (byId("cpQuote")) byId("cpQuote")!.textContent = p.quote;
      if (byId("cpTech")) byId("cpTech")!.innerHTML = p.tech.map(t => `<span class="tech-badge">${t}</span>`).join("");
      if (byId("cpLinks")) byId("cpLinks")!.innerHTML = `<a href="${p.codeUrl}" target="_blank" class="cp-link-code"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>Code</a><a href="${p.demoUrl}" target="_blank" class="cp-link-demo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo</a>`;
    }

    function goTo(idx: number) {
      active = ((idx % total) + total) % total;
      applyImageStyles();
      updateContent();
      clearInterval(timer);
      timer = setInterval(() => goTo(active + 1), 5000);
    }

    const prev = document.getElementById("cpPrev");
    const next = document.getElementById("cpNext");
    const prevHandler = () => goTo(active - 1);
    const nextHandler = () => goTo(active + 1);
    prev?.addEventListener("click", prevHandler);
    next?.addEventListener("click", nextHandler);
    window.addEventListener("resize", applyImageStyles);
    goTo(0);

    return () => {
      clearInterval(timer);
      prev?.removeEventListener("click", prevHandler);
      next?.removeEventListener("click", nextHandler);
      window.removeEventListener("resize", applyImageStyles);
    };
  }, []);

  // Nav scroll
  useEffect(() => {
    const nav = document.getElementById("navbar");
    const handler = () => nav?.classList.toggle("scrolled", window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function toggleTheme() {
    setTheme(t => t === "dark" ? "light" : "dark");
  }

  return (
    <>
      {/* Live Background */}
      <div className="live-bg" id="liveBg" ref={liveBgRef} />

      {/* Navigation */}
      <nav id="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="text-gradient">Arun</span> R G
          </div>
          <div className="nav-menu">
            <button className="nav-link" onClick={() => scrollTo("#home")}>Home</button>
            <button className="nav-link" onClick={() => scrollTo("#about")}>About</button>
            <button className="nav-link" onClick={() => scrollTo("#experience")}>Experience</button>
            <button className="nav-link" onClick={() => scrollTo("#projects")}>Projects</button>
            <button className="nav-link" onClick={() => scrollTo("#contact")}>Contact</button>
            <button className="btn btn-primary hero-gradient" onClick={() => scrollTo("#contact")}>Hire Me</button>
            <button className="nav-link" onClick={toggleTheme} aria-label="Toggle Dark Mode">
              <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} theme-icon`} />
            </button>
          </div>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            <svg className="icon-lg" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu active">
            <button className="nav-link" onClick={() => scrollTo("#home")}>Home</button>
            <button className="nav-link" onClick={() => scrollTo("#about")}>About</button>
            <button className="nav-link" onClick={() => scrollTo("#experience")}>Experience</button>
            <button className="nav-link" onClick={() => scrollTo("#projects")}>Projects</button>
            <button className="nav-link" onClick={() => scrollTo("#contact")}>Contact</button>
            <button className="btn btn-primary hero-gradient" onClick={() => scrollTo("#contact")}>Hire Me</button>
            <button className="nav-link" onClick={toggleTheme} style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
              <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} theme-icon`} />
              <span style={{ fontWeight:500 }}>Toggle Theme</span>
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="hero-bg-element hero-gradient" />
          <div className="hero-bg-element hero-gradient" />
          <div className="hero-bg-element hero-gradient" />
        </div>
        <div className="hero-container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">Hi, I'm <span className="text-gradient">Arun R G</span></h1>
            <h2 className="hero-subtitle">Full Stack Developer &amp; Data Analytics</h2>
            <p className="hero-description">
              Passionate IT student with hands-on experience in frontend development and UI engineering.
              Dedicated to learning, building, and delivering high-quality digital experiences.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary hero-gradient" onClick={() => scrollTo("#contact")}>
                <svg className="icon" style={{ display:"inline",marginRight:"0.5rem" }} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Get In Touch
              </button>
              <a href="/Arunresume.pdf" target="_blank" download className="btn btn-outline" style={{ textDecoration:"none" }}>
                <svg className="icon" style={{ display:"inline",marginRight:"0.5rem" }} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV
              </a>
            </div>
            <div className="hero-social">
              <a href="https://github.com/ARUNRG3005" target="_blank" rel="noreferrer" className="social-btn">
                <i className="fab fa-github social-icon" />
              </a>
              <a href="https://www.linkedin.com/in/arun-r-g-487537312/" target="_blank" rel="noreferrer" className="social-btn">
                <i className="fab fa-linkedin social-icon" />
              </a>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-wrapper slide-in-right">
              <div className="hero-image-glow" />
              <img src="/IMG-20251021-WA0005.jpg" alt="Arun R G" className="hero-image" />
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <svg className="icon-lg" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" style={{ color:"var(--muted-foreground)" }}>
            <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about-v2">
        <div className="about-v2__container">
          <div className="about-v2__relative">
            <div className="about-v2__topbar fade-in">
              <div className="about-v2__label">
                <span className="about-v2__star">✱</span>
                <span className="about-v2__label-text">WHO I AM</span>
              </div>
              <div className="about-v2__socials">
                <a href="https://github.com/ARUNRG3005" target="_blank" rel="noreferrer" className="about-v2__social-icon" aria-label="GitHub"><i className="fab fa-github" /></a>
                <a href="https://www.linkedin.com/in/arun-r-g-487537312/" target="_blank" rel="noreferrer" className="about-v2__social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                <a href="mailto:rgarun111@gmail.com" className="about-v2__social-icon" aria-label="Email"><i className="fas fa-envelope" /></a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="about-v2__social-icon" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              </div>
            </div>

            <figure className="about-v2__hero-figure scale-in">
              <svg className="about-v2__hero-svg" width="100%" height="100%" viewBox="0 0 100 40">
                <defs>
                  <clipPath id="about-clip" clipPathUnits="objectBoundingBox">
                    <path d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z" fill="#D9D9D9" />
                  </clipPath>
                </defs>
                <image clipPath="url(#about-clip)" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"
                  href="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop" />
              </svg>
            </figure>

            <div className="about-v2__stats fade-in">
              <div className="about-v2__stats-left">
                <div className="about-v2__stat-item">
                  <span className="about-v2__stat-value">10+</span>
                  <span className="about-v2__stat-label">projects built</span>
                  <span className="about-v2__stat-sep">|</span>
                </div>
                <div className="about-v2__stat-item">
                  <span className="about-v2__stat-value">8.4</span>
                  <span className="about-v2__stat-label">CGPA</span>
                </div>
              </div>
              <div className="about-v2__stats-right">
                <div className="about-v2__stat-big fade-in" style={{ transitionDelay:"0.2s" }}>
                  <span className="about-v2__stat-value-lg">13+</span>
                  <span className="about-v2__stat-label-lg">TECHNOLOGIES</span>
                </div>
                <div className="about-v2__stat-item fade-in" style={{ transitionDelay:"0.3s" }}>
                  <span className="about-v2__stat-value">2+</span>
                  <span className="about-v2__stat-label">years experience</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-v2__content">
            <div className="about-v2__content-left">
              <h2 className="about-v2__heading slide-in-left">
                {["Building","Systems","That","Make","a","Difference."].map(w => (
                  <span key={w} className="about-v2__heading-word">{w} </span>
                ))}
              </h2>
              <div className="about-v2__body-grid">
                <div className="about-v2__body-col fade-in" style={{ transitionDelay:"0.15s" }}>
                  <p>I am an IT student and full-stack developer focused on creating clean, intuitive, and scalable web applications. With a strong foundation in React, JavaScript, Node.js, Python, and modern UI engineering, I enjoy transforming ideas into polished digital experiences.</p>
                </div>
                <div className="about-v2__body-col fade-in" style={{ transitionDelay:"0.3s" }}>
                  <p>I've developed several meaningful projects — from e-commerce platforms with payment integration to real-time collaboration tools. Each project strengthened my problem-solving ability and understanding of full-stack architecture.</p>
                </div>
              </div>
            </div>
            <div className="about-v2__content-right">
              <div className="about-v2__name-block fade-in" style={{ transitionDelay:"0.1s" }}>
                <div className="about-v2__name">ARUN R G</div>
                <div className="about-v2__role">Full Stack Developer &amp; Data Analytics</div>
              </div>
              <div className="about-v2__cta-block fade-in" style={{ transitionDelay:"0.25s" }}>
                <p className="about-v2__cta-text">Ready to build something amazing together?</p>
              </div>
              <button className="about-v2__cta-btn fade-in" style={{ transitionDelay:"0.4s" }} onClick={() => scrollTo("#contact")}>
                LET'S COLLABORATE
                <svg className="about-v2__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Skills */}
          <div className="skills-card scale-in">
            <h3 className="skills-title">Technical <span className="text-gradient">Skills</span></h3>
            <div className="skills-container">
              {["JavaScript","TypeScript","React","Node.js","Python","Java","PostgreSQL","MongoDB","C / C#","HTML / CSS","C++"].map(s => (
                <span key={s} className="skill-badge"><span>{s}</span></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <ExperienceSection />

      {/* Projects */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">Top <span className="text-gradient">Projects</span></h2>
            <p className="section-description">A cinematic showcase of my recent work and technical expertise</p>
          </div>
        </div>

        <div className="cp-wrapper fade-in">
          <div className="cp-inner">
            <div className="cp-stage" id="cpStage">
              <img className="cp-img" data-idx="0" src="/schemelink.jpg" alt="Scheme-Link" />
              <img className="cp-img" data-idx="1" src="/focusmate.jpg" alt="Focusmate" />
              <img className="cp-img" data-idx="2" src="/KLN.jpg" alt="KLN Event Register" />
              <img className="cp-img" data-idx="3" src="/IT-COMPANY.jpg" alt="Codsoft Technologies" />
            </div>
            <div className="cp-content">
              <div className="cp-text" id="cpText">
                <h3 className="cp-name" id="cpName" />
                <p className="cp-designation" id="cpDesig" />
                <p className="cp-quote" id="cpQuote" />
                <div className="cp-tech" id="cpTech" />
                <div className="cp-links" id="cpLinks" />
              </div>
              <div className="cp-arrows">
                <button className="cp-btn" id="cpPrev" aria-label="Previous">&#8592;</button>
                <button className="cp-btn" id="cpNext" aria-label="Next">&#8594;</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
          <button className="btn btn-outline scale-in" style={{ padding:"0.75rem 2rem" }}>
            <a href="https://github.com/ARUNRG3005" style={{ textDecoration:"none", color:"rgb(129,129,242)" }}>View All Projects</a>
          </button>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">Let's <span className="text-gradient">Connect</span></h2>
            <p className="section-description">Ready to bring your ideas to life? Send me a message — it goes straight to my WhatsApp!</p>
          </div>
          <div className="contact-grid">
            {/* Left: info cards */}
            <div className="contact-info slide-in-left">
              <h3>Get in Touch</h3>
              <p>I'm always open to discussing new opportunities, creative ideas, or potential collaborations.</p>
              <div className="contact-cards">
                <div className="contact-card fade-in" style={{ transitionDelay:"0.1s" }}>
                  <a href="mailto:rgarun111@gmail.com">
                    <div className="contact-icon hero-gradient">
                      <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <div className="contact-label">Email</div>
                      <div className="contact-value">rgarun111@gmail.com</div>
                    </div>
                  </a>
                </div>
                <div className="contact-card fade-in" style={{ transitionDelay:"0.2s" }}>
                  <a href="https://wa.me/917604847895" target="_blank" rel="noreferrer">
                    <div className="contact-icon" style={{ padding:"0.75rem", borderRadius:"50%", background:"linear-gradient(135deg,#25D366,#128C7E)", color:"white" }}>
                      <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="contact-label">WhatsApp</div>
                      <div className="contact-value">+91 7604847895</div>
                    </div>
                  </a>
                </div>
                <div className="contact-card fade-in" style={{ transitionDelay:"0.3s" }}>
                  <a href="tel:+917604847895">
                    <div className="contact-icon hero-gradient">
                      <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <div className="contact-label">Phone</div>
                      <div className="contact-value">+91 7604847895</div>
                    </div>
                  </a>
                </div>
                <div className="contact-card fade-in" style={{ transitionDelay:"0.4s" }}>
                  <a href="#">
                    <div className="contact-icon hero-gradient">
                      <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div className="contact-label">Location</div>
                      <div className="contact-value">TamilNadu, India</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: WhatsApp-powered form */}
            <div className="contact-form-card slide-in-right">
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"1.5rem" }}>
                <div style={{ padding:"0.5rem", borderRadius:"10px", background:"linear-gradient(135deg,#25D366,#128C7E)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize:"1.3rem", fontWeight:800, margin:0 }}>Send via WhatsApp</h3>
                  <p style={{ fontSize:"0.75rem", color:"var(--muted-foreground)", margin:0 }}>Messages delivered instantly to Arun's WhatsApp</p>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="fade-in">
              <div className="footer-brand"><span className="text-gradient">Arun</span> R G</div>
              <p className="footer-description">Full Stack Developer passionate about creating innovative digital solutions that make a difference in people's lives.</p>
            </div>
            <div className="fade-in" style={{ transitionDelay:"0.1s" }}>
              <h3 className="footer-title">Quick Links</h3>
              <div className="footer-links">
                <button className="footer-link" onClick={() => scrollTo("#about")}>About Me</button>
                <button className="footer-link" onClick={() => scrollTo("#projects")}>Projects</button>
                <button className="footer-link" onClick={() => scrollTo("#contact")}>Contact</button>
              </div>
            </div>
            <div className="fade-in" style={{ transitionDelay:"0.2s" }}>
              <h3 className="footer-title">Get In Touch</h3>
              <div style={{ color:"var(--muted-foreground)" }}>
                <p>rgarun111@gmail.com</p>
                <p>+91 7604847895</p>
                <p>TamilNadu, India</p>
              </div>
              <div className="footer-social">
                <a href="https://github.com/ARUNRG3005" target="_blank" rel="noreferrer" className="social-btn"><i className="fab fa-github social-icon" /></a>
                <a href="https://www.linkedin.com/in/arun-r-g-487537312/" target="_blank" rel="noreferrer" className="social-btn"><i className="fab fa-linkedin social-icon" /></a>
                <a href="mailto:rgarun111@gmail.com" className="social-btn"><i className="fas fa-envelope social-icon" /></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright fade-in">
              <span>© {year} Arun R G. Made with</span>
              <svg className="icon heart-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <button className="btn fade-in" style={{ background:"none", border:"none", color:"var(--muted-foreground)" }} onClick={() => scrollTo("#home")}>
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* FontAwesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossOrigin="anonymous" />
    </>
  );
}
