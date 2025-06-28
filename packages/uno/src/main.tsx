import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Player } from "./scenes/Player.tsx";
import { Preset } from "./presets/Preset.tsx";
import React, { useRef } from "react";
import {
  Environment,
  Hud,
  OrthographicCamera,
  Plane,
  useFBO,
} from "@react-three/drei";
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
  const playerTar = useFBO(window.innerWidth / 4, window.innerHeight / 4);
  const ctx = usePresetContext();

  let prevClear: boolean;
  useFrame((state) => {
    const { gl, scene: mainScene } = state;
    prevClear = gl.autoClear;
    const playerCam = ctx.getCamera("player_camera");
    if (playerCam) {
      gl.autoClear = true;
      gl.setRenderTarget(playerTar);
      gl.render(mainScene, playerCam);
      gl.setRenderTarget(null);
    }
    gl.autoClear = prevClear;
  }, 2);

  const [vw, vh] = [window.innerWidth, window.innerHeight];
  const aspectRatio = vw / vh;
  const w = 400;
  const h = w / aspectRatio;
  return (
    <Hud renderPriority={1}>
      <OrthographicCamera makeDefault zoom={1} />
      <group position={[0, 0, -0.1]}>
        <Plane args={[w, h]} position={[-vw / 2 + w / 2, vh / 2 - h / 2, 0]}>
          <meshBasicMaterial map={playerTar.texture} />
        </Plane>
      </group>
    </Hud>
  );
}
