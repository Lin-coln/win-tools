import { Scene3D } from "@enable3d/phaser-extension";
import { createMainCamera } from "./createMainCamera.ts";
import { createEditCamera } from "./createEditCamera.ts";
import { createCard } from "./createCard.ts";
import { holdingCards } from "./holdingCards.ts";

export class Scene1 extends Scene3D {
  constructor() {
    super({
      key: "Scene1",
    });
  }

  init() {
    this.accessThirdDimension({
      gravity: {
        x: 0,
        // y: -9.81,
        y: -20,
        z: 0,
      },
    });
  }

  async create() {
    this.third.physics.debug?.mode(1);
    this.third.physics.debug?.enable();

    await this.third.warpSpeed("light", "sky", "fog", "ground");
    // await this.third.warpSpeed("light", "-camera", "-orbitControls");

    const mainCamera = createMainCamera.call(this);
    const editCamera = createEditCamera.call(this, { mainCamera });

    const card = createCard.call(this);

    const cards = Array.from({ length: 3 }).map(() => createCard.call(this));
    holdingCards.call(this, { cards, camera: mainCamera });
  }

  #updateList: ((time: number, delta: number) => any)[] = [];
  on$update(cb: (time: number, delta: number) => any) {
    this.#updateList.push(cb);
  }
  override async update(time: number, delta: number) {
    for (const callback of this.#updateList) {
      await callback(time, delta);
    }
  }
}
