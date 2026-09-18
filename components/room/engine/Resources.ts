import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import EventEmitter from "./EventEmitter";

export type AssetDef = { name: string; source: string; type: "texture" | "model" };

export const ASSETS: AssetDef[] = [
  { name: "googleHomeLedMaskTexture", source: "/assets/googleHomeLedMask.png", type: "texture" },
  { name: "googleHomeLedsModel", source: "/assets/googleHomeLedsModel.glb", type: "model" },
  { name: "loupedeckButtonsModel", source: "/assets/loupedeckButtonsModel.glb", type: "model" },
  { name: "topChairModel", source: "/assets/topChairModel.glb", type: "model" },
  { name: "coffeeSteamModel", source: "/assets/coffeeSteamModel.glb", type: "model" },
  { name: "elgatoLightModel", source: "/assets/elgatoLightModel.glb", type: "model" },
  { name: "pcScreenModel", source: "/assets/pcScreenModel.glb", type: "model" },
  { name: "macScreenModel", source: "/assets/macScreenModel.glb", type: "model" },
  { name: "bakedDayTexture", source: "/assets/bakedDay.jpg", type: "texture" },
  { name: "bakedNightTexture", source: "/assets/bakedNight.jpg", type: "texture" },
  { name: "lightMapTexture", source: "/assets/lightMap.jpg", type: "texture" },
  { name: "roomModel", source: "/assets/roomModel.glb", type: "model" },
];

/** Loads every asset in ASSETS and emits `progress(loaded, total)` then `ready`. */
export default class Resources extends EventEmitter {
  textures: Record<string, THREE.Texture> = {};
  models: Record<string, GLTF> = {};
  toLoad = ASSETS.length;
  loaded = 0;

  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private textureLoader: THREE.TextureLoader;
  private cancelled = false;

  constructor() {
    super();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("/draco/");
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.textureLoader = new THREE.TextureLoader();
  }

  load() {
    for (const asset of ASSETS) {
      const fail = () => {
        console.warn(`[room] failed to load ${asset.source}`);
        this.fileDone();
      };
      if (asset.type === "texture") {
        this.textureLoader.load(
          asset.source,
          (texture) => {
            this.textures[asset.name] = texture;
            this.fileDone();
          },
          undefined,
          fail
        );
      } else {
        this.gltfLoader.load(
          asset.source,
          (gltf) => {
            this.models[asset.name] = gltf;
            this.fileDone();
          },
          undefined,
          fail
        );
      }
    }
  }

  texture(name: string): THREE.Texture | undefined {
    return this.textures[name];
  }

  model(name: string): GLTF | undefined {
    return this.models[name];
  }

  private fileDone() {
    if (this.cancelled) return;
    this.loaded++;
    this.emit("progress", this.loaded, this.toLoad);
    if (this.loaded === this.toLoad) this.emit("ready");
  }

  dispose() {
    this.cancelled = true;
    this.clear();
    for (const t of Object.values(this.textures)) t.dispose();
    this.dracoLoader.dispose();
  }
}
