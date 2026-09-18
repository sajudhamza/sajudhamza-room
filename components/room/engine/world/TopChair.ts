import * as THREE from "three";
import type Experience from "../Experience";

export default class TopChair {
  private group?: THREE.Object3D;

  constructor(private experience: Experience, material: THREE.Material) {
    const gltf = experience.resources.model("topChairModel");
    if (!gltf) return;
    this.group = gltf.scene.children[0];
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) child.material = material;
    });
    experience.scene.add(this.group);
  }

  update() {
    if (this.group) this.group.rotation.y = Math.sin(this.experience.time.elapsed * 0.0005) * 0.5;
  }

  destroy() {
    if (this.group) this.experience.scene.remove(this.group);
  }
}
