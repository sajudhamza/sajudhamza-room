"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/content";
import { menu, type OverlayKey } from "@/data/room";

type Props = {
  progress: number;
  ready: boolean;
  error: string | null;
  active: OverlayKey | null;
  night: boolean;
  onOpen: (key: OverlayKey) => void;
  onToggleNight: () => void;
};

/** Everything drawn over the canvas: loader, brand, menu, hint and quick actions. */
export default function RoomUI({ progress, ready, error, active, night, onOpen, onToggleNight }: Props) {
  const [loaderGone, setLoaderGone] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setLoaderGone(true), 900);
    return () => clearTimeout(t);
  }, [ready]);

  const pct = Math.round(progress * 100);

  return (
    <>
      {!loaderGone ? (
        <div className={`loader${ready ? " is-done" : ""}`} aria-live="polite">
          <div className="loader__inner">
            <div className="loader__kicker">Interactive 3D portfolio</div>
            <div className="loader__name">
              {site.name}
              <span>{site.surname}</span>
            </div>
            <div className="loader__bar">
              <div className="loader__fill" style={{ transform: `scaleX(${progress})` }} />
            </div>
            <div className="loader__meta">
              <span>{error ?? (ready ? "Entering the room" : "Building the room")}</span>
              <span className="mono">{pct}%</span>
            </div>
          </div>
        </div>
      ) : null}

      <header className="hud hud--top">
        <div className="brand">
          <div className="brand__name">
            {site.name} {site.surname}
          </div>
          <div className="brand__role">{site.kicker}</div>
        </div>
        <div className="hud__actions">
          <button className="chip chip--icon" onClick={onToggleNight} aria-label={night ? "Switch to daylight" : "Switch to night"} title={night ? "Daylight" : "Night"}>
            {night ? "☀" : "☾"}
          </button>
          <a className="chip chip--hide-sm" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="chip chip--hide-sm" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="chip chip--hide-sm" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </header>

      <nav className={`hud hud--bottom${ready ? " is-ready" : ""}`} aria-label="Sections">
        <p className="hud-hint">{touch ? "Drag to look around · Pinch to zoom · Tap a glowing dot" : "Drag to look around · Scroll to zoom · Click a glowing dot"}</p>
        <div className="legend">
          {menu.map((m) => (
            <button key={m.key} className={`legend__item${active === m.key ? " is-active" : ""}`} onClick={() => onOpen(m.key)}>
              <span className={`legend__dot${m.key === "vault" ? " legend__dot--lock" : ""}`} />
              {m.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
