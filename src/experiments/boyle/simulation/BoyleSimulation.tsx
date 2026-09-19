import {
  useState,
} from "react";

import ExperimentCanvas from "../../../components/experiment/ExperimentCanvas";

import {
  OrbitControls,
} from "@react-three/drei";

import {
  boylePhysicsConfig,
} from "../data";

import type {
  BoyleThermalCondition,
} from "../model";

import BoyleScene from "./BoyleScene";

type BoyleSimulationProps = {
  volume: number;

  thermalCondition:
    BoyleThermalCondition;

  showParticles: boolean;

  orbitEnabled: boolean;

  firePulse: number;

  onVolumeChange: (
    volume: number,
  ) => void;

  onThermalConditionChange: (
    condition: BoyleThermalCondition,
  ) => void;

  onTemperatureChange?: (
    temperature: number,
  ) => void;
};

export default function BoyleSimulation({
  volume,
  thermalCondition,
  showParticles,
  orbitEnabled,
  firePulse,
  onVolumeChange,
  onThermalConditionChange,
  onTemperatureChange,
}: BoyleSimulationProps) {
  const [
    pistonDragging,
    setPistonDragging,
  ] = useState(false);

  return (
    <div className="boyle-simulation">
      <ExperimentCanvas
        shadows
        camera={{
          position: [
            0,
            1.2,
            9.5,
          ],
          fov: 45,
        }}
      >
        <color
          attach="background"
          args={["#0b1121"]}
        />

        <ambientLight
          intensity={1.35}
        />

        <hemisphereLight
          color="#dbeafe"
          groundColor="#020617"
          intensity={0.9}
        />

        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <spotLight
          position={[-5, 5, 5]}
          intensity={1}
          color="#0ea5e9"
        />

        <BoyleScene
          volume={volume}
          volumeMin={
            boylePhysicsConfig.volumeMin
          }
          volumeMax={
            boylePhysicsConfig.volumeMax
          }
          boyleConstant={
            boylePhysicsConfig
              .boyleConstant
          }
          thermalCondition={
            thermalCondition
          }
          showParticles={
            showParticles
          }
          firePulse={firePulse}
          onVolumeChange={
            onVolumeChange
          }
          onThermalConditionChange={
            onThermalConditionChange
          }
          onTemperatureChange={
            onTemperatureChange
          }
          onPistonDragChange={
            setPistonDragging
          }
        />

        <mesh
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          position={[
            0,
            -0.86,
            0,
          ]}
          receiveShadow
        >
          <planeGeometry
            args={[12, 12]}
          />

          <shadowMaterial
            transparent
            opacity={0.28}
          />
        </mesh>

        <OrbitControls
          enabled={
            orbitEnabled &&
            !pistonDragging
          }
          enableZoom={false}
          enablePan={false}
          minPolarAngle={
            Math.PI / 4
          }
          maxPolarAngle={
            Math.PI / 2
          }
          target={[0, 1.2, 0]}
        />
      </ExperimentCanvas>
    </div>
  );
}