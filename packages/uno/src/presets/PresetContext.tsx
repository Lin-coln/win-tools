import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import { type PerspectiveCamera as PerspectiveCameraImpl } from "three";
import { useMemoizedFn } from "../utils/useMemoizedFn.ts";

interface PresetContext {
  updateCamera: (id: string, camera: PerspectiveCameraImpl) => void;
  deleteCamera: (id: string) => void;
  getCamera: (id: string) => PerspectiveCameraImpl;
}

const context = createContext<PresetContext>(null as any);

export function PresetProvider(props: { children: ReactNode }) {
  const cameraMapRef = useRef(new Map<string, PerspectiveCameraImpl>());

  const updateCamera = useMemoizedFn(
    (id: string, camera: PerspectiveCameraImpl) => {
      const map = cameraMapRef.current;
      map.set(id, camera);
    },
  );
  const deleteCamera = useMemoizedFn((id: string) => {
    const map = cameraMapRef.current;
    map.delete(id);
  });
  const getCamera = useMemoizedFn((id: string) => {
    const map = cameraMapRef.current;
    return map.get(id)!;
  });

  const value = useMemo<PresetContext>(
    () => ({
      updateCamera,
      deleteCamera,
      getCamera,
    }),
    [],
  );

  return <context.Provider value={value}>{props.children}</context.Provider>;
}

export function usePresetContext() {
  const ctx = useContext(context);
  return ctx;
}
