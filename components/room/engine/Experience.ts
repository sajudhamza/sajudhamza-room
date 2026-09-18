import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Resources from "./Resources";
import Navigation from "./Navigation";
import World, { type WorldOptions } from "./World";
import Hotspots, { type HotspotDef } from "./Hotspots";

export type ExperienceOptions = {
  target: HTMLElement;
  tooltip: HTMLElement | null;
  hotspots: HotspotDef[];
  world: WorldOptions;
  onSelect: (key: string) => void;
  onProgress: (loaded: number, total: number) => void;
  onReady: () => void;
  onError: (message: string) => void;
};

/** Owns the Three.js scene, the render loop and every sub-system. One instance per mounted canvas. */
export default class Experience {
  target: HTMLElement;
  config = { width: 1, height: 1, pixelRatio: 1, smallestSide: 1 };
  time = { start: 0, current: 0, elapsed: 0, delta: 16 };
  scene = new THREE.Scene();
  camera: Camera;
  renderer: Renderer;
  resources: Resources;
  navigation: Navigation;
  world?: World;
  hotspots?: Hotspots;

  private raf = 0;
  private destroyed = false;
  private observer?: ResizeObserver;
  private night: boolean;

  constructor(private options: ExperienceOptions) {
    this.target = options.target;
    this.night = options.world.night;
    this.measure();

    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.target.appendChild(this.renderer.instance.domElement);
    this.navigation = new Navigation(this);

    this.resources = new Resources();
    this.resources.on("progress", options.onProgress);
    this.resources.on("ready", () => this.buildWorld());
    this.resources.load();

    window.addEventListener("resize", this.resize);
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.target);
    }
    this.time.start = this.time.current = performance.now();
    this.tick();
  }

  private buildWorld() {
    if (this.destroyed) return;
    try {
      this.world = new World(this, { ...this.options.world, night: this.night });
      this.hotspots = new Hotspots(this, this.options.hotspots, this.options.tooltip, this.options.onSelect);
      this.options.onReady();
    } catch (err) {
      console.error(err);
      this.options.onError("The 3D room could not be loaded.");
    }
  }

  private measure() {
    const rect = this.target.getBoundingClientRect();
    this.config.width = rect.width || window.innerWidth;
    this.config.height = rect.height || window.innerHeight;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);
  }

  private resize = () => {
    const rect = this.target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.measure();
    this.camera.resize();
    this.renderer.resize();
  };

  private tick = () => {
    this.raf = window.requestAnimationFrame(this.tick);
    const now = performance.now();
    this.time.delta = Math.min(now - this.time.current, 60);
    this.time.elapsed += this.time.delta;
    this.time.current = now;

    this.navigation.update();
    this.camera.instance.updateMatrixWorld();
    this.world?.update();
    this.hotspots?.update();
    this.renderer.update();
  };

  /** Fly the camera to a hotspot's object. `onArrive` fires part-way so the overlay can appear as the camera settles. */
  focus(key: string, onArrive?: () => void) {
    const def = this.options.hotspots.find((h) => h.key === key);
    if (!def) {
      onArrive?.();
      return;
    }
    this.hotspots?.setVisible(false);
    this.hotspots?.setEnabled(false);
    this.navigation.focus(def.view, 1.5, onArrive);
  }

  /** Return to free navigation. */
  release() {
    this.navigation.release();
    this.hotspots?.setVisible(true);
    this.hotspots?.setEnabled(true);
  }

  /** Disable scene picking while an overlay is open. */
  setInteractive(interactive: boolean) {
    this.hotspots?.setEnabled(interactive);
    if (interactive) this.world?.resumeVideos();
  }

  setNight(night: boolean) {
    this.night = night;
    this.world?.setNight(night);
  }

  destroy() {
    this.destroyed = true;
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    this.observer?.disconnect();
    this.hotspots?.destroy();
    this.world?.destroy();
    this.navigation.destroy();
    this.resources.dispose();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.geometry?.dispose();
    });
    this.renderer.dispose();
  }
}
