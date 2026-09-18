import * as THREE from "three";
import type Experience from "./Experience";

export default class Renderer {
  instance: THREE.WebGLRenderer;

  constructor(private experience: Experience) {
    this.instance = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance" });
    const el = this.instance.domElement;
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";

    this.instance.setClearColor("#010101", 1);
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.resize();
  }

  resize() {
    const { width, height, pixelRatio } = this.experience.config;
    this.instance.setSize(width, height);
    this.instance.setPixelRatio(pixelRatio);
  }

  update() {
    this.instance.render(this.experience.scene, this.experience.camera.instance);
  }

  dispose() {
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.instance.domElement.remove();
  }
}
