import * as THREE from "three";
import type Experience from "../Experience";

export default class ElgatoLight {
  private mesh?: THREE.Object3D;
  private material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  constructor(private experience: Experience) {
    const gltf = experience.resources.model("elgatoLightModel");
    const child = gltf?.scene.children[0];
    if (child instanceof THREE.Mesh) {
      child.material = this.material;
      experience.scene.add(child);
      this.mesh = child;
    }
  }

  destroy() {
    if (this.mesh) this.experience.scene.remove(this.mesh);
    this.material.dispose();
  }
}
