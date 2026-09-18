"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSound } from "@/lib/sound";
import { chapters, site } from "@/data/content";

/* ---------------- Preloader ---------------- */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const counter = { v: 0 };
    document.documentElement.classList.add("lenis-stopped");
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("lenis-stopped");
        onDone();
      },
    });
    tl.to(el.querySelectorAll(".loader-name span"), { y: 0, duration: 0.9, stagger: 0.06, ease: "power4.out" }, 0)
      .to(el.querySelector(".loader-bar i"), { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0.1)
      .to(counter, {
        v: 100,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => {
          if (pct.current) pct.current.textContent = `${Math.round(counter.v).toString().padStart(3, "0")} / 100`;
        },
      }, 0.1)
      .to(el.querySelector(".loader-inner"), { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.1")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div className="loader" ref={root} style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="loader-inner">
        <div className="loader-name">
          {"Sajud Hamza".split(" ").map((w, i) => (
            <span key={i} style={{ marginRight: i === 0 ? "0.28em" : 0 }}>
              {w}
            </span>
          ))}
        </div>
        <div className="loader-bar">
          <i />
        </div>
        <div className="loader-pct" ref={pct}>
          000 / 100
        </div>
      </div>
    </div>
  );
}

/* ---------------- Atmosphere: grain + glows + progress ---------------- */
export function Atmosphere() {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const qa = gsap.quickTo(a.current, "x", { duration: 2.4, ease: "power2.out" });
    const qay = gsap.quickTo(a.current, "y", { duration: 2.4, ease: "power2.out" });
    const qb = gsap.quickTo(b.current, "x", { duration: 3, ease: "power2.out" });
    const qby = gsap.quickTo(b.current, "y", { duration: 3, ease: "power2.out" });
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      qa(nx * -80);
      qay(ny * -60);
      qb(nx * 60);
      qby(ny * 50);
    };
    window.addEventListener("pointermove", move);
    const st = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
    return () => {
      window.removeEventListener("pointermove", move);
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, []);

  return (
    <>
      <div className="glow glow-a" ref={a} />
      <div className="glow glow-b" ref={b} />
      <div className="grain" />
      <div className="progress">
        <i ref={bar} />
      </div>
    </>
  );
}

/* ---------------- Cursor ---------------- */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current!;
    document.body.classList.add("no-cursor");
    const qx = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const qy = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      qx(e.clientX);
      qy(e.clientY);
      const t = (e.target as HTMLElement).closest?.("a, button, [data-cursor]") as HTMLElement | null;
      if (t) {
        el.classList.add("is-hover");
        label.current!.textContent = t.dataset.cursor || (t.tagName === "A" ? "open" : "");
      } else el.classList.remove("is-hover");
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("no-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={ref}>
      <span className="cursor-label" ref={label} />
    </div>
  );
}

/* ---------------- Nav ---------------- */
export function Nav() {
  const { on, toggle } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 400);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const triggers = chapters.map((c) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (s) => setActive((prev) => (s.isActive ? c.id : prev === c.id ? "" : prev)),
      })
    );
    return () => {
      window.removeEventListener("scroll", onScroll);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const el = menu.current!;
    if (open) {
      window.__lenis?.stop();
      gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(el.querySelectorAll("a"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, delay: 0.4, duration: 0.8 });
    } else {
      window.__lenis?.start();
      gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut" });
    }
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""}`}>
        <a href="#top" className="nav-brand" data-cursor="top">
          SAJUD<b>/</b>HAMZA
        </a>
        <nav className="nav-links">
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={active === c.id ? "is-active" : ""}>
              {c.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <button className={`pill pill-sound ${on ? "is-on" : ""}`} onClick={toggle} aria-pressed={on} data-cursor={on ? "mute" : "sound"}>
            <span className="eq">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="pill-txt">Sound {on ? "on" : "off"}</span>
          </button>
          <a className="pill nav-contact" href={`mailto:${site.email}`} data-cursor="email">
            Contact
          </a>
          <button className="pill nav-burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <div className="menu" ref={menu} style={{ clipPath: "inset(0 0 100% 0)" }}>
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} onClick={() => setOpen(false)}>
            <small>{c.n}</small>
            {c.label}
          </a>
        ))}
      </div>
    </>
  );
}

/* ---------------- Global scroll reveals ---------------- */
export function Reveals({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Simple fade-up reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = parseFloat(el.dataset.reveal || "0");
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      // Mask reveals for headlines (keeps inline markup such as <em>)
      gsap.utils.toArray<HTMLElement>("[data-reveal-lines]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)", y: 40 }, {
          clipPath: "inset(0 0 -20% 0)", y: 0, duration: 1.3, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      // Batch reveals for lists
      gsap.utils.toArray<HTMLElement>("[data-reveal-batch]").forEach((wrap) => {
        const items = wrap.children;
        gsap.set(items, { opacity: 0, y: 30 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out" }),
        });
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [ready]);
  return null;
}
