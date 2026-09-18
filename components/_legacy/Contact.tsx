"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/data/content";

export default function Contact() {
  const big = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = gsap.fromTo(big.current, { yPercent: 40 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: big.current, start: "top bottom", end: "bottom bottom", scrub: true },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="kicker" data-reveal>Get in touch</div>
        <h2 className="display h2" data-reveal-lines style={{ margin: "18px 0 40px" }}>Let&apos;s build something that <em>cannot fail</em></h2>
        <a className="contact-mail" href={`mailto:${site.email}`} data-reveal data-cursor="write">{site.email}</a>
        <div className="contact-grid" data-reveal>
          <div>
            <h5>Direct</h5>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.phoneHref}>{site.phone}</a>
          </div>
          <div>
            <h5>Elsewhere</h5>
            <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <div>
            <h5>Location</h5>
            <p>{site.location}</p>
            <p>{site.footerLine.split(" · ").slice(0, 2).join(" · ")}</p>
          </div>
        </div>
        <div className="footer-big" ref={big} aria-hidden>SAJUD/HAMZA</div>
        <div className="footer">
          <span>© {new Date().getFullYear()} {site.name} {site.surname}</span>
          <span>{site.footerLine}</span>
        </div>
      </div>
    </section>
  );
}
