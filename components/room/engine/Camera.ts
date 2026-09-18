import * as THREE from "three";
import type Experience from "./Experience";

export default class Camera {
  instance: THREE.PerspectiveCamera;

  constructor(private experience: Experience) {
    const { width, height } = experience.config;
    this.instance = new THREE.PerspectiveCamera(20, width / height, 0.1, 150);
    this.instance.rotation.reorder("YXZ");
    experience.scene.add(this.instance);
  }

  resize() {
    const { width, height } = this.experience.config;
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }
}
