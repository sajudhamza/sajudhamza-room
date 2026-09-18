import { gsap } from "gsap";
import type Experience from "./Experience";
import Baked from "./world/Baked";
import GoogleLeds from "./world/GoogleLeds";
import LoupedeckButtons from "./world/LoupedeckButtons";
import CoffeeSteam from "./world/CoffeeSteam";
import TopChair from "./world/TopChair";
import ElgatoLight from "./world/ElgatoLight";
import WallIntro from "./world/WallIntro";
import Screen from "./world/Screen";

export type WorldOptions = { wallName: [string, string]; wallSubtitle: string; night: boolean };

export default class World {
  baked: Baked;
  private googleLeds: GoogleLeds;
  private loupedeck: LoupedeckButtons;
  private steam: CoffeeSteam;
  private chair: TopChair;
  private elgato: ElgatoLight;
  private wallIntro: WallIntro;
  private screens: Screen[];

  constructor(private experience: Experience, options: WorldOptions) {
    this.baked = new Baked(experience);
    this.baked.material.uniforms.uNightMix.value = options.night ? 1 : 0;
    this.googleLeds = new GoogleLeds(experience);
    this.loupedeck = new LoupedeckButtons(experience);
    this.steam = new CoffeeSteam(experience);
    this.chair = new TopChair(experience, this.baked.material);
    this.elgato = new ElgatoLight(experience);
    this.wallIntro = new WallIntro(experience, options.wallName, options.wallSubtitle);
    this.screens = [
      new Screen(experience, "pcScreenModel", "/assets/videoPortfolio.mp4"),
      new Screen(experience, "macScreenModel", "/assets/videoStream.mp4"),
    ];
  }

  setNight(night: boolean) {
    gsap.to(this.baked.material.uniforms.uNightMix, { value: night ? 1 : 0, duration: 1.4, ease: "power2.inOut" });
  }

  resumeVideos() {
    for (const s of this.screens) s.resume();
  }

  update() {
    this.googleLeds.update();
    this.steam.update();
    this.chair.update();
  }

  destroy() {
    gsap.killTweensOf(this.baked.material.uniforms.uNightMix);
    for (const s of this.screens) s.destroy();
    this.wallIntro.destroy();
    this.elgato.destroy();
    this.chair.destroy();
    this.steam.destroy();
    this.loupedeck.destroy();
    this.googleLeds.destroy();
    this.baked.destroy();
  }
}
