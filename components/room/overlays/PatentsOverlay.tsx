"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Shell from "./Shell";
import { patents, site } from "@/data/content";

type Patent = (typeof patents)[number];
type Scene = { kind: "title" | "patent" | "outro"; duration: number; patent?: Patent; index?: number };

const SCENES: Scene[] = [
  { kind: "title", duration: 4.5 },
  ...patents.map((p, i) => ({ kind: "patent" as const, duration: 10, patent: p, index: i })),
  { kind: "outro", duration: 5 },
];
const TOTAL = SCENES.reduce((a, s) => a + s.duration, 0);
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Patents play on the laptop as a short video with chapters, a scrubber and play/pause. */
export default function PatentsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0); // seconds into the current scene
  const [ended, setEnded] = useState(false);
  const stateRef = useRef({ scene: 0, t: 0, playing: false });

  useEffect(() => {
    if (open) {
      stateRef.current = { scene: 0, t: 0, playing: true };
      setScene(0);
      setT(0);
      setEnded(false);
      setPlaying(true);
    } else {
      stateRef.current.playing = false;
      setPlaying(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = (now - last) / 1000;
      last = now;
      const st = stateRef.current;
      if (!st.playing) return;
      st.t += dt;
      if (st.t >= SCENES[st.scene].duration) {
        if (st.scene >= SCENES.length - 1) {
          st.t = SCENES[st.scene].duration;
          st.playing = false;
          setPlaying(false);
          setEnded(true);
        } else {
          st.scene += 1;
          st.t = 0;
          setScene(st.scene);
        }
      }
      setT(st.t);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const goTo = useCallback((i: number) => {
    const st = stateRef.current;
    st.scene = Math.max(0, Math.min(SCENES.length - 1, i));
    st.t = 0;
    st.playing = true;
    setScene(st.scene);
    setT(0);
    setEnded(false);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    const st = stateRef.current;
    if (st.scene === SCENES.length - 1 && st.t >= SCENES[st.scene].duration) {
      goTo(0);
      return;
    }
    st.playing = !st.playing;
    setPlaying(st.playing);
  }, [goTo]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "ArrowRight") goTo(stateRef.current.scene + 1);
      if (e.key === "ArrowLeft") goTo(stateRef.current.scene - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, toggle, goTo]);

  const elapsed = SCENES.slice(0, scene).reduce((a, s) => a + s.duration, 0) + Math.min(t, SCENES[scene].duration);
  const current = SCENES[scene];

  return (
    <Shell cls="laptop-overlay" open={open} onClose={onClose} label="Patents">
      <div className="laptop-overlay__center">
        <div className="laptop">
          <div className="laptop__cam" />
          <div className={`player${playing ? " is-playing" : ""}`} onClick={toggle}>
            <div className="player__top">
              <span className="player__file">▶ patents-and-innovations.mp4</span>
              <span className="player__badge">1080p</span>
            </div>

            <div className="player__stage" key={scene}>
              <div className="player__glow" />
              {current.kind === "title" ? (
                <div className="scene scene--title">
                  <div className="scene__kicker">{site.name.toUpperCase()} PRESENTS</div>
                  <h1>Patents &amp; Innovations</h1>
                  <p>Two granted UK registered designs</p>
                </div>
              ) : null}
              {current.kind === "patent" && current.patent ? (
                <div className="scene scene--patent">
                  <div className="scene__kicker">
                    CHAPTER {(current.index ?? 0) + 1} · {current.patent.domain.toUpperCase()}
                  </div>
                  <h2>{current.patent.title}</h2>
                  <p className="scene__body">{current.patent.body}</p>
                  <div className="scene__meta">
                    <span>
                      <small>Registration</small>
                      {current.patent.id}
                    </span>
                    <span>
                      <small>Granted</small>
                      {current.patent.granted}
                    </span>
                  </div>
                  <div className="scene__stamp">GRANTED</div>
                </div>
              ) : null}
              {current.kind === "outro" ? (
                <div className="scene scene--outro">
                  <div className="scene__kicker">END OF FILM</div>
                  <h2>Ideas become products.</h2>
                  <p>Find the research behind them in the books on the shelf.</p>
                  {ended ? (
                    <button
                      className="player__replay"
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(0);
                      }}
                    >
                      ↻ Replay
                    </button>
                  ) : null}
                </div>
              ) : null}
              {!playing && !ended ? <div className="player__paused">❚❚</div> : null}
            </div>

            <div className="player__controls" onClick={(e) => e.stopPropagation()}>
              <div className="player__bar" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const frac = (e.clientX - rect.left) / rect.width;
                let acc = 0;
                const idx = SCENES.findIndex((s) => {
                  acc += s.duration;
                  return frac * TOTAL < acc;
                });
                goTo(idx === -1 ? SCENES.length - 1 : idx);
              }}>
                <div className="player__bar-fill" style={{ width: `${(elapsed / TOTAL) * 100}%` }} />
                {SCENES.slice(1).map((_, i) => {
                  const at = SCENES.slice(0, i + 1).reduce((a, s) => a + s.duration, 0);
                  return <i key={i} style={{ left: `${(at / TOTAL) * 100}%` }} />;
                })}
              </div>
              <div className="player__row">
                <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                  {playing ? "❚❚" : "▶"}
                </button>
                <button onClick={() => goTo(scene - 1)} aria-label="Previous chapter">
                  ⏮
                </button>
                <button onClick={() => goTo(scene + 1)} aria-label="Next chapter">
                  ⏭
                </button>
                <span className="player__time">
                  {fmt(elapsed)} / {fmt(TOTAL)}
                </span>
                <span className="player__chapter">
                  {current.kind === "patent" ? `Chapter ${(current.index ?? 0) + 1} of ${patents.length}` : current.kind === "title" ? "Intro" : "Credits"}
                </span>
                <span className="player__spacer" />
                <span className="player__kbd">space · ← →</span>
              </div>
            </div>
          </div>
          <div className="laptop__base" />
        </div>
      </div>
    </Shell>
  );
}
