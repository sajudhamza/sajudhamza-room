"use client";

import { useEffect, useRef, useState } from "react";
import Shell from "./Shell";
import { judgingEvents } from "@/data/room";

const BADGE = { judge: "Judge", review: "Reviewer" } as const;
const COVERS = [
  "linear-gradient(135deg,#6366f1,#22d3ee)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#10b981,#84cc16)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f97316,#ef4444)",
];
const initials = (s: string) =>
  s
    .replace(/[^A-Za-z ]/g, "")
    .split(/\s+/)
    .filter((w) => w && !/^(the|of|and|for|awards?)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/** Judging lives on the Switch by the TV: a console home screen where each event is a game tile. */
export default function JudgingOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sel, setSel] = useState(0);
  const [cert, setCert] = useState<string | null>(null);
  const [clock, setClock] = useState("");
  const row = useRef<HTMLDivElement>(null);
  const ev = judgingEvents[sel];

  useEffect(() => {
    if (!open) {
      setCert(null);
      return;
    }
    setSel(0);
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (cert) return;
      if (e.key === "ArrowRight") setSel((s) => Math.min(judgingEvents.length - 1, s + 1));
      if (e.key === "ArrowLeft") setSel((s) => Math.max(0, s - 1));
      if (e.key === "Enter" && judgingEvents[sel]?.cert) setCert(judgingEvents[sel].cert!);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cert, sel]);

  useEffect(() => {
    const tile = row.current?.children[sel] as HTMLElement | undefined;
    tile?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [sel]);

  const panels = judgingEvents.filter((e) => e.type === "judge").length;
  const reviews = judgingEvents.filter((e) => e.type === "review").length;

  return (
    <Shell cls="switch-overlay" open={open} onClose={onClose} label="Judging">
      <div className="switch-overlay__center">
        <div className="switch">
          <div className="joycon joycon--l">
            <span className="joycon__stick" />
            <span className="joycon__dpad">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="joycon__minus">−</span>
          </div>

          <div className="switch__screen">
            <div className="sw-top">
              <span className="sw-avatar">SH</span>
              <span className="sw-title">Judging &amp; Peer Review</span>
              <span className="sw-stats">
                🏆 {panels} panels · 📝 {reviews} reviews
              </span>
              <span className="sw-clock">{clock}</span>
            </div>

            <div className="sw-tiles" ref={row}>
              {judgingEvents.map((e, i) => (
                <button
                  key={`${e.org}-${e.date}`}
                  className={`sw-tile${i === sel ? " is-selected" : ""}`}
                  style={{ background: COVERS[i % COVERS.length] }}
                  onClick={() => (i === sel && e.cert ? setCert(e.cert) : setSel(i))}
                  aria-label={e.org}
                >
                  <span className="sw-tile__initials">{initials(e.org)}</span>
                  <span className={`sw-tile__badge sw-tile__badge--${e.type}`}>{BADGE[e.type]}</span>
                  <span className="sw-tile__name">{e.org}</span>
                </button>
              ))}
            </div>

            {ev ? (
              <div className="sw-detail" key={sel}>
                <div className="sw-detail__head">
                  <h3>{ev.title}</h3>
                  <span className="sw-detail__meta">
                    {ev.org} · {ev.date}
                  </span>
                </div>
                <p>{ev.body}</p>
                <div className="sw-detail__actions">
                  {ev.cert ? (
                    <button className="sw-btn sw-btn--a" onClick={() => setCert(ev.cert!)}>
                      <b>A</b> View certificate
                    </button>
                  ) : null}
                  {ev.panelLink ? (
                    <a className="sw-btn" href={ev.panelLink} target="_blank" rel="noreferrer">
                      <b>Y</b> Judge profile
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="sw-bottom">
              <span>
                <b>◀ ▶</b> Select
              </span>
              <span>
                <b>A</b> Open
              </span>
              <span>
                <b>B</b> Close
              </span>
              <span className="sw-bottom__count">
                {sel + 1} / {judgingEvents.length}
              </span>
            </div>

            <div className={`judge-cert-view${cert ? " is-open" : ""}`}>
              <button className="judge-cert-view__back" onClick={() => setCert(null)}>
                <b>B</b> Back
              </button>
              {cert ? <iframe src={cert} title="Certificate" /> : null}
            </div>
          </div>

          <div className="joycon joycon--r">
            <span className="joycon__plus">+</span>
            <span className="joycon__abxy">
              <i>X</i>
              <i>Y</i>
              <i>A</i>
              <i>B</i>
            </span>
            <span className="joycon__stick" />
          </div>
        </div>
      </div>
    </Shell>
  );
}
