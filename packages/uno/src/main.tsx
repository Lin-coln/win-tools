import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  RoundedBox,
  PerspectiveCamera,
  GizmoHelper,
  GizmoViewport,
  Outlines,
} from "@react-three/drei";
import { folder, useControls } from "leva";
import { Physics, RigidBody } from "@react-three/rapier";
import { Ground } from "./prefabs/Ground.tsx";

createRoot(document.getElementById("root")!).render(<App />);

function App() {
  const cfg = useControls({
    helpers: folder({
      ground: true,
      physics_debug: true,
      ambient_intensity: { value: 1.2, step: 0.1, min: 0, max: 2 },
      direct_intensity: { value: 1, step: 0.1, min: 0, max: 5 },
      env_intensity: { value: 0.2, step: 0.05, min: 0, max: 5 },
    }),
  });

  return (
    <Canvas shadows style={{ height: "100vh" }}>
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <PerspectiveCamera makeDefault position={[3, 4, 5]} fov={60} />
      <OrbitControls makeDefault />

      <Environment
        preset="warehouse"
        blur={0}
        background
        environmentIntensity={cfg.env_intensity}
      />
      <ambientLight intensity={cfg.ambient_intensity} />
      <directionalLight
        castShadow
        shadow-mapSize={1024}
        position={[2.5, 8, 5]}
        intensity={cfg.direct_intensity}
      />

      <Physics debug={cfg.physics_debug}>
        <Cube />
        {cfg.ground && <Ground />}
      </Physics>
    </Canvas>
  );
}

function Cube() {
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
