import { Scene3D, THREE } from "@enable3d/phaser-extension";
import { MeshBasicMaterial, PerspectiveCamera, PlaneGeometry } from "three";

// 参考源码：this.third.transform.from2dto3d
export function calcPositionFrom2dCameraPosition(
  scene: Scene3D,
  options: {
    camera: PerspectiveCamera;
    x: number;
    y: number;
    distance: number;
  },
) {
  const ctx = getContext(scene);

  options.camera.getWorldDirection(ctx.direction);
  ctx.plane.setRotationFromEuler(options.camera.rotation);
  ctx.plane.position.set(...options.camera.position.toArray());
  ctx.plane.position.add(
    ctx.direction.clone().multiplyScalar(options.distance),
  );

  ctx.plane.updateMatrix();
  ctx.plane.updateMatrixWorld(true);
  ctx.raycaster.setFromCamera(
    new THREE.Vector2(options.x, options.y),
    options.camera,
  );
  const intersects = ctx.raycaster.intersectObjects([ctx.plane]);
  if (!intersects[0]) return;
  if (intersects[0].object === ctx.plane) {
    return intersects[0].point;
  }
}

function getContext(scene: Scene3D) {
  const field = "ctx$calcPositionFrom2dCameraPosition";
  if (!scene[field]) {
    scene[field] = createContext();
    // scene.third.add.existing(scene[field].plane);
  }
  return scene[field] as ReturnType<typeof createContext>;
}

function createContext() {
  const geo = new PlaneGeometry(100, 100);
  const mat = new MeshBasicMaterial({
    color: "#ff0000",
    transparent: true,
    opacity: 0.25,
  });
  const plane = new THREE.Mesh(geo, mat);
  const raycaster = new THREE.Raycaster();
  const direction = new THREE.Vector3();
  return {
    plane,
    raycaster,
    direction,
  };
}
