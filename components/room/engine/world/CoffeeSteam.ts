import * as THREE from "three";
import type Experience from "../Experience";
import { steamFragment, steamVertex } from "../shaders";

export default class CoffeeSteam {
  private mesh?: THREE.Mesh;
  private material: THREE.ShaderMaterial;

  constructor(private experience: Experience) {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: steamVertex,
      fragmentShader: steamFragment,
      uniforms: {
        uTime: { value: 0 },
        uTimeFrequency: { value: 0.0004 },
        uUvFrequency: { value: new THREE.Vector2(4, 5) },
        uColor: { value: new THREE.Color("#d2958a") },
      },
    });

    const gltf = experience.resources.model("coffeeSteamModel");
    const child = gltf?.scene.children[0];
    if (child instanceof THREE.Mesh) {
      child.material = this.material;
      experience.scene.add(child);
      this.mesh = child;
    }
  }

  update() {
    this.material.uniforms.uTime.value = this.experience.time.elapsed;
  }

  destroy() {
    if (this.mesh) this.experience.scene.remove(this.mesh);
    this.material.dispose();
  }
}
