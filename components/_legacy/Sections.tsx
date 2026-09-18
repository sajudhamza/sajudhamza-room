"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { about, education, expertise, site, skills, stats } from "@/data/content";

/* ---------------- Stats with counters ---------------- */
export function Stats() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      root.current!.querySelectorAll<HTMLElement>(".stat-v b").forEach((el) => {
        const target = Number(el.dataset.v);
        const o = { v: 0 };
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = Math.round(o.v).toString()),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div className="stats" ref={root}>
      <div className="wrap">
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-v">
                <b data-v={s.value}>0</b>
                {s.suffix && <sup>{s.suffix}</sup>}
              </div>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- About: words light up as you scroll ---------------- */
export function About() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = root.current!.querySelectorAll(".about-quote .w");
      gsap.to(words, {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: { trigger: ".about-quote", start: "top 75%", end: "bottom 45%", scrub: 0.4 },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="section" id="about" ref={root}>
      <div className="chapter-n">00</div>
      <div className="wrap">
        <div className="section-head">
          <div className="kicker" data-reveal>{about.kicker}</div>
        </div>
        <div className="two">
          <h2 className="about-quote">
            {about.title.split(" ").map((w, i) => (
              <span key={i} className="w">{w}&nbsp;</span>
            ))}
          </h2>
          <div className="about-body">
            {about.paragraphs.map((p, i) => (
              <p key={i} data-reveal={i * 0.1}>{p}</p>
            ))}
            <div className="about-links" data-reveal="0.2">
              <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <span>{site.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Education ---------------- */
export function Education() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="row">
            <div>
              <div className="kicker" data-reveal>Education</div>
              <h2 className="display h2" data-reveal-lines style={{ marginTop: 18 }}>Academic record</h2>
            </div>
            <p className="lead" data-reveal style={{ maxWidth: 380 }}>
              A decade between Mumbai and New York — from electronics to the frontier of machine learning.
            </p>
          </div>
        </div>
        <div className="edu-list" data-reveal-batch>
          {education.map((e, i) => (
            <div className="edu" key={e.degree}>
              <div className="edu-y">
                {e.years}
                {e.meta && <b>{e.meta}</b>}
              </div>
              <div>
                <div className="edu-d">{e.degree}</div>
                <div className="edu-s">{e.school}</div>
                {e.note && <div className="edu-n">{e.note}</div>}
              </div>
              <div className="edu-i">0{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Toolkit: magnetic chips + marquee ---------------- */
export function Toolkit() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const chips = root.current!.querySelectorAll<HTMLElement>(".chip");
    const handlers: Array<() => void> = [];
    chips.forEach((c) => {
      const qx = gsap.quickTo(c, "x", { duration: 0.5, ease: "power3.out" });
      const qy = gsap.quickTo(c, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.3);
        qy((e.clientY - (r.top + r.height / 2)) * 0.3);
      };
      const leave = () => { qx(0); qy(0); };
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", leave);
      handlers.push(() => { c.removeEventListener("pointermove", move); c.removeEventListener("pointerleave", leave); });
    });
    return () => handlers.forEach((h) => h());
  }, []);

  const all = skills.flatMap((s) => s.items);
  return (
    <section className="section toolkit" ref={root} style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="kicker" data-reveal>Toolkit</div>
          <h2 className="display h2" data-reveal-lines>Technical skills</h2>
        </div>
        <div data-reveal-batch>
          {skills.map((g) => (
            <div className="tk-group" key={g.group}>
              <div className="tk-g">{g.group}</div>
              <div className="tk-chips">
                {g.items.map((s) => (
                  <span className="chip" key={s} data-sfx>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...all, ...all].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Expertise: pinned horizontal scroll ---------------- */
export function Expertise() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 861px)", () => {
      const track = root.current!.querySelector<HTMLElement>(".exp-track")!;
      const pin = root.current!.querySelector<HTMLElement>(".exp-pin")!;
      const getX = () => -(track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: getX,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(pin.querySelector(".exp-progress i"), { scaleX: self.progress });
          },
        },
      });
      // cards drift in with slight rotation as they enter
      root.current!.querySelectorAll<HTMLElement>(".exp-card").forEach((card) => {
        gsap.fromTo(card, { rotateY: 8, opacity: 0.4 }, {
          rotateY: 0, opacity: 1, ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 60%", scrub: true },
        });
      });
    });
    // mouse glow position on cards
    const cards = root.current!.querySelectorAll<HTMLElement>(".exp-card");
    const move = (e: PointerEvent) => {
      const c = e.currentTarget as HTMLElement;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", move));
    return () => { mm.revert(); cards.forEach((c) => c.removeEventListener("pointermove", move)); };
  }, []);

  return (
    <section className="section expertise" ref={root}>
      <div className="exp-pin">
        <div className="exp-head">
          <div>
            <div className="kicker">Expertise</div>
            <h2 className="display h2" style={{ marginTop: 14 }}>Six domains, <em>one discipline</em></h2>
          </div>
          <div className="mono muted">Scroll to traverse →</div>
        </div>
        <div className="exp-track">
          {expertise.map((x) => (
            <article className="exp-card" key={x.n} data-cursor="read">
              <div className="exp-n">{x.n}</div>
              <div>
                <h3 className="exp-t">{x.title}</h3>
                <p className="exp-b">{x.body}</p>
              </div>
            </article>
          ))}
          <div className="exp-end" />
        </div>
        <div className="exp-progress"><i /></div>
      </div>
    </section>
  );
}
