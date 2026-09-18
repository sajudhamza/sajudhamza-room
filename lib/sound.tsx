"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Tiny synthesized UI sound engine — no audio files required.
 * Everything is generated with the Web Audio API so the site stays self-contained.
 */
type Kind = "hover" | "click" | "tick" | "unlock" | "whoosh";

type Ctx = {
  on: boolean;
  toggle: () => void;
  play: (k: Kind) => void;
};

const SoundCtx = createContext<Ctx>({ on: false, toggle: () => {}, play: () => {} });

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const ac = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const lastHover = useRef(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("sfx") === "1") setOn(true);
    } catch {}
  }, []);

  const ensure = useCallback(() => {
    if (!ac.current) {
      const A = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      ac.current = new A();
      master.current = ac.current.createGain();
      master.current.gain.value = 0.35;
      master.current.connect(ac.current.destination);
    }
    if (ac.current.state === "suspended") ac.current.resume();
    return ac.current;
  }, []);

  const play = useCallback(
    (k: Kind) => {
      if (!on) return;
      const ctx = ensure();
      const out = master.current!;
      const t = ctx.currentTime;

      const tone = (freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(out);
        o.start(t);
        o.stop(t + dur + 0.02);
      };

      const noise = (dur: number, vol: number, hp = 1200) => {
        const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const s = ctx.createBufferSource();
        s.buffer = buf;
        const f = ctx.createBiquadFilter();
        f.type = "highpass";
        f.frequency.value = hp;
        const g = ctx.createGain();
        g.gain.value = vol;
        s.connect(f).connect(g).connect(out);
        s.start(t);
      };

      switch (k) {
        case "hover": {
          const now = performance.now();
          if (now - lastHover.current < 60) return;
          lastHover.current = now;
          tone(1800, 0.05, "sine", 0.08, 2400);
          break;
        }
        case "click":
          tone(520, 0.08, "triangle", 0.25, 260);
          noise(0.05, 0.12, 3000);
          break;
        case "tick":
          tone(3200, 0.03, "square", 0.05);
          break;
        case "whoosh":
          noise(0.35, 0.18, 400);
          break;
        case "unlock":
          [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sine";
            o.frequency.value = f;
            const st = t + i * 0.07;
            g.gain.setValueAtTime(0, st);
            g.gain.linearRampToValueAtTime(0.2, st + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, st + 0.5);
            o.connect(g).connect(out);
            o.start(st);
            o.stop(st + 0.55);
          });
          break;
      }
    },
    [on, ensure]
  );

  const toggle = useCallback(() => {
    setOn((v) => {
      const nv = !v;
      try {
        localStorage.setItem("sfx", nv ? "1" : "0");
      } catch {}
      if (nv) {
        // confirm audibly on enable
        const ctx = ensure();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(660, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.12);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        o.connect(g).connect(master.current!);
        o.start();
        o.stop(ctx.currentTime + 0.32);
      }
      return nv;
    });
  }, [ensure]);

  // Global delegation: any element with data-sfx gets hover/click sounds.
  useEffect(() => {
    if (!on) return;
    const over = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.("[data-sfx], a, button");
      if (el) play("hover");
    };
    const down = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.("[data-sfx], a, button");
      if (el) play("click");
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerdown", down);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
    };
  }, [on, play]);

  const value = useMemo(() => ({ on, toggle, play }), [on, toggle, play]);
  return <SoundCtx.Provider value={value}>{children}</SoundCtx.Provider>;
}

export const useSound = () => useContext(SoundCtx);
