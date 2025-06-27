import { CuboidCollider } from "@react-three/rapier";
import { Box, ContactShadows, Grid } from "@react-three/drei";

import { MeshStandardMaterial } from "three";

const groundMaterial = new MeshStandardMaterial({
  color: "#d1d1d1",
});

export function Ground() {
  const { width, depth, height } = { width: 20, depth: 1, height: 20 };
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: "#333b42",
    sectionSize: 2,
    sectionThickness: 1,
    sectionColor: "rgb(34,47,76)",
    fadeDistance: 60,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: false,
  };
  return (
    <CuboidCollider
      position={[0, -0.5, 0]}
      args={[width / 2, depth / 2, height / 2]}
    >
      <Box
        position={[0, -0.01, 0]}
        args={[width, depth, height]}
        material={groundMaterial}
        receiveShadow
      />
      {/*<Grid*/}
      {/*  position={[0, 0.5, 0]}*/}
      {/*  args={[width, height]}*/}
      {/*  {...gridConfig}*/}
      {/*  receiveShadow*/}
      {/*/>*/}
    </CuboidCollider>
  );
}
