import { type Ref, useEffect, useImperativeHandle, useRef } from "react";
import { type PerspectiveCamera as PerspectiveCameraImpl } from "three";
import { CameraHelper } from "three";
import {
  type PerspectiveCameraProps,
  PerspectiveCamera,
  useHelper,
} from "@react-three/drei";
import { usePresetContext } from "./PresetContext.tsx";

export function PresetCamera(
  props: Omit<PerspectiveCameraProps, "id"> & {
    id: string;
    ref?: Ref<PerspectiveCameraImpl>;
  },
) {
  const { ref, id, ...cameraProps } = props;
  const cameraRef = useRef<PerspectiveCameraImpl>(null!);
  useImperativeHandle(ref, () => cameraRef.current, []);

  const ctx = usePresetContext();
  useEffect(() => {
    if (!cameraRef.current) return;
    ctx.updateCamera(id, cameraRef.current);
    return () => ctx.deleteCamera(id);
  }, [cameraRef.current, id]);

  useHelper(cameraRef, CameraHelper);
  return <PerspectiveCamera ref={cameraRef} {...cameraProps} />;
}
