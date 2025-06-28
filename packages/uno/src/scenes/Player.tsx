import { folder, useControls } from "leva";
import {
  CapsuleCollider,
  type RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import {
  KeyboardControls,
  MeshTransmissionMaterial,
  RoundedBox,
  useKeyboardControls,
} from "@react-three/drei";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Scene, Vector3 } from "three";
import { PresetCamera } from "../presets/PresetCamera.tsx";
import { type PerspectiveCamera as PerspectiveCameraImpl } from "three";

export function Player() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <PlayerObject />
    </KeyboardControls>
  );
}

function PlayerObject() {
  const cfg = useControls({
    transform: folder({
      position: { value: [0, 2, 0], step: 0.5 },
    }),
    box: folder({ width: 1, height: 2, depth: 1 }),
    material: folder({
      // color: "#03CEA4",
      color: "#FB4D3D",
    }),
  });

  const rigidRef = useRef<RapierRigidBody>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const velocity = new Vector3();

  // keyboard ctrl
  useFrame(() => {
    const body = rigidRef.current;
    if (!body) return;

    const { forward, backward, left, right, jump } = getKeys();
    velocity.set(0, 0, 0);
    if (forward) velocity.z -= 1;
    if (backward) velocity.z += 1;
    if (left) velocity.x -= 1;
    if (right) velocity.x += 1;
    velocity.normalize().multiplyScalar(4);

    const current = body.linvel();
    body.setLinvel({ x: velocity.x, y: current.y, z: velocity.z }, true);
  });

  // camera follow player
  const cameraRef = useRef<PerspectiveCameraImpl>(null);
  useFrame(() => {
    const tar = rigidRef.current;
    if (!tar) return;
    const cam = cameraRef.current;
    if (!cam) return;

    const tarPos = tar.translation();
    const lookPos = new Vector3(tarPos.x, tarPos.y + 2, tarPos.z);

    const camOfs = new Vector3(0, 2, 4);
    const camPos = lookPos.clone().add(camOfs);

    cam.position.lerp(camPos, 0.1);
    cam.lookAt(lookPos);
  });

  return (
    <>
      <PresetCamera ref={cameraRef} id="player_camera" fov={60} />
      <RigidBody
        ref={rigidRef}
        lockRotations
        colliders={false}
        friction={1}
        position={cfg.position}
      >
        <CapsuleCollider args={[0.4, 0.6]} />

        <RoundedBox
          args={[cfg.width, cfg.height, cfg.depth]}
          radius={0.1}
          castShadow
          receiveShadow
        >
          {/*<MeshTransmissionMaterial*/}
          {/*  ior={1.2}*/}
          {/*  thickness={1.5}*/}
          {/*  anisotropy={0.1}*/}
          {/*  chromaticAberration={0.04}*/}
          {/*/>*/}
          <meshStandardMaterial color={cfg.color} />
        </RoundedBox>
      </RigidBody>
    </>
  );
}
