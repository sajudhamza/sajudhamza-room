"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { about, site, stats } from "@/data/content";
import { intro } from "@/data/room";

type Zone = { key: string; label: string; x: number; y: number; r: number; color: string };

const WORLD = { w: 2800, h: 2000 };
const ZONES: Zone[] = [
  { key: "about", label: "ABOUT ME", x: 1400, y: 420, r: 220, color: "#818cf8" },
  { key: "work", label: "WHAT I DO", x: 2250, y: 720, r: 220, color: "#22d3ee" },
  { key: "journey", label: "MY JOURNEY", x: 2300, y: 1450, r: 220, color: "#f59e0b" },
  { key: "projects", label: "PROJECTS", x: 1400, y: 1640, r: 220, color: "#34d399" },
  { key: "stats", label: "BY THE NUMBERS", x: 500, y: 1450, r: 220, color: "#f472b6" },
  { key: "contact", label: "CONTACT", x: 480, y: 720, r: 220, color: "#a78bfa" },
];

// Deterministic scenery so the map looks the same every visit.
const TREES = Array.from({ length: 70 }, (_, i) => {
  const a = i * 2.399;
  const rad = 250 + ((i * 97) % 700);
  const cx = WORLD.w / 2 + Math.cos(a) * rad * 1.7;
  const cy = WORLD.h / 2 + Math.sin(a) * rad * 1.15;
  return { x: Math.max(60, Math.min(WORLD.w - 60, cx)), y: Math.max(60, Math.min(WORLD.h - 60, cy)), s: 16 + (i % 4) * 5 };
}).filter((t) => ZONES.every((z) => Math.hypot(t.x - z.x, t.y - z.y) > z.r + 60) && Math.hypot(t.x - WORLD.w / 2, t.y - WORLD.h / 2) > 200);

const CONES = Array.from({ length: 16 }, (_, i) => ({ x: 300 + ((i * 431) % 2200), y: 250 + ((i * 677) % 1500) })).filter(
  (c) => ZONES.every((z) => Math.hypot(c.x - z.x, c.y - z.y) > z.r + 40)
);

type Keys = { up: boolean; down: boolean; left: boolean; right: boolean; brake: boolean };

function zoneContent(key: string): { title: string; body: ReactNode } | null {
  switch (key) {
    case "about":
      return {
        title: "About me",
        body: (
          <>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p>
              <em>{intro.tagline}</em>
            </p>
          </>
        ),
      };
    case "work":
      return {
        title: "What I do",
        body: (
          <div className="drive__grid">
            {intro.whatIDo.map((c) => (
              <div key={c.title}>
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        ),
      };
    case "journey":
      return {
        title: "My journey",
        body: (
          <>
            {intro.journey.map((p) => (
              <p key={p.slice(0, 20)} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </>
        ),
      };
    case "projects":
      return {
        title: "Projects",
        body: (
          <div className="drive__grid">
            {intro.projects.map((c) => (
              <div key={c.title}>
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        ),
      };
    case "stats":
      return {
        title: "By the numbers",
        body: (
          <div className="drive__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <b>
                  {s.value}
                  {s.suffix}
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        ),
      };
    case "contact":
      return {
        title: "Contact",
        body: (
          <>
            <p>Open to collaborations, research and a good conversation about technology that solves real problems.</p>
            <div className="intro-links">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={site.phoneHref}>{site.phone}</a>
            </div>
          </>
        ),
      };
    default:
      return null;
  }
}

/** Top-down driving game drawn on a canvas. Drive into a zone to read that part of the profile. */
export default function DriveGame({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const keys = useRef<Keys>({ up: false, down: false, left: false, right: false, brake: false });
  const [zone, setZone] = useState<string | null>(null);
  const [moved, setMoved] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const car = { x: WORLD.w / 2, y: WORLD.h / 2 + 120, angle: -Math.PI / 2, speed: 0 };
    const cam = { x: car.x, y: car.y };
    let width = 1;
    let height = 1;
    let dpr = 1;
    let zoom = 1;
    let currentZone: string | null = null;
    let hasMoved = false;
    let last = performance.now();
    let raf = 0;
    const k = keys.current;
    k.up = k.down = k.left = k.right = k.brake = false;

    const measure = () => {
      // Layout size, not the bounding box: the monitor is mid "power-on" scale animation when the game mounts.
      width = Math.max(1, host.clientWidth);
      height = Math.max(1, host.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      zoom = width < 640 ? 0.62 : width < 900 ? 0.8 : 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);

    const setKey = (e: KeyboardEvent, down: boolean) => {
      let handled = true;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          k.up = down;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          k.down = down;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          k.left = down;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          k.right = down;
          break;
        case " ":
          k.brake = down;
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    };
    const onDown = (e: KeyboardEvent) => setKey(e, true);
    const onUp = (e: KeyboardEvent) => setKey(e, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    const MAX = 640;
    const step = (dt: number) => {
      const accel = k.up ? 1100 : k.down ? -650 : 0;
      car.speed += accel * dt;
      if (k.brake) car.speed *= Math.max(0, 1 - 4 * dt);
      car.speed *= Math.max(0, 1 - 1.4 * dt);
      car.speed = Math.max(-MAX * 0.5, Math.min(MAX, car.speed));
      if (Math.abs(car.speed) < 4 && !accel) car.speed = 0;

      const steer = (k.left ? -1 : 0) + (k.right ? 1 : 0);
      const grip = Math.min(1, Math.abs(car.speed) / 240);
      car.angle += steer * 2.7 * grip * dt * Math.sign(car.speed || 1);

      car.x += Math.cos(car.angle) * car.speed * dt;
      car.y += Math.sin(car.angle) * car.speed * dt;
      if (car.x < 40 || car.x > WORLD.w - 40 || car.y < 40 || car.y > WORLD.h - 40) {
        car.x = Math.max(40, Math.min(WORLD.w - 40, car.x));
        car.y = Math.max(40, Math.min(WORLD.h - 40, car.y));
        car.speed *= -0.35;
      }
      if ((k.up || k.down) && !hasMoved) {
        hasMoved = true;
        setMoved(true);
      }

      // Camera follows with a little lead in the driving direction.
      const lead = Math.min(160, Math.abs(car.speed) * 0.25);
      const tx = car.x + Math.cos(car.angle) * lead;
      const ty = car.y + Math.sin(car.angle) * lead;
      cam.x += (tx - cam.x) * Math.min(1, 4 * dt);
      cam.y += (ty - cam.y) * Math.min(1, 4 * dt);
      const vw = width / zoom;
      const vh = height / zoom;
      cam.x = Math.max(vw / 2, Math.min(WORLD.w - vw / 2, cam.x));
      cam.y = Math.max(vh / 2, Math.min(WORLD.h - vh / 2, cam.y));

      const z = ZONES.find((zz) => Math.hypot(car.x - zz.x, car.y - zz.y) < zz.r);
      const key = z ? z.key : null;
      if (key !== currentZone) {
        currentZone = key;
        setZone(key);
      }
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-cam.x, -cam.y);

      // Ground
      ctx.fillStyle = "#0d1220";
      ctx.fillRect(0, 0, WORLD.w, WORLD.h);
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= WORLD.w; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD.h);
        ctx.stroke();
      }
      for (let y = 0; y <= WORLD.h; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD.w, y);
        ctx.stroke();
      }

      // Road loop through the zones
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ZONES.forEach((z, i) => (i === 0 ? ctx.moveTo(z.x, z.y) : ctx.lineTo(z.x, z.y)));
      ctx.closePath();
      ctx.strokeStyle = "#151b2c";
      ctx.lineWidth = 170;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 4;
      ctx.setLineDash([40, 40]);
      ctx.stroke();
      ctx.setLineDash([]);
      // Spokes from the centre plaza
      ctx.strokeStyle = "#151b2c";
      ctx.lineWidth = 120;
      for (const z of ZONES) {
        ctx.beginPath();
        ctx.moveTo(WORLD.w / 2, WORLD.h / 2);
        ctx.lineTo(z.x, z.y);
        ctx.stroke();
      }
      // Plaza
      ctx.beginPath();
      ctx.arc(WORLD.w / 2, WORLD.h / 2, 190, 0, Math.PI * 2);
      ctx.fillStyle = "#151b2c";
      ctx.fill();
      ctx.strokeStyle = "rgba(129,140,248,0.35)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "700 26px 'Inter Variable', Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SAJUD HAMZA", WORLD.w / 2, WORLD.h / 2 - 16);
      ctx.font = "500 16px 'JetBrains Mono Variable', 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("drive into a zone to read", WORLD.w / 2, WORLD.h / 2 + 18);

      // Scenery
      for (const t of TREES) {
        ctx.beginPath();
        ctx.arc(t.x + 6, t.y + 8, t.s, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.s, 0, Math.PI * 2);
        ctx.fillStyle = "#1f5f46";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(t.x - t.s * 0.3, t.y - t.s * 0.3, t.s * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#2f8a63";
        ctx.fill();
      }
      for (const c of CONES) {
        ctx.beginPath();
        ctx.moveTo(c.x, c.y - 14);
        ctx.lineTo(c.x + 10, c.y + 10);
        ctx.lineTo(c.x - 10, c.y + 10);
        ctx.closePath();
        ctx.fillStyle = "#f97316";
        ctx.fill();
      }

      // Zones
      const pulse = 0.5 + Math.sin(now * 0.003) * 0.5;
      for (const z of ZONES) {
        const isActive = z.key === currentZone;
        const g = ctx.createRadialGradient(z.x, z.y, 0, z.x, z.y, z.r);
        g.addColorStop(0, `${z.color}${isActive ? "55" : "22"}`);
        g.addColorStop(1, `${z.color}00`);
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = z.color;
        ctx.globalAlpha = isActive ? 0.9 : 0.3 + pulse * 0.2;
        ctx.lineWidth = isActive ? 6 : 3;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = isActive ? "#ffffff" : "rgba(255,255,255,0.8)";
        ctx.font = "800 44px 'Inter Variable', Inter, sans-serif";
        ctx.fillText(z.label, z.x, z.y - 8);
        ctx.font = "500 15px 'JetBrains Mono Variable', 'JetBrains Mono', monospace";
        ctx.fillStyle = z.color;
        ctx.fillText(isActive ? "● READING" : "drive here", z.x, z.y + 30);
      }

      // Car
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(4, 6, 30, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111827";
      for (const [wx, wy] of [
        [-16, -15],
        [16, -15],
        [-16, 15],
        [16, 15],
      ]) {
        ctx.fillRect(wx - 6, wy - 4, 12, 8);
      }
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.roundRect(-26, -13, 52, 26, 7);
      ctx.fill();
      ctx.fillStyle = "#a5b4fc";
      ctx.beginPath();
      ctx.roundRect(-10, -10, 22, 20, 4);
      ctx.fill();
      ctx.fillStyle = "#e0e7ff";
      ctx.fillRect(6, -9, 5, 18);
      ctx.fillStyle = "#fde68a";
      ctx.fillRect(24, -10, 3, 6);
      ctx.fillRect(24, 4, 3, 6);
      ctx.fillStyle = k.brake || k.down ? "#ef4444" : "#7f1d1d";
      ctx.fillRect(-27, -10, 3, 6);
      ctx.fillRect(-27, 4, 3, 6);
      ctx.restore();

      ctx.restore();

      // Mini-map (screen space)
      const mw = 150;
      const mh = (mw * WORLD.h) / WORLD.w;
      const mx = width - mw - 14;
      const my = 14;
      ctx.fillStyle = "rgba(2,6,23,0.7)";
      ctx.beginPath();
      ctx.roundRect(mx - 6, my - 6, mw + 12, mh + 12, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
      const sx = mw / WORLD.w;
      for (const z of ZONES) {
        ctx.beginPath();
        ctx.arc(mx + z.x * sx, my + z.y * sx, 4, 0, Math.PI * 2);
        ctx.fillStyle = z.color;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(mx + car.x * sx, my + car.y * sx, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      // Speed
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "600 12px 'JetBrains Mono Variable', 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${Math.round(Math.abs(car.speed) / 5)} km/h`, 16, height - 18);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw(now);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      setZone(null);
      setMoved(false);
    };
  }, [active]);

  const press = (key: keyof Keys, down: boolean) => () => {
    keys.current[key] = down;
  };
  const card = zone ? zoneContent(zone) : null;

  return (
    <div className="drive" ref={hostRef}>
      <canvas ref={canvasRef} className="drive__canvas" />

      {!moved ? (
        <div className="drive__hint">
          <strong>{touch ? "Use the buttons to drive" : "Arrow keys or WASD to drive · Space to brake"}</strong>
          <span>Drive into a glowing zone to read that part of my profile</span>
        </div>
      ) : null}

      {card ? (
        <div className="drive__card" key={zone}>
          <div className="drive__card-head">
            <span className="drive__card-dot" style={{ background: ZONES.find((z) => z.key === zone)?.color }} />
            <h3>{card.title}</h3>
            <span className="drive__card-leave">drive away to close</span>
          </div>
          <div className="drive__card-body">{card.body}</div>
        </div>
      ) : null}

      {touch ? (
        <div className="drive__pad" aria-label="Driving controls">
          <div className="drive__pad-group">
            <button onPointerDown={press("left", true)} onPointerUp={press("left", false)} onPointerLeave={press("left", false)} aria-label="Steer left">
              ◀
            </button>
            <button onPointerDown={press("right", true)} onPointerUp={press("right", false)} onPointerLeave={press("right", false)} aria-label="Steer right">
              ▶
            </button>
          </div>
          <div className="drive__pad-group">
            <button onPointerDown={press("down", true)} onPointerUp={press("down", false)} onPointerLeave={press("down", false)} aria-label="Reverse">
              ▼
            </button>
            <button onPointerDown={press("up", true)} onPointerUp={press("up", false)} onPointerLeave={press("up", false)} aria-label="Accelerate" className="is-gas">
              ▲
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
