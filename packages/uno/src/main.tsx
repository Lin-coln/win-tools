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
  const { size } = useThree();
  const [vw, vh] = [size.width, size.height];
  const w = 400;
  const h = w / (vw / vh);
  const playerTar = useFBO(vw, vh);
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

  return (
    <Hud renderPriority={2}>
      <OrthographicCamera makeDefault zoom={1} />
      <group position={[0, 0, -0.1]}>
        <Plane args={[w, h]} position={[-vw / 2 + w / 2, vh / 2 - h / 2, 0]}>
          <meshBasicMaterial map={playerTar.texture} />
        </Plane>
      </group>
    </Hud>
  );
}
