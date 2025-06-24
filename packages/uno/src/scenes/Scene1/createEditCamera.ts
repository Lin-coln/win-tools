import type { Scene1 } from "./index.ts";
import type { PerspectiveCamera, WebGLRenderer } from "three";
import { createCameraHelper, createPerspective } from "./createMainCamera.ts";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Scene3D } from "@enable3d/phaser-extension";

export function createEditCamera(
  this: Scene1,
  opts: { mainCamera: PerspectiveCamera },
) {
  const { mainCamera } = opts;

  const camera = createPerspective(this, {
    x: 24,
    y: 24,
    z: 0,
  });
  camera.lookAt(0, 0, 0);

  // helper
  createCameraHelper(this, camera);

  // control
  const ctrl = new OrbitControls(
    camera,
    document.getElementById("enable3d-phaser-canvas") ||
      (this.renderer as unknown as WebGLRenderer).domElement,
  );
  ctrl.enabled = false;
  this.on$update((time, delta) => {
    ctrl.update(delta);
  });

  // switch
  const keyboard = this.input.keyboard;
  if (keyboard) {
    keyboard.on("keydown-F", () => {
      const isMain = this.third.camera === mainCamera;
      this.third.camera = isMain ? camera : mainCamera;
      ctrl.enabled = !isMain;
    });
  }

  // render sub view
  renderSubCamera(this, { mainCamera, editCamera: camera });

  return camera;
}

function renderSubCamera(scene: Scene3D, { mainCamera, editCamera }) {
  const base = scene.game.scale.baseSize;
  const renderer3 = scene.third.renderer;
  const scene3 = scene.third.scene;

  const aspectRatio = base.width / base.height;
  const width = 560;
  const height = width / aspectRatio;
  const x = 0;
  const y = base.height - x - height;

  scene.game.events.on("postrender", (renderer) => {
    renderer3.setViewport(0, 0, base.width, base.height);
    renderer3.render(scene3, scene.third.camera);

    // render sub camera
    if (scene.third.camera === editCamera) {
      renderer3.clearDepth();
      renderer3.setScissorTest(true);
      renderer3.setScissor(x, y, width, height);
      renderer3.setViewport(x, y, width, height);
      renderer3.render(scene3, mainCamera);
      renderer3.setScissorTest(false);
    } else if (scene.third.camera === mainCamera) {
      renderer3.clearDepth();
      renderer3.setScissorTest(true);
      renderer3.setScissor(x, y, width, height);
      renderer3.setViewport(x, y, width, height);
      renderer3.render(scene3, editCamera);
      renderer3.setScissorTest(false);
    }
  });
}
