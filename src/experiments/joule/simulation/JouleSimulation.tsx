import {
  useState,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  OrbitControls,
} from "@react-three/drei";

import * as THREE from "three";

import type {
  JouleMotionPhase,
} from "../model";

import JouleScene from "./JouleScene";

import type {
  JouleSimulationTelemetry,
} from "./JouleScene";

type JouleSimulationProps = {
  massPerSideKg: number;
  dropHeightM: number;
  motionPhase: JouleMotionPhase;

  slowMotion?: boolean;
  orbitEnabled: boolean;
  interactionLocked?: boolean;

  onMotionPhaseChange: (
    phase: JouleMotionPhase,
  ) => void;

  onDropHeightChange: (
    dropHeightM: number,
  ) => void;

  onTelemetryChange?: (
    telemetry: JouleSimulationTelemetry,
  ) => void;

  onMaxDropHeightChange?: (
    maxDropHeightM: number,
  ) => void;
};

export type {
  JouleSimulationTelemetry,
};

export default function JouleSimulation({
  massPerSideKg,
  dropHeightM,
  motionPhase,
  slowMotion = false,
  orbitEnabled,
  interactionLocked = false,
  onMotionPhaseChange,
  onDropHeightChange,
  onTelemetryChange,
  onMaxDropHeightChange,
}: JouleSimulationProps) {
  const [
    weightDragging,
    setWeightDragging,
  ] = useState(false);

  return (
    <div className="joule-simulation">
      <Canvas
        shadows="percentage"
        dpr={[1, 1.5]}
        camera={{
          position: [
            0,
            3.6,
            11.8,
          ],
          fov: 45,
        }}
        gl={{
          antialias: true,
          toneMapping:
            THREE.ACESFilmicToneMapping,
        }}
      >
        <color
          attach="background"
          args={["#0b1121"]}
        />

        <ambientLight
          intensity={1.15}
        />

        <hemisphereLight
          color="#dbeafe"
          groundColor="#020617"
          intensity={0.75}
        />

        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1.8}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <spotLight
          position={[-5, 6, 5]}
          intensity={0.85}
          color="#fb923c"
        />

        <JouleScene
          massPerSideKg={
            massPerSideKg
          }
          dropHeightM={
            dropHeightM
          }
          motionPhase={
            motionPhase
          }
          slowMotion={
            slowMotion
          }
          interactionLocked={
            interactionLocked
          }
          onMotionPhaseChange={
            onMotionPhaseChange
          }
          onDropHeightChange={
            onDropHeightChange
          }
          onWeightDragChange={
            setWeightDragging
          }
          onTelemetryChange={
            onTelemetryChange
          }
          onMaxDropHeightChange={
            onMaxDropHeightChange
          }
        />

        <mesh
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          position={[0, -2.91, 0]}
          receiveShadow
        >
          <planeGeometry
            args={[18, 14]}
          />

          <shadowMaterial
            transparent
            opacity={0.3}
          />
        </mesh>

        <OrbitControls
          enabled={
            orbitEnabled &&
            !weightDragging
          }
          enableZoom={false}
          enablePan={false}
          minPolarAngle={
            Math.PI / 4
          }
          maxPolarAngle={
            Math.PI / 2 - 0.08
          }
          minAzimuthAngle={
            -Math.PI / 3
          }
          maxAzimuthAngle={
            Math.PI / 3
          }
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
