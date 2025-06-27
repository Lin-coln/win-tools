import { ContactShadows, Shadow } from "@react-three/drei";
import { folder, useControls } from "leva";

export function Shadows() {
  const cfg = useControls({
    // shadow: folder({
    //   shadow_color: "#1d5ade",
    // }),
  });

  return null;
  // <AccumulativeShadows
  //   temporal={cfg.temporal}
  //   frames={100}
  //   color={cfg.shadow_color}
  //   colorBlend={2}
  //   alphaTest={0.75}
  //   scale={10}
  //   resolution={1024}
  // >
  //   <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  // </AccumulativeShadows>
}
