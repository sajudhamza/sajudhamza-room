import * as THREE from "three";
import { gsap } from "gsap";
import type Experience from "./Experience";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** A camera pose: spherical offset around a target point. */
export type CameraView = { radius: number; phi: number; theta: number; target: [number, number, number] };

/** Orbit-style navigation: drag to orbit, right-drag / two fingers to pan, wheel to zoom.
 *  `focus()` flies the camera to a fixed pose (and disables input) and `release()` flies back. */
export default class Navigation {
  enabled = true;

  private spherical = new THREE.Spherical(30, Math.PI * 0.35, -Math.PI * 0.25);
  private sphericalSmoothed = this.spherical.clone();
  private target = new THREE.Vector3(0, 2, 0);
  private targetSmoothed = this.target.clone();

  private drag = { deltaX: 0, deltaY: 0, prevX: 0, prevY: 0, alternative: false };
  private zoomDelta = 0;
  private tmp = new THREE.Vector3();
  private el: HTMLElement;

  private focused = false;
  private saved: CameraView | null = null;
  private timeline: gsap.core.Timeline | null = null;

  private readonly limits = {
    radius: { min: 10, max: 50 },
    phi: { min: 0.01, max: Math.PI * 0.5 },
    theta: { min: -Math.PI * 0.5, max: 0 },
    x: { min: -4, max: 4 },
    y: { min: 1, max: 6 },
    z: { min: -4, max: 4 },
  };

  constructor(private experience: Experience) {
    this.el = experience.target;

    // Portrait screens see a narrow slice of the room; start further back so the whole room fits.
    const { width, height } = experience.config;
    if (width < height) {
      this.spherical.radius = Math.min(this.limits.radius.max, 30 * (height / width) * 0.85);
      this.sphericalSmoothed.radius = this.spherical.radius;
    }

    this.el.addEventListener("mousedown", this.onMouseDown);
    this.el.addEventListener("touchstart", this.onTouchStart, { passive: false });
    this.el.addEventListener("wheel", this.onWheel, { passive: false });
    this.el.addEventListener("contextmenu", this.onContextMenu);
  }

  /* ── Scripted camera moves ── */

  getView(): CameraView {
    return {
      radius: this.spherical.radius,
      phi: this.spherical.phi,
      theta: this.spherical.theta,
      target: [this.target.x, this.target.y, this.target.z],
    };
  }

  /** Fly to `view`. `onArrive` fires at `arriveAt` (0..1) of the flight so UI can appear as the camera settles. */
  focus(view: CameraView, duration = 1.5, onArrive?: () => void, arriveAt = 0.6) {
    if (!this.focused) this.saved = this.getView();
    this.focused = true;
    this.enabled = false;
    this.drag.deltaX = this.drag.deltaY = this.zoomDelta = 0;

    this.timeline?.kill();
    this.timeline = gsap.timeline();
    this.timeline.to(this.spherical, { radius: view.radius, phi: view.phi, theta: view.theta, duration, ease: "power2.inOut" }, 0);
    this.timeline.to(this.target, { x: view.target[0], y: view.target[1], z: view.target[2], duration, ease: "power2.inOut" }, 0);
    if (onArrive) this.timeline.call(onArrive, [], duration * arriveAt);
  }

  /** Fly back to where the visitor was before `focus()` and hand control back. */
  release(duration = 1.4) {
    if (!this.focused) return;
    const view = this.saved ?? this.getView();
    this.saved = null;
    this.timeline?.kill();
    this.timeline = gsap.timeline({
      onComplete: () => {
        this.focused = false;
        this.enabled = true;
      },
    });
    this.timeline.to(this.spherical, { radius: view.radius, phi: view.phi, theta: view.theta, duration, ease: "power2.inOut" }, 0);
    this.timeline.to(this.target, { x: view.target[0], y: view.target[1], z: view.target[2], duration, ease: "power2.inOut" }, 0);
  }

  /* ── Mouse ── */
  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (!this.enabled) return;
    this.drag.alternative = e.button === 2 || e.button === 1 || e.ctrlKey || e.shiftKey;
    this.drag.prevX = e.clientX;
    this.drag.prevY = e.clientY;
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    this.move(e.clientX, e.clientY);
  };

  private onMouseUp = () => {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  };

  /* ── Touch ── */
  private onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    if (!this.enabled) return;
    this.drag.alternative = e.touches.length > 1;
    this.drag.prevX = e.touches[0].clientX;
    this.drag.prevY = e.touches[0].clientY;
    window.addEventListener("touchmove", this.onTouchMove, { passive: false });
    window.addEventListener("touchend", this.onTouchEnd);
    window.addEventListener("touchcancel", this.onTouchEnd);
  };

  private onTouchMove = (e: TouchEvent) => {
    if (!e.touches[0]) return;
    e.preventDefault();
    this.move(e.touches[0].clientX, e.touches[0].clientY);
  };

  private onTouchEnd = () => {
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
    window.removeEventListener("touchcancel", this.onTouchEnd);
  };

  /* ── Wheel ── */
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (!this.enabled) return;
    let pixelY = e.deltaY;
    if (e.deltaMode === 1) pixelY *= 40;
    else if (e.deltaMode === 2) pixelY *= 800;
    const factor = this.experience.config.width < 768 ? 0.55 : 1;
    this.zoomDelta += pixelY * factor;
  };

  private onContextMenu = (e: Event) => e.preventDefault();

  private move(x: number, y: number) {
    this.drag.deltaX += x - this.drag.prevX;
    this.drag.deltaY += y - this.drag.prevY;
    this.drag.prevX = x;
    this.drag.prevY = y;
  }

  update() {
    const { delta } = this.experience.time;
    const { width, smallestSide } = this.experience.config;
    const cam = this.experience.camera.instance;
    const L = this.limits;

    if (this.enabled) {
      // Zoom
      this.spherical.radius = clamp(this.spherical.radius + this.zoomDelta * 0.01, L.radius.min, L.radius.max);

      if (this.drag.alternative) {
        // Pan the orbit target
        this.tmp.set(0, 1, 0).applyQuaternion(cam.quaternion).multiplyScalar(this.drag.deltaY * 0.01);
        this.target.add(this.tmp);
        this.tmp.set(-1, 0, 0).applyQuaternion(cam.quaternion).multiplyScalar(this.drag.deltaX * 0.01);
        this.target.add(this.tmp);
        this.target.x = clamp(this.target.x, L.x.min, L.x.max);
        this.target.y = clamp(this.target.y, L.y.min, L.y.max);
        this.target.z = clamp(this.target.z, L.z.min, L.z.max);
      } else {
        const mobile = width < 768 ? 0.52 : 1;
        this.spherical.theta = clamp(this.spherical.theta - (this.drag.deltaX * mobile) / smallestSide, L.theta.min, L.theta.max);
        this.spherical.phi = clamp(this.spherical.phi - (this.drag.deltaY * mobile) / smallestSide, L.phi.min, L.phi.max);
      }
    }

    this.drag.deltaX = 0;
    this.drag.deltaY = 0;
    this.zoomDelta = 0;

    // Smoothing
    const s = Math.min(1, 0.005 * delta);
    this.sphericalSmoothed.radius += (this.spherical.radius - this.sphericalSmoothed.radius) * s;
    this.sphericalSmoothed.phi += (this.spherical.phi - this.sphericalSmoothed.phi) * s;
    this.sphericalSmoothed.theta += (this.spherical.theta - this.sphericalSmoothed.theta) * s;
    this.targetSmoothed.lerp(this.target, s);

    cam.position.setFromSpherical(this.sphericalSmoothed).add(this.targetSmoothed);
    cam.lookAt(this.targetSmoothed);
  }

  destroy() {
    this.timeline?.kill();
    this.el.removeEventListener("mousedown", this.onMouseDown);
    this.el.removeEventListener("touchstart", this.onTouchStart);
    this.el.removeEventListener("wheel", this.onWheel);
    this.el.removeEventListener("contextmenu", this.onContextMenu);
    this.onMouseUp();
    this.onTouchEnd();
  }
}
