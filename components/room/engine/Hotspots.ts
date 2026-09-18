import * as THREE from "three";
import { gsap } from "gsap";
import type Experience from "./Experience";
import type { CameraView } from "./Navigation";

export type HotspotDef = { key: string; label: string; position: [number, number, number]; view: CameraView };

type Entry = {
  key: string;
  label: string;
  group: THREE.Group;
  dot: THREE.Mesh;
  glow: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
};

/** Glowing, pulsing markers in the scene. Hover shows a tooltip, click selects. */
export default class Hotspots {
  entries: Entry[] = [];
  enabled = true;
  /** 0..1 visibility multiplier, tweened by setVisible(). */
  private fade = { value: 1 };

  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private pointer = { x: -9999, y: -9999 };
  private down = { x: 0, y: 0 };
  private touchActive = false;
  private lastPick = 0;
  private hovered: Entry | null = null;
  private geometries: THREE.BufferGeometry[] = [];
  private el: HTMLElement;
  private projected = new THREE.Vector3();

  constructor(
    private experience: Experience,
    defs: HotspotDef[],
    private tooltip: HTMLElement | null,
    private onSelect: (key: string) => void
  ) {
    this.el = experience.target;
    this.build(defs);

    this.el.addEventListener("mousemove", this.onMouseMove);
    this.el.addEventListener("mousedown", this.onMouseDown);
    this.el.addEventListener("mouseup", this.onMouseUp);
    this.el.addEventListener("mouseleave", this.onMouseLeave);
    this.el.addEventListener("touchstart", this.onTouchStart, { passive: true });
    this.el.addEventListener("touchmove", this.onTouchMove, { passive: true });
    this.el.addEventListener("touchend", this.onTouchEnd, { passive: true });
  }

  private build(defs: HotspotDef[]) {
    const dotGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const glowGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.2, 0.28, 32);
    this.geometries.push(dotGeo, glowGeo, ringGeo);

    for (const def of defs) {
      const group = new THREE.Group();
      group.position.set(...def.position);

      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true }));
      const glow = new THREE.Mesh(
        glowGeo,
        new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.2, depthWrite: false })
      );
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
      );

      group.add(dot, glow, ring);
      this.experience.scene.add(group);
      this.entries.push({ key: def.key, label: def.label, group, dot, glow, ring });
    }
  }

  /* ── Pointer events ── */
  private onMouseMove = (e: MouseEvent) => {
    this.pointer.x = e.clientX;
    this.pointer.y = e.clientY;
  };

  private onMouseLeave = () => {
    this.pointer.x = -9999;
    this.pointer.y = -9999;
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    this.down.x = e.clientX;
    this.down.y = e.clientY;
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button !== 0) return;
    if (Math.abs(e.clientX - this.down.x) + Math.abs(e.clientY - this.down.y) > 12) return;
    this.pick(e.clientX, e.clientY);
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    this.touchActive = true;
    this.down.x = e.touches[0].clientX;
    this.down.y = e.touches[0].clientY;
    this.pointer.x = this.down.x;
    this.pointer.y = this.down.y;
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    this.pointer.x = e.touches[0].clientX;
    this.pointer.y = e.touches[0].clientY;
  };

  private onTouchEnd = (e: TouchEvent) => {
    if (!this.touchActive || e.changedTouches.length !== 1) return;
    this.touchActive = false;
    const t = e.changedTouches[0];
    if (Math.abs(t.clientX - this.down.x) + Math.abs(t.clientY - this.down.y) > 28) return;
    const now = performance.now();
    if (now - this.lastPick < 400) return;
    this.lastPick = now;
    this.pick(t.clientX, t.clientY);
  };

  private pick(x: number, y: number) {
    if (!this.enabled) return;
    const { width, height } = this.experience.config;
    this.ndc.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.experience.camera.instance);

    const meshes = this.entries.flatMap((e) => [e.dot, e.glow]);
    const hits = this.raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) {
      // Fall back to the screen-space proximity used for hover, which is friendlier on touch.
      if (this.hovered) this.onSelect(this.hovered.key);
      return;
    }
    const entry = this.entries.find((e) => e.dot === hits[0].object || e.glow === hits[0].object);
    if (entry) this.onSelect(entry.key);
  }

  /* ── Frame update ── */
  update() {
    const elapsed = this.experience.time.elapsed * 0.001;
    const cam = this.experience.camera.instance;

    const fade = this.fade.value;
    this.entries.forEach((e, i) => {
      e.group.visible = fade > 0.01;
      const phase = i * 1.2;
      const wave = Math.sin(elapsed * 2.5 + phase);
      (e.dot.material as THREE.MeshBasicMaterial).opacity = fade;
      e.glow.material.opacity = (0.15 + wave * 0.1) * fade;
      e.glow.scale.setScalar(1 + wave * 0.25);

      const ringCycle = ((elapsed + phase) % 3) / 3;
      e.ring.scale.setScalar(1 + ringCycle * 3);
      e.ring.material.opacity = (1 - ringCycle) * 0.35 * fade;
      e.ring.lookAt(cam.position);
    });

    this.updateHover();
  }

  private updateHover() {
    const { width, height } = this.experience.config;
    const cam = this.experience.camera.instance;

    let closest: Entry | null = null;
    let closestDist = width < 768 ? 64 : 40;
    let sx = 0;
    let sy = 0;

    if (this.enabled) {
      for (const e of this.entries) {
        this.projected.copy(e.group.position).project(cam);
        if (this.projected.z < -1 || this.projected.z > 1) continue;
        const px = (this.projected.x * 0.5 + 0.5) * width;
        const py = (-this.projected.y * 0.5 + 0.5) * height;
        const dist = Math.hypot(px - this.pointer.x, py - this.pointer.y);
        if (dist < closestDist) {
          closestDist = dist;
          closest = e;
          sx = px;
          sy = py;
        }
      }
    }

    if (closest) {
      this.el.style.cursor = "pointer";
      if (this.tooltip) {
        this.tooltip.textContent = closest.label;
        this.tooltip.style.left = `${sx}px`;
        this.tooltip.style.top = `${sy - 40}px`;
        this.tooltip.classList.add("is-visible");
      }
    } else {
      this.el.style.cursor = this.enabled ? "grab" : "default";
      this.tooltip?.classList.remove("is-visible");
    }
    this.hovered = closest;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.tooltip?.classList.remove("is-visible");
  }

  /** Fade the markers out while the camera is focused on one object. */
  setVisible(visible: boolean) {
    gsap.to(this.fade, { value: visible ? 1 : 0, duration: visible ? 0.8 : 0.4, ease: "power2.out" });
  }

  screenPosition(key: string): { x: number; y: number } | null {
    const e = this.entries.find((h) => h.key === key);
    if (!e) return null;
    const { width, height } = this.experience.config;
    this.projected.copy(e.group.position).project(this.experience.camera.instance);
    return { x: (this.projected.x * 0.5 + 0.5) * width, y: (-this.projected.y * 0.5 + 0.5) * height };
  }

  destroy() {
    gsap.killTweensOf(this.fade);
    this.el.removeEventListener("mousemove", this.onMouseMove);
    this.el.removeEventListener("mousedown", this.onMouseDown);
    this.el.removeEventListener("mouseup", this.onMouseUp);
    this.el.removeEventListener("mouseleave", this.onMouseLeave);
    this.el.removeEventListener("touchstart", this.onTouchStart);
    this.el.removeEventListener("touchmove", this.onTouchMove);
    this.el.removeEventListener("touchend", this.onTouchEnd);
    for (const e of this.entries) {
      this.experience.scene.remove(e.group);
      (e.dot.material as THREE.Material).dispose();
      e.glow.material.dispose();
      e.ring.material.dispose();
    }
    for (const g of this.geometries) g.dispose();
    this.entries = [];
  }
}
