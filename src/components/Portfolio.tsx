import { useEffect, useRef, useState } from "react";
import { usePortfolioData } from "../utils/usePortfolioData";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

function useCursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      dot.style.left = `${cx}px`;
      dot.style.top = `${cy}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    const interactive = document.querySelectorAll<HTMLElement>(
      ".brutalist a, .brutalist .proj, .brutalist .writing .row, .brutalist .nav .cta, .brutalist .more"
    );
    const enter = () => {
      dot.style.width = "24px";
      dot.style.height = "24px";
    };
    const leave = () => {
      dot.style.width = "8px";
      dot.style.height = "8px";
    };
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return ref;
}

function useLocalClock(timeZone: string) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone,
      });
      setTime(fmt.format(new Date()));
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return time;
}

type ProjectVariant = "" | "invert" | "accent";
const projectVariants: ProjectVariant[] = ["", "invert", "accent", ""];

// Tech chips per job, derived from role descriptions in portfolio.ts.
const jobStacks: Record<string, string[]> = {
  "TikTok Inc.": ["iOS", "Android", "Backend", "Privacy"],
  "Microsoft India (R&D) Pvt. Ltd.": ["iOS", "React Native", "Swift"],
  "IBM India Software Labs Ltd": ["Swift", "Obj-C", "Kotlin", "Golang"],
  "Appillary Solutions": ["iOS", "Objective-C"],
};

export function Portfolio() {
  const data = usePortfolioData();
  const { name, title, location } = data.personal;
  const { github, linkedin, twitter } = data.social;
  const aboutParagraphs = data.about.paragraphs;
  const aboutStats = data.about.stats;
  const projects = data.projects;
  const experience = data.experience;
  const certifications = data.certification ?? [];

  const cursorRef = useCursorDot();
  // San Francisco, CA → America/Los_Angeles
  const clock = useLocalClock("America/Los_Angeles");

  const firstName = name.split(" ")[0].toUpperCase();
  const currentRole = experience[0];

  const stats = [
    { n: aboutStats.experience, l: aboutStats.experienceLabel },
    { n: aboutStats.projects, l: aboutStats.projectsLabel },
    { n: String(certifications.length).padStart(2, "0"), l: "Certifications" },
    { n: String(experience.length).padStart(2, "0"), l: "Companies" },
  ];

  const writingRows = certifications.slice(0, 5).map((c) => ({
    date: c.issue_date ?? "",
    title: c.name,
    cat: (c.issuer ?? "").toUpperCase(),
    href: c.credential_url,
  }));

  return (
    <div className="brutalist">
      <div className="cursor-dot" ref={cursorRef} aria-hidden="true" />

      <div className="strip">
        <span>
          <span className="dot" /> AVAILABLE FOR CONVERSATION · APR 2026
        </span>
        <div className="right">
          <span className="loc-long">
            {location.toUpperCase()}
            {clock ? ` · ${clock} LOCAL` : ""}
          </span>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("contact");
            }}
          >
            SAY HELLO ↗
          </a>
        </div>
      </div>

      <nav className="nav">
        <a
          href="#top"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("top");
          }}
        >
          <span className="sq" />
          ANANTHA K
        </a>
        <div className="nav-links">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("about");
            }}
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("projects");
            }}
          >
            Projects
          </a>
          <a
            href="#writing"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("writing");
            }}
          >
            Notes
          </a>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("work");
            }}
          >
            Work
          </a>
        </div>
        <a
          href="#contact"
          className="cta"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("contact");
          }}
        >
          Contact →
        </a>
      </nav>

      <main id="top">
        <section className="mega">
          <div className="kicker">
            <span>
              ☞ <b>{name}</b> — {title}
            </span>
            <span>Portfolio / v4.0 / 2026</span>
          </div>
          <h1>
            {firstName}
            <br />
            <span className="stroke">DESIGNS</span>
            <br />
            <span className="accent">SYSTEMS.</span>
          </h1>
          <div className="sub">
            <div>
              <div className="k">Status</div>
              <div className="v">Employed — open to conversation.</div>
            </div>
            <div>
              <div className="k">Currently</div>
              <div className="v">
                {currentRole.title} @ {currentRole.company}
              </div>
            </div>
            <div>
              <div className="k">Reach</div>
              <div className="v">
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn /in/anantha-kg →
                </a>
              </div>
            </div>
            <div>
              <div className="k">Since</div>
              <div className="v">Shipping code since 2014</div>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="section-title">
            <div className="section-title-inner">
              <h2>01 · About</h2>
              <span className="count">
                {aboutParagraphs.length} paragraphs
              </span>
            </div>
          </div>
          <div className="body">
            {aboutParagraphs.map((p, i) => (
              <div key={i}>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.l}>
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="projects" id="projects">
          <div className="section-title">
            <div className="section-title-inner">
              <h2>02 · Projects</h2>
              <span className="count">
                {String(projects.length).padStart(2, "0")} selected
              </span>
            </div>
          </div>
          <div className="proj-grid">
            {projects.map((p, i) => {
              const variant = projectVariants[i] ?? "";
              const href = p.demo || p.github || p.appstore || p.medium;
              const Wrapper: "a" | "article" = href ? "a" : "article";
              const total = projects.length;
              const tag = p.technologies.map((t) => t.toUpperCase()).join(" · ");
              return (
                <Wrapper
                  key={p.title}
                  className={["proj", variant].filter(Boolean).join(" ")}
                  {...(href
                    ? {
                        href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                >
                  <div className="n">
                    [ {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} ]
                  </div>
                  <div className="tag">{tag}</div>
                  <div className="title">
                    {p.title.toUpperCase()}
                    <span className="arr">↗</span>
                  </div>
                  <p className="desc">{p.description}</p>
                  <div className="row">
                    {p.github && <span>GITHUB</span>}
                    {p.demo && <span>DEMO</span>}
                    {p.appstore && <span>APP STORE</span>}
                    {p.medium && <span>BLOG</span>}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </section>

        <section className="writing" id="writing">
          <div className="section-title">
            <div className="section-title-inner">
              <h2>03 · Notes &amp; Credentials</h2>
              <span className="count">
                {String(writingRows.length).padStart(2, "0")} of{" "}
                {String(certifications.length).padStart(2, "0")} — newest first
              </span>
            </div>
          </div>
          <div className="list">
            {writingRows.map((r) => (
              <a
                key={r.title}
                className="row"
                href={r.href}
                target={r.href ? "_blank" : undefined}
                rel={r.href ? "noopener noreferrer" : undefined}
              >
                <span className="d">{r.date}</span>
                <span className="t">{r.title}</span>
                <span className="cat">{r.cat}</span>
                <span className="x">VIEW ↗</span>
              </a>
            ))}
          </div>
          <a
            className="more"
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW ALL {certifications.length} ON LINKEDIN →
          </a>
        </section>

        <section className="work" id="work">
          <div className="section-title">
            <div className="section-title-inner">
              <h2>04 · Work</h2>
              <span className="count">2014 → now</span>
            </div>
          </div>
          <div className="grid">
            {experience.map((job) => {
              const stack = jobStacks[job.company] ?? [];
              return (
                <div className="job" key={`${job.company}-${job.period}`}>
                  <div className="yrs">{job.period.toUpperCase()}</div>
                  <div className="co">{job.company}</div>
                  <div className="role">
                    <b>{job.title}.</b> {job.description}
                  </div>
                  {stack.length > 0 && (
                    <div className="stack">
                      {stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="inner">
            <h3>
              SAY
              <br />
              <span className="stroke">HELLO.</span>
            </h3>
            <div className="row-2">
              <a
                className="mail"
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message me on LinkedIn →
              </a>
              <div className="links">
                <a href={github} target="_blank" rel="noopener noreferrer">
                  GITHUB
                </a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  LINKEDIN
                </a>
                <a href={twitter} target="_blank" rel="noopener noreferrer">
                  X / TWITTER
                </a>
                <a
                  href="https://medium.com/@Anantha1992"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MEDIUM
                </a>
              </div>
            </div>
          </div>
          <div className="foot">
            <span>© ANANTHA KRISHNAN MMXXVI</span>
            <span>SET IN IBM PLEX MONO &amp; SANS</span>
            <span>BUILT BY HAND · NO TRACKERS</span>
            <span>V4.0.0 · UPDATED 2026-04-17</span>
          </div>
        </section>
      </main>
    </div>
  );
}
