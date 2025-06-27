import { Scene3D, THREE } from "@enable3d/phaser-extension";

export function createCard(this: Scene3D) {
  const scale = 0.003;
  const mesh = this.third.add.box(
    {
      width: 440 * scale,
      height: 648 * scale,
      depth: 8 * scale,
    },
    {
      lambert: {
        color: new THREE.Color("#ff6a00"),
      },
    },
  );
  mesh.position.set(0, 5, 0);
  // mesh.rotation.set(Math.PI / 2, 0, 0);

  // physics
  this.third.physics.add.existing(mesh, {
    shape: "box",
    width: 1.35,
    height: 1.95,
    depth: 0.08,
  });
  const body = mesh.body;
  const ammo = body.ammo;
  ammo.setDamping(0.8, 0.5);

  return mesh;
}
