import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Player } from "./scenes/Player.tsx";
import { Preset } from "./presets/Preset.tsx";
import React, { useRef } from "react";
import {
  Scene,
  type OrthographicCamera as OrthographicCameraImpl,
} from "three";
import { OrthographicCamera, Plane, useFBO } from "@react-three/drei";
import { usePresetContext } from "./presets/PresetContext.tsx";

createRoot(document.getElementById("root")!).render(<App />);

function App() {
  return (
    <Canvas shadows style={{ height: "100dvh" }}>
      <Preset>
        <Player />
        <PresetGUI />
      </Preset>
    </Canvas>
  );
}

function PresetGUI() {
  const camRef = useRef<OrthographicCameraImpl>(null!);
  const sceneRef = useRef<Scene>(null!);
  if (!sceneRef.current) sceneRef.current = new Scene();

  const ctx = usePresetContext();
  useThree();

  const playerTar = useFBO(window.innerWidth / 4, window.innerHeight / 4);

  useFrame((state) => {
    const { gl, scene: mainScene, camera: mainCam } = state;
    const uiScene = sceneRef.current;
    const uiCam = camRef.current;

    gl.autoClear = false;

    const playerCam = ctx.getCamera("player_camera");
    if (playerCam) {
      gl.setRenderTarget(playerTar);
      gl.render(mainScene, playerCam);
    }

    gl.setRenderTarget(null);
    gl.render(mainScene, mainCam);
    gl.render(uiScene, uiCam);
    gl.autoClear = true;
  }, 1);

  const r = window.innerWidth / window.innerHeight;
  const SIZE = 400;
  return createPortal(
    <>
      <OrthographicCamera ref={camRef} near={0.0001} far={100} />
      <group
        position-z={-0.1}
        position-x={-window.innerWidth / 2 + (SIZE * r) / 2}
      >
        <Plane args={[SIZE, SIZE / r, 1]} position-y={0}>
          <meshBasicMaterial map={playerTar.texture} />
        </Plane>
      </group>
    </>,
    sceneRef.current,
  );
}
