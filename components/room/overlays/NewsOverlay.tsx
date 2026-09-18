"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Shell from "./Shell";
import { news } from "@/data/room";

const DWELL = 9000;
const OUTLET_COLORS: Record<string, string> = {
  Benzinga: "#1d4ed8",
  IBTimes: "#b91c1c",
  "Tech Times": "#0f766e",
  LatestLY: "#7c3aed",
};

/** Press coverage plays on the TV: every article is a channel. Flip with the buttons, arrow keys, or wait. */
export default function NewsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [ch, setCh] = useState(0);
  const [noise, setNoise] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef<number | null>(null);
  const ticker = news.map((n) => n.headline.toUpperCase()).join("   •   ");

  const switchTo = useCallback((i: number) => {
    const next = (i + news.length) % news.length;
    setNoise(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCh(next);
      setTick((t) => t + 1);
      timer.current = window.setTimeout(() => setNoise(false), 260);
    }, 230);
  }, []);

  useEffect(() => {
    if (open) {
      setCh(0);
      setTick((t) => t + 1);
      setNoise(true);
      const id = window.setTimeout(() => setNoise(false), 450);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // Auto-advance like a real broadcast unless the viewer is hovering.
  useEffect(() => {
    if (!open || paused) return;
    const id = window.setTimeout(() => switchTo(ch + 1), DWELL);
    return () => window.clearTimeout(id);
  }, [open, paused, ch, tick, switchTo]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowRight") switchTo(ch + 1);
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") switchTo(ch - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, ch, switchTo]);

  const item = news[ch];
  const [outlet, date] = item.byline.split(" — ");
  const color = OUTLET_COLORS[outlet] ?? "#6366f1";

  return (
    <Shell cls="news-overlay" open={open} onClose={onClose} label="Media and press">
      <div className="news-overlay__center">
        <div className="tv" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="tv__screen tv__screen--channel">
            <div className="channel" key={tick} style={{ ["--accent" as string]: color }}>
              <div className="channel__top">
                <span className="channel__num">CH {String(ch + 1).padStart(2, "0")}</span>
                <span className="tv__live">
                  <i />
                  LIVE
                </span>
                <span className="channel__outlet">{outlet}</span>
              </div>
              <div className="channel__center">
                <div className="channel__kicker">{item.featured ? "FEATURE STORY" : "IN THE NEWS"}</div>
                <h2 className="channel__headline">{item.headline}</h2>
              </div>
              <div className="channel__lower">
                <div className="channel__lower-bar">
                  <b>{outlet}</b>
                  <span>{date}</span>
                </div>
                <div className="channel__lower-body">
                  <p>{item.body}</p>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer">
                      Read the full story ↗
                    </a>
                  ) : null}
                </div>
              </div>
              {!paused ? <div className="channel__progress" key={`p${tick}`} style={{ animationDuration: `${DWELL}ms` }} /> : null}
            </div>
            <div className={`tv__noise${noise ? " is-on" : ""}`} />
          </div>
          <div className="tv__ticker" aria-hidden>
            <div className="tv__ticker-track">
              <span>{ticker}   •   </span>
              <span>{ticker}   •   </span>
            </div>
          </div>
          <div className="tv__buttons">
            <button onClick={() => switchTo(ch + 1)} aria-label="Next channel">
              CH +
            </button>
            <button onClick={() => switchTo(ch - 1)} aria-label="Previous channel">
              CH −
            </button>
            <span className="tv__brand">HH</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
