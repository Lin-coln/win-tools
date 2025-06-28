import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
} from "@react-three/drei";
import { folder, useControls } from "leva";
import { Physics } from "@react-three/rapier";
import { Ground } from "../prefabs/Ground.tsx";
import { PresetCamera } from "./PresetCamera.tsx";
import { PresetProvider } from "./PresetContext.tsx";

export function Preset({ children }) {
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
    <PresetProvider>
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>

      <PresetCamera
        id="default"
        makeDefault={true}
        position={[3, 4, 5]}
        fov={60}
      />

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
        {children}
        {cfg.ground && <Ground />}
      </Physics>
    </PresetProvider>
  );
}
