import { Environment, useHelper } from "@react-three/drei";
import { folder, useControls } from "leva";
import { useEffect, useRef } from "react";
import {
  CameraHelper,
  type DirectionalLight,
  DirectionalLightHelper,
  type OrthographicCamera,
} from "three";
import { useMemoizedFn } from "../utils/useMemoizedFn.ts";

export function PresetLights() {
  const cfg = useControls({
    helpers: folder({
      ambient_intensity: { value: 1.2, step: 0.1, min: 0, max: 2 },
      direct_intensity: { value: 1, step: 0.1, min: 0, max: 5 },
      env_intensity: { value: 0.2, step: 0.05, min: 0, max: 5 },
    }),
  });

  const dlRef = useRef<DirectionalLight>(null!);
  const dlCamRef = useRef<OrthographicCamera>(null!);
  useHelper(dlRef, DirectionalLightHelper);
  useHelper(dlCamRef, CameraHelper);

  const setDlRef = useMemoizedFn((dl: DirectionalLight | null) => {
    if (!dl) return;
    dlRef.current = dl;
    dlCamRef.current = dl.shadow.camera;
  });
  return (
    <>
      <Environment
        preset="warehouse"
        blur={0}
        background
        environmentIntensity={cfg.env_intensity}
      />
      <ambientLight intensity={cfg.ambient_intensity} />
      <directionalLight
        ref={setDlRef}
        castShadow={true}
        position={[10, 10, 10]}
        intensity={cfg.direct_intensity}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />
    </>
  );
}
