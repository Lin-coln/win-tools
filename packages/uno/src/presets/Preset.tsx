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
import { PresetLights } from "./PresetLights.tsx";

export function Preset({ children }) {
  const cfg = useControls({
    helpers: folder({
      ground: true,
      physics_debug: true,
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
      <PresetLights />
      <Physics debug={cfg.physics_debug}>
        {children}
        {cfg.ground && <Ground />}
      </Physics>
    </PresetProvider>
  );
}
