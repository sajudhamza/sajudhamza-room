import * as THREE from "three";
import type Experience from "../Experience";

const COLORS = ["#196aff", "#ff0000", "#ff5d00", "#7db81b"];

export default class GoogleLeds {
  private items: { index: number; mesh: THREE.Mesh; material: THREE.MeshBasicMaterial }[] = [];

  constructor(private experience: Experience) {
    const gltf = experience.resources.model("googleHomeLedsModel");
    const mask = experience.resources.texture("googleHomeLedMaskTexture");
    if (!gltf) return;

    const children = [...gltf.scene.children].sort((a, b) => a.name.localeCompare(b.name));
    children.forEach((child, index) => {
      if (!(child instanceof THREE.Mesh)) return;
      const material = new THREE.MeshBasicMaterial({ color: COLORS[index % COLORS.length], transparent: true, alphaMap: mask ?? null });
      child.material = material;
      experience.scene.add(child);
      this.items.push({ index, mesh: child, material });
    });
  }

  update() {
    const t = this.experience.time.elapsed;
    for (const item of this.items) item.material.opacity = Math.sin(t * 0.002 - item.index * 0.5) * 0.5 + 0.5;
  }

  destroy() {
    for (const item of this.items) {
      this.experience.scene.remove(item.mesh);
      item.material.dispose();
    }
  }
}
