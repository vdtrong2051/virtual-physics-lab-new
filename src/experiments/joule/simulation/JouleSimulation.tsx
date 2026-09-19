import {
  useState,
} from "react";

import ExperimentCanvas from "../../../components/experiment/ExperimentCanvas";

import {
  OrbitControls,
} from "@react-three/drei";

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
      <ExperimentCanvas
        shadows="percentage"
        camera={{
          position: [
            4.8,
            4.35,
            12.8,
          ],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        powerPreference="high-performance"
        toneMappingExposure={1.08}
      >
        {/* Background riêng cho workspace */}
        <color
          attach="background"
          args={[
            "#08111f",
          ]}
        />

        {/*
         * Ambient chỉ đủ nâng vùng tối.
         * Không dùng ambient quá mạnh vì sẽ
         * làm mất hình khối kim loại.
         */}
        <ambientLight
          intensity={0.38}
        />

        {/*
         * Ánh sáng môi trường:
         * xanh lạnh từ trên, nâu tối từ bàn.
         */}
        <hemisphereLight
          color="#dbeafe"
          groundColor="#211711"
          intensity={0.82}
        />

        {/*
         * KEY LIGHT
         * Ánh sáng chính từ trên-phải-phía trước.
         * Đây là nguồn duy nhất cast shadow.
         */}
        <directionalLight
          castShadow
          position={[
            6.5,
            10,
            7.5,
          ]}
          color="#fff7ed"
          intensity={2.35}
          shadow-mapSize-width={
            2048
          }
          shadow-mapSize-height={
            2048
          }
          shadow-camera-near={1}
          shadow-camera-far={30}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-6}
          shadow-bias={
            -0.00015
          }
          shadow-normalBias={
            0.025
          }
        />

        {/*
         * FILL LIGHT
         * Mở chi tiết mặt trái của frame,
         * pulley và calorimeter.
         */}
        <directionalLight
          position={[
            -5.5,
            4.5,
            6,
          ]}
          color="#bfdbfe"
          intensity={0.72}
        />

        {/*
         * FRONT SOFT LIGHT
         * Giúp vật liệu đồng/thép không
         * biến thành các khối đen.
         */}
        <pointLight
          position={[
            0,
            2.5,
            6,
          ]}
          color="#ffffff"
          intensity={0.62}
          distance={14}
          decay={2}
        />

        {/*
         * RIM LIGHT
         * Tách silhouette phía sau khỏi
         * background tối.
         */}
        <spotLight
          position={[
            -4,
            7.5,
            -4.5,
          ]}
          color="#fbbf24"
          intensity={1.1}
          distance={22}
          angle={0.72}
          penumbra={0.8}
          decay={2}
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

        <OrbitControls
          enabled={
            orbitEnabled &&
            !weightDragging
          }
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={
            Math.PI / 4
          }
          maxPolarAngle={
            Math.PI / 2 - 0.1
          }
          minAzimuthAngle={
            -Math.PI / 3
          }
          maxAzimuthAngle={
            Math.PI / 3
          }
          target={[
            0,
            0.35,
            0,
          ]}
        />
      </ExperimentCanvas>
    </div>
  );
}