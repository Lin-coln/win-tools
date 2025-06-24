import type { Scene1 } from "./index.ts";
import { PerspectiveCamera } from "three";
import { Scene3D, THREE } from "@enable3d/phaser-extension";

export function createMainCamera(this: Scene1) {
  const camera: PerspectiveCamera = createPerspective(this, {
    x: 0,
    y: 12,
    z: 4,
  });
  camera.lookAt(0, 0, 0);
  this.third.camera = camera;

  // helper
  const camera_helper = createCameraHelper(this, camera);

  // movement
  const speed = 0.01;
  const keyboard = this.input.keyboard;
  if (keyboard) {
    const cursors = keyboard.createCursorKeys();
    this.on$update((time, delta) => {
      let x = camera.position.x;
      let z = camera.position.z;
      if (cursors.left.isDown) {
        x += delta * -speed;
      }
      if (cursors.right.isDown) {
        x += delta * +speed;
      }
      if (cursors.up.isDown) {
        z += delta * -speed;
      }
      if (cursors.down.isDown) {
        z += delta * +speed;
      }
      camera.position.set(x, camera.position.y, z);
    });

    const rotationKeys = keyboard.addKeys("W,S,A,D") as any;
    this.on$update((time, delta) => {
      const rotationSpeed = 0.04 * delta;
      let x = camera.rotation.x;
      let y = camera.rotation.y;
      if (rotationKeys.W.isDown) {
        x += (rotationSpeed * Math.PI) / 180;
      }
      if (rotationKeys.S.isDown) {
        x -= (rotationSpeed * Math.PI) / 180;
      }
      if (rotationKeys.A.isDown) {
        y += (rotationSpeed * Math.PI) / 180;
      }
      if (rotationKeys.D.isDown) {
        y -= (rotationSpeed * Math.PI) / 180;
      }

      // restrict
      x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, x));

      camera.rotation.x = x;
      camera.rotation.y = y;
    });
  }

  return camera;
}

export function createPerspective(scene: Scene3D, config: any) {
  const base = scene.game.scale.baseSize;
  const {
    fov = 50,
    aspect = base.width / base.height,
    near = 0.1,
    far = 2000,
    x = 0,
    y = 5,
    z = 25,
  } = config;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(x, y, z);
  return camera;
}

export function createCameraHelper(scene: Scene3D, camera: PerspectiveCamera) {
  const helper = new THREE.CameraHelper(camera);
  scene.third.add.existing(helper);
  return helper;
}
