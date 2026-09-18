import * as THREE from "three";
import type Experience from "../Experience";
import { bakedFragment, bakedVertex } from "../shaders";

/** The room itself: one mesh with baked day/night lighting blended in a shader. */
export default class Baked {
  mesh: THREE.Object3D;
  material: THREE.ShaderMaterial;

  constructor(private experience: Experience) {
    const res = experience.resources;
    const room = res.model("roomModel");
    if (!room) throw new Error("roomModel missing");

    const day = res.texture("bakedDayTexture");
    const night = res.texture("bakedNightTexture");
    const lightMap = res.texture("lightMapTexture");
    for (const t of [day, night]) {
      if (!t) continue;
      t.colorSpace = THREE.SRGBColorSpace;
      t.flipY = false;
    }
    if (lightMap) lightMap.flipY = false;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uBakedDayTexture: { value: day ?? null },
        uBakedNightTexture: { value: night ?? day ?? null },
        uLightMapTexture: { value: lightMap ?? null },
        uNightMix: { value: 1 },
        uLightTvColor: { value: new THREE.Color("#ff115e") },
        uLightTvStrength: { value: 1.47 },
        uLightDeskColor: { value: new THREE.Color("#ff6700") },
        uLightDeskStrength: { value: 1.9 },
        uLightPcColor: { value: new THREE.Color("#0082ff") },
        uLightPcStrength: { value: 1.4 },
      },
      vertexShader: bakedVertex,
      fragmentShader: bakedFragment,
    });

    this.mesh = room.scene.children[0];
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) child.material = this.material;
    });
    experience.scene.add(this.mesh);
  }

  destroy() {
    this.experience.scene.remove(this.mesh);
    this.material.dispose();
  }
}
