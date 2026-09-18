"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { articles, judging, media, memberships, patents, publications, testimonials } from "@/data/content";

function ChapterHead({ n, kicker, title, lead }: { n: string; kicker: string; title: React.ReactNode; lead: string }) {
  return (
    <div className="section-head">
      <div className="row">
        <div>
          <div className="kicker" data-reveal>Chapter {n} · {kicker}</div>
          <h2 className="display h2" data-reveal-lines style={{ marginTop: 18 }}>{title}</h2>
        </div>
        <p className="lead" data-reveal style={{ maxWidth: 440 }}>{lead}</p>
      </div>
    </div>
  );
}

/* ---------------- Research ---------------- */
export function Research() {
  const years = useMemo(() => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a), []);
  const [year, setYear] = useState<number | "all">("all");
  const list = useRef<HTMLDivElement>(null);
  const [stickyYear, setStickyYear] = useState(years[0]);

  const shown = publications.filter((p) => year === "all" || p.year === year);

  useEffect(() => {
    // animate list swap
    const items = list.current!.querySelectorAll(".pub");
    gsap.fromTo(items, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "power3.out", overwrite: true });
  }, [year]);

  useEffect(() => {
    // sticky year tracks the first visible publication
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setStickyYear(Number((vis[0].target as HTMLElement).dataset.year));
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    list.current!.querySelectorAll(".pub").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [year]);

  return (
    <section className="section" id="research">
      <div className="chapter-n">01</div>
      <div className="wrap">
        <ChapterHead
          n="01"
          kicker="Research"
          title={<>Publications</>}
          lead="Peer-reviewed work across computer vision, federated learning, healthcare AI, urban systems, and cybersecurity — including IEEE Transactions on Consumer Electronics."
        />
        <div className="pub-filter" data-reveal>
          <button className={year === "all" ? "is-on" : ""} onClick={() => setYear("all")}>All ({publications.length})</button>
          {years.map((y) => (
            <button key={y} className={year === y ? "is-on" : ""} onClick={() => setYear(y)}>{y}</button>
          ))}
        </div>
        <div className="two" style={{ gridTemplateColumns: "minmax(0, 0.55fr) minmax(0, 1.45fr)", marginTop: 40 }}>
          <div className="sticky" style={{ top: 110 }}>
            <div className="sticky-year" aria-hidden>{stickyYear}</div>
          </div>
          <div className="pub-list" ref={list}>
            {shown.map((p, i) => (
              <article className="pub" key={p.title} data-year={p.year} data-cursor="paper">
                <div className="pub-y">{p.year}<br /><span className="muted">{String(i + 1).padStart(2, "0")}</span></div>
                <div>
                  <h3 className="pub-t">
                    {p.title}
                    {p.featured && <span className="pub-badge">IEEE</span>}
                  </h3>
                  <div className="pub-v">{p.venue}</div>
                </div>
                <div className="pub-arrow">↗</div>
              </article>
            ))}
          </div>
        </div>

        <div className="articles">
          <div className="sub-head">
            <h3 className="display h3" data-reveal-lines>Articles &amp; commentary</h3>
            <div className="mono muted" data-reveal>Writing for practitioners</div>
          </div>
          <div className="art-grid" data-reveal-batch>
            {articles.map((a) => (
              <article className="art" key={a.title} data-cursor="read">
                <div className="art-m"><b>{a.outlet}</b><span>{a.date}</span></div>
                <div>
                  <h4 className="art-t">{a.title}</h4>
                  <p className="art-b">{a.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Recognition ---------------- */
function useTilt(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const cards = ref.current!.querySelectorAll<HTMLElement>("[data-tilt]");
    const off: Array<() => void> = [];
    cards.forEach((c) => {
      const rx = gsap.quickTo(c, "rotateX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(c, "rotateY", { duration: 0.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--mx", `${px * 100}%`);
        c.style.setProperty("--my", `${py * 100}%`);
        rx((0.5 - py) * 8);
        ry((px - 0.5) * 8);
      };
      const leave = () => { rx(0); ry(0); };
      gsap.set(c, { transformPerspective: 900 });
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", leave);
      off.push(() => { c.removeEventListener("pointermove", move); c.removeEventListener("pointerleave", leave); });
    });
    return () => off.forEach((f) => f());
  }, [ref]);
}

export function Recognition() {
  const root = useRef<HTMLElement>(null);
  useTilt(root);
  return (
    <section className="section" id="recognition" ref={root}>
      <div className="chapter-n">02</div>
      <div className="wrap">
        <ChapterHead
          n="02"
          kicker="Recognition"
          title={<>In the press, <em>on the panel</em></>}
          lead="Major media coverage, ten international judging panels, and memberships in selective professional communities."
        />
        <div className="media-grid" data-reveal-batch>
          {media.map((m) => (
            <article className="media-card" key={m.title} data-tilt data-cursor="read">
              <div className="media-d">{m.date}</div>
              <div className="media-o">{m.outlet}</div>
              <div>
                <h3 className="media-t">{m.title}</h3>
                <p className="media-b">{m.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="sub-head">
          <h3 className="display h3" data-reveal-lines>Judging &amp; peer review</h3>
          <div className="mono muted" data-reveal>{judging.length} engagements · 2022 — 2025</div>
        </div>
        <div className="timeline" data-reveal-batch>
          {judging.map((j) => (
            <div className="tl" key={j.org + j.date}>
              <div className="tl-d">{j.date}</div>
              <div>
                <div className="tl-o">{j.org}</div>
                <div className="tl-r">{j.role}</div>
                <p className="tl-b">{j.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="sub-head">
          <h3 className="display h3" data-reveal-lines>Memberships</h3>
          <div className="mono muted" data-reveal>Selective communities requiring recognized expertise</div>
        </div>
        <div className="members" data-reveal-batch>
          {memberships.map((m, i) => (
            <div className="member" key={m}>
              <small>Member · 0{i + 1}</small>
              {m}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Patents ---------------- */
export function Patents() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".patent").forEach((el, i) => {
        gsap.fromTo(el, { y: 80 + i * 40, rotate: i ? 1.5 : -1.5, scale: 0.96 }, {
          y: 0, rotate: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 40%", scrub: 0.5 },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="section" id="patents" ref={root}>
      <div className="chapter-n">03</div>
      <div className="wrap">
        <ChapterHead
          n="03"
          kicker="Intellectual property"
          title={<>Granted <em>patents</em></>}
          lead="Two UK-granted registered designs for original inventions in financial risk computing and optical measurement."
        />
        <div className="patent-grid">
          {patents.map((p) => (
            <article className="patent" key={p.id} data-cursor="patent">
              <svg className="patent-seal" viewBox="0 0 200 200" aria-hidden>
                <defs>
                  <path id={`c-${p.id.replace(/\s/g, "")}`} d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
                </defs>
                <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(232,103,44,0.5)" strokeDasharray="2 6" />
                <text fill="rgba(232,103,44,0.9)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="3">
                  <textPath href={`#c-${p.id.replace(/\s/g, "")}`}>REGISTERED DESIGN · UNITED KINGDOM · GRANTED · </textPath>
                </text>
              </svg>
              <div>
                <div className="patent-id">{p.id}</div>
                <h3 className="patent-t">{p.title}</h3>
                <p className="patent-b">{p.body}</p>
              </div>
              <div className="patent-meta">
                <div>Granted<b>{p.granted}</b></div>
                <div>Domain<b>{p.domain}</b></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials: stacked sticky cards ---------------- */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".testi-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: 0.92 - (cards.length - 1 - i) * 0.0,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top 80%", end: "top 20%", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="section" id="testimonials" ref={root}>
      <div className="chapter-n">04</div>
      <div className="wrap">
        <ChapterHead
          n="04"
          kicker="Testimonials"
          title={<>In their <em>words</em></>}
          lead="Letters from founders, CTOs, and principal engineers who worked alongside him."
        />
        <div className="testi-stack">
          {testimonials.map((t, i) => (
            <figure className="testi-card" key={t.name} style={{ zIndex: i + 1 }}>
              <div className="testi-idx">{String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</div>
              <blockquote className="testi-q">{t.quote}</blockquote>
              <figcaption className="testi-who">
                <div className="avatar">{t.name.split(" ").map((n) => n[0]).join("")}</div>
                <div>
                  <div className="testi-n">{t.name}</div>
                  <div className="testi-t">{t.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
