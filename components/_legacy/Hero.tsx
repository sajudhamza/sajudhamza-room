"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/data/content";
import { useSound } from "@/lib/sound";

/* Neural constellation: drifting nodes linked by proximity, ember-tinted, mouse-reactive. */
function useConstellation(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let raf = 0;
    let scrollY = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number; z: number };
    let pts: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(160, (w * h) / 11000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.9,
        hue: Math.random() < 0.18 ? 1 : 0,
        z: Math.random() * 0.7 + 0.3,
      }));
    };

    const step = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx.clearRect(0, 0, w, h);
      const linkD = Math.min(150, w * 0.11);
      const par = scrollY * 0.25;

      for (const p of pts) {
        // mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 160 * 160) {
          const f = (1 - Math.sqrt(d2) / 160) * 0.6;
          p.vx += (dx / Math.sqrt(d2 + 0.01)) * f;
          p.vy += (dy / Math.sqrt(d2 + 0.01)) * f;
        }
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
      }

      // links
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const ay = a.y + par * (1 - a.z);
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const by = b.y + par * (1 - b.z);
          const dx = a.x - b.x, dy = ay - by;
          const d = Math.hypot(dx, dy);
          if (d < linkD) {
            const alpha = (1 - d / linkD) * 0.5 * Math.min(a.z, b.z);
            ctx.strokeStyle = a.hue || b.hue ? `rgba(232,103,44,${alpha})` : `rgba(242,237,228,${alpha * 0.7})`;
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(b.x, by);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const p of pts) {
        const py = p.y + par * (1 - p.z);
        ctx.beginPath();
        ctx.arc(p.x, py, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.hue ? `rgba(255,138,76,${0.55 + p.z * 0.4})` : `rgba(242,237,228,${0.25 + p.z * 0.45})`;
        ctx.fill();
        if (p.hue) {
          ctx.beginPath();
          ctx.arc(p.x, py, p.r * 5 * p.z, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(232,103,44,0.06)";
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    };
    const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };
    const onScroll = () => { scrollY = window.scrollY; };

    resize();
    step();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [canvasRef]);
}

function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState("");
  const { play } = useSound();
  useEffect(() => {
    let i = 0, j = 0, del = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const w = words[i];
      if (!del) {
        j++;
        setText(w.slice(0, j));
        if (j % 2 === 0) play("tick");
        if (j === w.length) { del = true; t = setTimeout(tick, 1800); return; }
        t = setTimeout(tick, 45 + Math.random() * 40);
      } else {
        j--;
        setText(w.slice(0, j));
        if (j === 0) { del = false; i = (i + 1) % words.length; t = setTimeout(tick, 350); return; }
        t = setTimeout(tick, 22);
      }
    };
    t = setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, [words, play]);
  return (
    <div className="hero-role" aria-live="polite">
      <span>{text}</span>
      <i className="caret" />
    </div>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLElement>(null);
  useConstellation(canvas);

  useEffect(() => {
    if (!ready) return;
    const el = root.current!;
    const chars = el.querySelectorAll(".hero-name .ch");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(chars, { yPercent: 120, rotateX: -40 }, { yPercent: 0, rotateX: 0, duration: 1.3, stagger: { each: 0.03, from: "start" } }, 0.1)
      .fromTo(el.querySelectorAll("[data-hero]"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.6);

    // parallax the headline out as you scroll
    const st = gsap.to(el.querySelector(".hero .wrap"), {
      yPercent: 18,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
    return () => { tl.kill(); st.scrollTrigger?.kill(); st.kill(); };
  }, [ready]);

  const renderLine = (txt: string) => (
    <span className="line">
      {txt.split(" ").map((w, wi) => (
        <span className="word" key={wi} style={{ marginRight: wi < txt.split(" ").length - 1 ? "0.24em" : 0 }}>
          {w.split("").map((c, ci) => (
            <span className="ch" key={ci}>{c}</span>
          ))}
        </span>
      ))}
    </span>
  );

  return (
    <section className="hero" id="top" ref={root}>
      <canvas className="hero-canvas" ref={canvas} aria-hidden />
      <div className="hero-vignette" />
      <div className="wrap">
        <div className="kicker" data-hero>{site.kicker}</div>
        <h1 className="display h1 hero-name" style={{ perspective: 900 }}>
          {renderLine(site.name)}
          {renderLine(site.surname)}
        </h1>
        <div className="hero-grid">
          <div>
            <div data-hero><Typewriter words={site.roles} /></div>
            <p className="lead" data-hero>{site.tagline}</p>
            <div className="hero-ctas" data-hero>
              <a className="btn" href="#research" data-cursor="go">Explore the research <span aria-hidden>→</span></a>
              <a className="btn btn-ghost" href="#vault" data-cursor="vault">Document vault</a>
            </div>
          </div>
          <div className="hero-side" data-hero>
            <div className="mono muted">Based in {site.location}</div>
            <div className="mono muted">Ph.D. candidate · Pace University</div>
            <div className="scroll-cue"><i /> Scroll to begin</div>
          </div>
        </div>
      </div>
    </section>
  );
}
