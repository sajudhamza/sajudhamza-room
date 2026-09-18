import * as THREE from "three";
import type Experience from "../Experience";

/** Name + role rendered to a canvas and hung on the red wall above the TV. */
export default class WallIntro {
  private mesh: THREE.Mesh;
  private texture: THREE.CanvasTexture;
  private material: THREE.MeshBasicMaterial;
  private geometry: THREE.PlaneGeometry;

  constructor(private experience: Experience, lines: [string, string], subtitle: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    const cx = canvas.width / 2;

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 64px Inter, 'Inter Variable', system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(lines[0], cx, 40);
    ctx.fillText(lines[1], cx, 112);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "500 30px Inter, 'Inter Variable', system-ui, sans-serif";
    ctx.fillText(subtitle, cx, 210);

    ctx.fillStyle = "#6366f1";
    ctx.fillRect(cx - 50, 265, 100, 3);

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    const planeHeight = 2.2;
    this.geometry = new THREE.PlaneGeometry(planeHeight * (canvas.width / canvas.height), planeHeight);
    this.geometry.rotateY(-Math.PI * 0.5);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthWrite: false });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(4.18, 4.6, 1.3);
    experience.scene.add(this.mesh);
  }

  destroy() {
    this.experience.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }
}
