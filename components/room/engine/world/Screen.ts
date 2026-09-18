import * as THREE from "three";
import type Experience from "../Experience";

/** A looping muted video mapped onto a monitor mesh. */
export default class Screen {
  private video: HTMLVideoElement;
  private texture: THREE.VideoTexture;
  private material: THREE.MeshBasicMaterial;
  private mesh?: THREE.Mesh;

  constructor(private experience: Experience, modelName: string, src: string) {
    this.video = document.createElement("video");
    this.video.muted = true;
    this.video.loop = true;
    this.video.playsInline = true;
    this.video.autoplay = true;
    this.video.crossOrigin = "anonymous";
    this.video.src = src;
    this.video.play().catch(() => {
      /* autoplay may be blocked until first interaction */
    });

    this.texture = new THREE.VideoTexture(this.video);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });

    const gltf = experience.resources.model(modelName);
    const child = gltf?.scene.children[0];
    if (child instanceof THREE.Mesh) {
      child.material = this.material;
      experience.scene.add(child);
      this.mesh = child;
    }
  }

  resume() {
    if (this.video.paused) this.video.play().catch(() => {});
  }

  destroy() {
    this.video.pause();
    this.video.removeAttribute("src");
    this.video.load();
    if (this.mesh) this.experience.scene.remove(this.mesh);
    this.texture.dispose();
    this.material.dispose();
  }
}
