import { folder, useControls } from "leva";
import { RigidBody } from "@react-three/rapier";
import { Outlines, RoundedBox } from "@react-three/drei";

export function SelectedCube() {
  const cfg = useControls({
    transform: folder({
      position: { value: [0, 2, 0], step: 0.5 },
      rotation: { value: [0, 0, 0], step: 1 },
      scale: { value: 1, step: 0.1 },
    }),
    box: folder({ width: 1, height: 2, depth: 1 }),
    material: folder({
      // color: "#03CEA4",
      color: "#FB4D3D",
    }),
  });

  return (
    <RigidBody
      position={cfg.position}
      rotation={cfg.rotation.map((x) => (x * Math.PI) / 180) as any}
      scale={cfg.scale}
      colliders="hull"
    >
      <RoundedBox
        args={[cfg.width, cfg.height, cfg.depth]}
        radius={0.1}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={cfg.color} />

        <Outlines
          opacity={0.8}
          thickness={10}
          color="#EAC435"
          transparent={true}
        />
      </RoundedBox>
    </RigidBody>
  );
}
