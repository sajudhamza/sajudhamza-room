import * as THREE from "three";
import { gsap } from "gsap";
import type Experience from "../Experience";

const COLORS = ["#af55cf", "#dbd85d", "#e86b24", "#b81b54"];

export default class LoupedeckButtons {
  private items: { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial }[] = [];
  private interval = 0;

  constructor(private experience: Experience) {
    const gltf = experience.resources.model("loupedeckButtonsModel");
    if (!gltf) return;

    const children = [...gltf.scene.children].sort((a, b) => a.name.localeCompare(b.name));
    for (const child of children) {
      if (!(child instanceof THREE.Mesh)) continue;
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
      child.material = material;
      experience.scene.add(child);
      this.items.push({ mesh: child, material });
    }

    this.play();
    this.interval = window.setInterval(this.play, 5000);
  }

  private play = () => {
    const lit: typeof this.items = [];
    for (const item of this.items) {
      if (Math.random() < 0.5) lit.push(item);
      else item.material.opacity = 0;
    }
    lit.forEach((item, i) => {
      item.material.color.set(COLORS[Math.floor(Math.random() * COLORS.length)]);
      gsap.to(item.material, {
        delay: i * 0.05,
        duration: 0.2,
        opacity: 1,
        onComplete: () => gsap.to(item.material, { delay: 3, duration: 0.5, opacity: 0 }),
      });
    });
  };

  destroy() {
    window.clearInterval(this.interval);
    for (const item of this.items) {
      gsap.killTweensOf(item.material);
      this.experience.scene.remove(item.mesh);
      item.material.dispose();
    }
  }
}
