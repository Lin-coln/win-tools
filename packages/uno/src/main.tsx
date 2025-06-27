import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas, type Vector3 } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Plane,
  Box,
  Torus,
  ContactShadows,
  RoundedBox,
  Stage,
  Outlines,
} from "@react-three/drei";
import { folder, useControls } from "leva";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Ground } from "./prefabs/Ground.tsx";
import { Shadows } from "./prefabs/Shadow.tsx";

createRoot(document.getElementById("root")!).render(<App />);

function App() {
  const cfg = useControls({
    helpers: folder({
      floor: true,
      axes: false,
      physics_debug: false,
    }),
  });

  return (
    <Canvas
      style={{ height: "100vh" }}
      shadows
      camera={{ position: [0, 4, 5], fov: 60 }}
    >
      {cfg.axes && <axesHelper args={[1000]} />}
      <Environment preset="city" background blur={1} />
      <OrbitControls />

      <Physics debug={cfg.physics_debug}>
        <Cube />
        <Shadows />
        {cfg.floor && <Ground />}
      </Physics>
    </Canvas>
  );
}

function Cube() {
  const cfg = useControls({
    transform: folder({
      position: { value: [0, 2, 0], step: 0.5 },
      rotation: { value: [0, 0, 0], step: 1 },
      scale: { value: [1, 1, 1], step: 0.1 },
    }),
    box: folder({
      width: 1,
      height: 1,
      depth: 1,
    }),
    material: folder({
      color: "red",
      roughness: 0.1,
      metalness: 0.2,
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
        <meshStandardMaterial
          color={cfg.color}
          roughness={cfg.roughness}
          metalness={cfg.metalness}
        />
        <Outlines
          thickness={10}
          color="orange"
          opacity={0.8}
          transparent={true}
        />
      </RoundedBox>
    </RigidBody>
  );
}
