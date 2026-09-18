"use client";

import { FormEvent, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useSound } from "@/lib/sound";

type VFile = { name: string; size: string; href: string };

export default function Vault() {
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "err" | "open">("idle");
  const [msg, setMsg] = useState("Protected evidence files · authorized access only");
  const [files, setFiles] = useState<VFile[]>([]);
  const lock = useRef<SVGSVGElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pw || state === "busy") return;
    setState("busy");
    setMsg("Verifying…");
    try {
      const r = await fetch("/api/vault", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Access denied.");
      setFiles(j.files);
      setState("open");
      setMsg(`${j.files.length} files unlocked`);
      play("unlock");
      // shackle lifts, ring spins open
      gsap.to(lock.current!.querySelector(".shackle"), { y: -14, duration: 0.6, ease: "back.out(2)" });
      gsap.to(lock.current!.querySelector(".ring"), { rotate: 180, transformOrigin: "50% 50%", duration: 1.2, ease: "expo.out" });
      gsap.fromTo(".vfile", { opacity: 0, x: -14 }, { opacity: 1, x: 0, stagger: 0.07, duration: 0.6, delay: 0.2 });
    } catch (err: any) {
      setState("err");
      setMsg(err.message || "Access denied.");
      gsap.fromTo(box.current, { x: -6 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      gsap.fromTo(lock.current, { rotate: -4 }, { rotate: 0, duration: 0.5, ease: "elastic.out(1, 0.3)", transformOrigin: "50% 50%" });
      setTimeout(() => setState("idle"), 1200);
    }
  };

  return (
    <section className="section" id="vault">
      <div className="chapter-n">05</div>
      <div className="wrap">
        <div className="section-head">
          <div className="row">
            <div>
              <div className="kicker" data-reveal>Chapter 05 · Document vault</div>
              <h2 className="display h2" data-reveal-lines style={{ marginTop: 18 }}>Evidence, <em>sealed</em></h2>
            </div>
            <p className="lead" data-reveal style={{ maxWidth: 420 }}>Enter the access password to view and download protected evidence files — certificates, letters, and verifications.</p>
          </div>
        </div>
        <div className="vault-box" ref={box} data-reveal>
          <div>
            {state !== "open" ? (
              <form className="vault-form" onSubmit={submit}>
                <label className="mono muted" htmlFor="vault-pw">Access password</label>
                <div className="field">
                  <input id="vault-pw" type="password" autoComplete="off" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
                  <button type="submit" data-cursor="unlock">{state === "busy" ? "…" : "Unlock →"}</button>
                </div>
                <div className={`vault-msg ${state === "err" ? "err" : ""}`}>{msg}</div>
              </form>
            ) : (
              <div>
                <div className="vault-msg" style={{ color: "var(--ember)", marginBottom: 16 }}>{msg}</div>
                <div className="vault-files">
                  {files.map((f) => (
                    <a className="vfile" key={f.href} href={f.href} target="_blank" rel="noreferrer" data-cursor="download">
                      <div>{f.name}</div>
                      <span>{f.size} ↓</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="vault-lock" aria-hidden>
            <svg ref={lock} viewBox="0 0 200 200" fill="none">
              <circle className="ring" cx="100" cy="100" r="92" stroke="rgba(232,103,44,0.55)" strokeWidth="1" strokeDasharray="6 10" />
              <circle cx="100" cy="100" r="72" stroke="rgba(242,237,228,0.12)" strokeWidth="1" />
              <g className="shackle">
                <path d="M78 96 V80 a22 22 0 0 1 44 0 V96" stroke="#f2ede4" strokeWidth="5" strokeLinecap="round" />
              </g>
              <rect x="66" y="94" width="68" height="50" rx="10" fill="#16161a" stroke="#e8672c" strokeWidth="1.5" />
              <circle cx="100" cy="116" r="6" fill="#e8672c" />
              <rect x="98" y="118" width="4" height="14" rx="2" fill="#e8672c" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
