import {
  OrbitControls,
} from "@react-three/drei";

import ExperimentCanvas from "../../../components/experiment/ExperimentCanvas";

import DampedScene from "./DampedScene";

type DampedSimulationProps = {
  isPlaying: boolean;
  damping: number;
  paperSpeed: number;
  resetVersion: number;
  isCameraLocked: boolean;
};

export default function DampedSimulation({
  isPlaying,
  damping,
  paperSpeed,
  resetVersion,
  isCameraLocked,
}: DampedSimulationProps) {
  return (
    <div className="damped-simulation">
      <ExperimentCanvas
        camera={{
          position: [9, 6, 9],
          fov: 40,
        }}
        shadows
        powerPreference="high-performance"
        preserveDrawingBuffer
      >
        <color
          attach="background"
          args={["#f1f5f9"]}
        />

        <fog
          attach="fog"
          args={[
            "#f1f5f9",
            15,
            45,
          ]}
        />

        <DampedScene
          key={resetVersion}
          isPlaying={isPlaying}
          damping={damping}
          paperSpeed={paperSpeed}
        />

        <OrbitControls
          makeDefault
          maxPolarAngle={
            Math.PI / 2 - 0.05
          }
          target={[0, 0, -2]}
          enableRotate={
            !isCameraLocked
          }
          enableZoom={
            !isCameraLocked
          }
          enablePan={
            !isCameraLocked
          }
        />
      </ExperimentCanvas>
    </div>
  );
}
