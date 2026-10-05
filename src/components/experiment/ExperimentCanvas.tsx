import type {
  ComponentProps,
  ReactNode,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import * as THREE from "three";

type CanvasProps =
  ComponentProps<typeof Canvas>;

export type ExperimentCanvasProps = {
  camera: CanvasProps["camera"];

  shadows?: CanvasProps["shadows"];

  powerPreference?:
    THREE.WebGLRendererParameters["powerPreference"];

  toneMappingExposure?: number;

  children: ReactNode;
};

export default function ExperimentCanvas({
  camera,
  shadows,
  powerPreference,
  toneMappingExposure,
  children,
}: ExperimentCanvasProps) {
  return (
    <Canvas
      dpr={[
        1,
        1.5,
      ]}
      camera={camera}
      shadows={shadows}
      gl={{
        antialias: true,

        toneMapping:
          THREE.ACESFilmicToneMapping,

        ...(powerPreference
          ? {
              powerPreference,
            }
          : {}),
      }}
      onCreated={({
        gl,
      }) => {
        if (
          toneMappingExposure !==
          undefined
        ) {
          gl.toneMappingExposure =
            toneMappingExposure;
        }
      }}
    >
      {children}
    </Canvas>
  );
}