import type { Scene1 } from "./index.ts";
import { PerspectiveCamera } from "three";
import type { ExtendedMesh } from "@enable3d/common/dist/extendedMesh";
import { calcPositionFrom2dCameraPosition } from "./calcPositionFrom2dCameraPosition.ts";
import { THREE } from "@enable3d/phaser-extension";

export function holdingCards(
  this: Scene1,
  opts: { cards: ExtendedMesh[]; camera: PerspectiveCamera },
) {
  const { cards, camera } = opts;

  const [x, y] = [0, -0.8];
  const distance = 7.8;

  this.on$update((time) => {
    const len = cards.length;
    const factor = (len - 1) / 2;

    cards.forEach((card, i) => {
      const ofs = -factor + i;
      const offset = {
        x: 0.2 * ofs,
        y: 0,
        distance: -0.2 * ofs,
      };

      const position = calcPositionFrom2dCameraPosition(this, {
        camera,
        x: x + offset.x,
        y,
        distance: distance + offset.distance,
      })!;

      const force = position.sub(card.position);
      force.setLength(force.length() * 8);
      card.body.setVelocity(...force.toArray());

      let quaternion = camera.quaternion;
      const euler = new THREE.Euler().setFromQuaternion(quaternion);
      // change rotation here
      // euler.z += (180 * Math.PI) / 180;
      quaternion = new THREE.Quaternion().setFromEuler(euler);

      const displacement = new THREE.Matrix4().makeRotationFromQuaternion(
        quaternion.clone().multiply(card.quaternion.clone().conjugate()),
      );
      let angularForce = new THREE.Vector3().setFromEuler(
        new THREE.Euler().setFromRotationMatrix(displacement),
      );
      angularForce = angularForce.multiplyScalar(2);
      card.body.setAngularVelocity(...angularForce.toArray());
    });
  });
}
