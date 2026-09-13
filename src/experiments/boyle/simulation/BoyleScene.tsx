import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  useCursor,
} from "@react-three/drei";

import type {
  ThreeEvent,
} from "@react-three/fiber";

import * as THREE from "three";

import type {
  BoyleThermalCondition,
} from "../model";

import GasParticles from "./GasParticles";

const BASE_Y = -1.5;
const VOLUME_SCALE = 0.8;
const CYLINDER_RADIUS = 0.15;

const AMBIENT_TEMPERATURE = 27;

const THERMAL_TRANSIENT_THRESHOLD =
  0.08;

const THERMAL_EQUILIBRIUM_THRESHOLD =
  0.02;

const majorScaleValues = [
  0,
  1,
  2,
  3,
  4,
] as const;

const gaugeValues = [
  0.5,
  1,
  1.5,
  2,
  2.5,
] as const;

type BoyleSceneProps = {
  volume: number;
  volumeMin: number;
  volumeMax: number;
  boyleConstant: number;

  thermalCondition:
    BoyleThermalCondition;

  showParticles: boolean;

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

  onPistonDragChange?: (
    dragging: boolean,
  ) => void;
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function mapPressureToAngle(
  pressure: number,
) {
  const pressureMin = 0.5;
  const pressureMax = 2.5;

  const angleMin =
    Math.PI - 0.2;

  const angleMax = 0.2;

  return (
    angleMin -
    ((pressure - pressureMin) /
      (pressureMax - pressureMin)) *
      (angleMin - angleMax)
  );
}

export default function BoyleScene({
  volume,
  volumeMin,
  volumeMax,
  boyleConstant,
  thermalCondition,
  showParticles,
  firePulse,
  onVolumeChange,
  onThermalConditionChange,
  onTemperatureChange,
  onPistonDragChange,
}: BoyleSceneProps) {
  const {
    size,
  } = useThree();

  const [
    pistonHovered,
    setPistonHovered,
  ] = useState(false);

  const [
    pistonDragging,
    setPistonDragging,
  ] = useState(false);

  useCursor(
    pistonHovered ||
      pistonDragging,
    "ns-resize",
    "auto",
  );

  const tempSpikeRef =
    useRef(
      thermalCondition === "transient"
        ? 0.12
        : 0,
    );

  const gasMaterialRef =
    useRef<THREE.MeshStandardMaterial>(
      null,
    );

  const needleGroupRef =
    useRef<THREE.Group>(null);

  const flashLightRef =
    useRef<THREE.PointLight>(null);

  const draggingRef =
    useRef(false);

  const dragStartClientYRef =
    useRef(0);

  const dragLastClientYRef =
    useRef(0);

  const dragStartVolumeRef =
    useRef(volume);

  const reportedThermalConditionRef =
    useRef<BoyleThermalCondition>(
      thermalCondition,
    );

  const lastTelemetryTimeRef =
    useRef(0);

  const materials =
    useMemo(
      () => ({
        glass:
          new THREE.MeshPhysicalMaterial({
            color: "#ffffff",
            transmission: 1,
            opacity: 1,
            transparent: true,
            roughness: 0.05,
            ior: 1.5,
            thickness: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),

        metal:
          new THREE.MeshStandardMaterial({
            color: "#cbd5e1",
            metalness: 0.9,
            roughness: 0.1,
          }),

        iron:
          new THREE.MeshStandardMaterial({
            color: "#0f172a",
            roughness: 0.8,
            metalness: 0.3,
          }),

        dark:
          new THREE.MeshStandardMaterial({
            color: "#020617",
            roughness: 0.9,
          }),

        orange:
          new THREE.MeshStandardMaterial({
            color: "#f97316",
            roughness: 0.2,
            metalness: 0.1,
          }),

        white:
          new THREE.MeshStandardMaterial({
            color: "#f8fafc",
            roughness: 0.4,
          }),

        red:
          new THREE.MeshStandardMaterial({
            color: "#ef4444",
            roughness: 0.3,
          }),
      }),
      [],
    );

  const gasColors =
    useMemo(
      () => ({
        normal:
          new THREE.Color("#0ea5e9"),

        hot:
          new THREE.Color("#ef4444"),

        cold:
          new THREE.Color("#818cf8"),

        fire:
          new THREE.Color("#fef08a"),
      }),
      [],
    );

  useEffect(() => {
    return () => {
      Object.values(
        materials,
      ).forEach((material) => {
        material.dispose();
      });
    };
  }, [materials]);

  useEffect(() => {
    if (
      thermalCondition ===
      "equilibrium"
    ) {
      tempSpikeRef.current = 0;
    } else if (
      Math.abs(
        tempSpikeRef.current,
      ) <=
      THERMAL_TRANSIENT_THRESHOLD
    ) {
      tempSpikeRef.current = 0.12;
    }

    reportedThermalConditionRef.current =
      thermalCondition;
  }, [thermalCondition]);

  useEffect(() => {
    if (firePulse <= 0) {
      return;
    }

    tempSpikeRef.current = 2.5;
  }, [firePulse]);

  useEffect(() => {
    function handlePointerMove(
      event: PointerEvent,
    ) {
      if (!draggingRef.current) {
        return;
      }

      event.preventDefault();

      const fullVolumeRange =
        volumeMax - volumeMin;

      const pixelsForFullRange =
        Math.max(
          size.height * 0.45,
          180,
        );

      const volumePerPixel =
        fullVolumeRange /
        pixelsForFullRange;

      const totalDeltaY =
        dragStartClientYRef.current -
        event.clientY;

      const nextVolume =
        clamp(
          dragStartVolumeRef.current +
            totalDeltaY *
              volumePerPixel,
          volumeMin,
          volumeMax,
        );

      const frameDeltaY =
        event.clientY -
        dragLastClientYRef.current;

      dragLastClientYRef.current =
        event.clientY;

      if (
        Math.abs(frameDeltaY) > 1
      ) {
        tempSpikeRef.current =
          clamp(
            tempSpikeRef.current +
              frameDeltaY * 0.015,
            -0.3,
            0.6,
          );
      }

      onVolumeChange(nextVolume);
    }

    function handlePointerUp() {
      if (!draggingRef.current) {
        return;
      }

      draggingRef.current = false;

      setPistonDragging(false);

      onPistonDragChange?.(false);
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: false,
      },
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp,
    );

    window.addEventListener(
      "pointercancel",
      handlePointerUp,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp,
      );

      window.removeEventListener(
        "pointercancel",
        handlePointerUp,
      );
    };
  }, [
    onPistonDragChange,
    onVolumeChange,
    size.height,
    volumeMax,
    volumeMin,
  ]);

  function handlePistonPointerDown(
    event: ThreeEvent<PointerEvent>,
  ) {
    event.stopPropagation();

    draggingRef.current = true;

    dragStartClientYRef.current =
      event.nativeEvent.clientY;

    dragLastClientYRef.current =
      event.nativeEvent.clientY;

    dragStartVolumeRef.current =
      volume;

    setPistonDragging(true);

    onPistonDragChange?.(true);
  }

  useFrame((state) => {
    const coolingRate =
      tempSpikeRef.current > 0.6
        ? 0.015
        : 0.05;

    tempSpikeRef.current =
      THREE.MathUtils.lerp(
        tempSpikeRef.current,
        0,
        coolingRate,
      );

    const absoluteTempSpike =
      Math.abs(
        tempSpikeRef.current,
      );

    if (
      absoluteTempSpike >
        THERMAL_TRANSIENT_THRESHOLD &&
      reportedThermalConditionRef.current !==
        "transient"
    ) {
      reportedThermalConditionRef.current =
        "transient";

      onThermalConditionChange(
        "transient",
      );
    }

    if (
      absoluteTempSpike <=
        THERMAL_EQUILIBRIUM_THRESHOLD &&
      reportedThermalConditionRef.current !==
        "equilibrium"
    ) {
      reportedThermalConditionRef.current =
        "equilibrium";

      onThermalConditionChange(
        "equilibrium",
      );
    }

    if (gasMaterialRef.current) {
      const material =
        gasMaterialRef.current;

      if (
        tempSpikeRef.current > 0.6
      ) {
        const intensity =
          Math.min(
            1,
            (tempSpikeRef.current -
              0.6) /
              1.9,
          );

        material.emissive.lerpColors(
          gasColors.hot,
          gasColors.fire,
          intensity,
        );

        material.emissiveIntensity =
          0.2 + intensity * 2;
      } else if (
        tempSpikeRef.current > 0
      ) {
        material.emissive.lerpColors(
          gasColors.normal,
          gasColors.hot,
          tempSpikeRef.current *
            1.5,
        );

        material.emissiveIntensity =
          0.2;
      } else {
        material.emissive.lerpColors(
          gasColors.normal,
          gasColors.cold,
          Math.abs(
            tempSpikeRef.current,
          ) * 2,
        );

        material.emissiveIntensity =
          0.2;
      }
    }

    if (flashLightRef.current) {
      flashLightRef.current.intensity =
        tempSpikeRef.current > 0.6
          ? (tempSpikeRef.current -
              0.6) *
            5
          : 0;
    }

    const realPressure =
      (boyleConstant / volume) *
      (1 +
        tempSpikeRef.current *
          1.5);

    if (needleGroupRef.current) {
      const targetAngle =
        clamp(
          mapPressureToAngle(
            realPressure,
          ),
          0.1,
          Math.PI - 0.1,
        );

      needleGroupRef.current.rotation.z =
        THREE.MathUtils.lerp(
          needleGroupRef.current
            .rotation.z,
          targetAngle,
          0.2,
        );
    }

    if (
      onTemperatureChange &&
      state.clock.elapsedTime -
        lastTelemetryTimeRef.current >
        0.12
    ) {
      lastTelemetryTimeRef.current =
        state.clock.elapsedTime;

      const temperature =
        AMBIENT_TEMPERATURE +
        tempSpikeRef.current * 200;

      onTemperatureChange(
        temperature,
      );
    }
  });

  const gasHeight =
    volume * VOLUME_SCALE;

  const pistonY =
    BASE_Y + gasHeight;

  return (
    <group position={[0, 0.8, 0]}>
      <pointLight
        ref={flashLightRef}
        color="#fef08a"
        position={[
          0,
          BASE_Y + 1.5,
          0,
        ]}
        distance={4}
        intensity={0}
      />

      {/* Giá đỡ */}
      <group
        position={[
          -1.2,
          BASE_Y,
          -0.15,
        ]}
      >
        <mesh castShadow receiveShadow>
          <cylinderGeometry
            args={[
              0.22,
              0.22,
              0.15,
              32,
            ]}
          />

          <primitive
            object={materials.iron}
            attach="material"
          />
        </mesh>

        <mesh
          position={[0, 2.5, 0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry
            args={[
              0.04,
              0.04,
              5.5,
              16,
            ]}
          />

          <primitive
            object={materials.metal}
            attach="material"
          />
        </mesh>

        <mesh
          position={[0, -0.05, 0.6]}
          rotation={[
            Math.PI / 2 - 0.05,
            0,
            0,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.08,
              0.1,
              1.2,
              16,
            ]}
          />

          <primitive
            object={materials.iron}
            attach="material"
          />
        </mesh>

        <mesh
          position={[
            -0.52,
            -0.05,
            -0.3,
          ]}
          rotation={[
            Math.PI / 2 - 0.05,
            0,
            (2 * Math.PI) / 3,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.08,
              0.1,
              1.2,
              16,
            ]}
          />

          <primitive
            object={materials.iron}
            attach="material"
          />
        </mesh>

        <mesh
          position={[
            0.52,
            -0.05,
            -0.3,
          ]}
          rotation={[
            Math.PI / 2 - 0.05,
            0,
            (-2 * Math.PI) / 3,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.08,
              0.1,
              1.2,
              16,
            ]}
          />

          <primitive
            object={materials.iron}
            attach="material"
          />
        </mesh>
      </group>

      {/* Ngàm kẹp */}
      <group
        position={[
          -0.55,
          BASE_Y + 2,
          -0.15,
        ]}
      >
        <mesh
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[1.4, 0.25, 0.4]}
          />

          <primitive
            object={materials.orange}
            attach="material"
          />
        </mesh>
      </group>

      {/* Thước hai bên */}
      <mesh
        position={[
          -0.28,
          BASE_Y + 1.6,
          -0.16,
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            0.22,
            3.6,
            0.02,
          ]}
        />

        <primitive
          object={materials.white}
          attach="material"
        />
      </mesh>

      <mesh
        position={[
          0.28,
          BASE_Y + 1.6,
          -0.16,
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            0.22,
            3.6,
            0.02,
          ]}
        />

        <primitive
          object={materials.white}
          attach="material"
        />
      </mesh>

      {majorScaleValues.map(
        (scaleValue) => {
          const y =
            BASE_Y +
            scaleValue *
              VOLUME_SCALE;

          return (
            <group
              key={scaleValue}
            >
              <mesh
                position={[
                  -0.22,
                  y,
                  -0.14,
                ]}
              >
                <boxGeometry
                  args={[
                    0.1,
                    0.018,
                    0.012,
                  ]}
                />

                <primitive
                  object={
                    materials.dark
                  }
                  attach="material"
                />
              </mesh>

              <mesh
                position={[
                  0.22,
                  y,
                  -0.14,
                ]}
              >
                <boxGeometry
                  args={[
                    0.1,
                    0.018,
                    0.012,
                  ]}
                />

                <primitive
                  object={
                    materials.dark
                  }
                  attach="material"
                />
              </mesh>
            </group>
          );
        },
      )}

      {/* Đáy xilanh */}
      <mesh
        position={[
          0,
          BASE_Y - 0.1,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            CYLINDER_RADIUS,
            CYLINDER_RADIUS,
            0.2,
            32,
          ]}
        />

        <primitive
          object={materials.white}
          attach="material"
        />
      </mesh>

      {/* Thành xilanh */}
      <mesh
        position={[
          0,
          BASE_Y + 1.6,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            CYLINDER_RADIUS,
            CYLINDER_RADIUS,
            3.2,
            32,
            1,
            true,
          ]}
        />

        <primitive
          object={materials.glass}
          attach="material"
        />
      </mesh>

      {/* Khối khí */}
      <mesh
        position={[
          0,
          BASE_Y +
            gasHeight / 2,
          0,
        ]}
        scale={[
          1,
          gasHeight,
          1,
        ]}
      >
        <cylinderGeometry
          args={[
            0.138,
            0.138,
            1,
            32,
          ]}
        />

        <meshStandardMaterial
          ref={gasMaterialRef}
          color="#0ea5e9"
          transparent
          opacity={0.35}
          roughness={0.1}
          depthWrite={false}
          emissive="#0284c7"
          emissiveIntensity={0.2}
        />
      </mesh>

      <GasParticles
        volume={volume}
        visible={showParticles}
        tempSpikeRef={
          tempSpikeRef
        }
        baseY={BASE_Y}
        volumeScale={VOLUME_SCALE}
        cylinderRadius={
          CYLINDER_RADIUS
        }
        maxVolume={volumeMax}
      />

      {/* Pít-tông */}
      <group
        position={[
          0,
          pistonY,
          0,
        ]}
        onPointerDown={
          handlePistonPointerDown
        }
        onPointerEnter={() =>
          setPistonHovered(true)
        }
        onPointerLeave={() =>
          setPistonHovered(false)
        }
      >
        <mesh castShadow>
          <cylinderGeometry
            args={[
              0.145,
              0.145,
              0.1,
              32,
            ]}
          />

          <primitive
            object={materials.dark}
            attach="material"
          />
        </mesh>

        <mesh
          position={[0, 1.5, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.06,
              0.06,
              2.8,
              16,
            ]}
          />

          <primitive
            object={materials.white}
            attach="material"
          />
        </mesh>

        <mesh
          position={[0, 2.9, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.15,
              0.15,
              0.2,
              16,
            ]}
          />

          <primitive
            object={materials.orange}
            attach="material"
          />
        </mesh>

        {/* Áp kế */}
        <group
          position={[
            0,
            3.15,
            0,
          ]}
        >
          <mesh
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.45,
                0.45,
                0.06,
                32,
                1,
                false,
                -Math.PI / 2,
                Math.PI,
              ]}
            />

            <primitive
              object={
                materials.metal
              }
              attach="material"
            />
          </mesh>

          {gaugeValues.map(
            (pressure) => {
              const angle =
                mapPressureToAngle(
                  pressure,
                );

              return (
                <mesh
                  key={pressure}
                  position={[
                    Math.cos(
                      angle,
                    ) * 0.4,
                    Math.sin(
                      angle,
                    ) * 0.4,
                    0.05,
                  ]}
                  rotation={[
                    0,
                    0,
                    angle,
                  ]}
                >
                  <boxGeometry
                    args={[
                      0.045,
                      0.012,
                      0.012,
                    ]}
                  />

                  <primitive
                    object={
                      materials.dark
                    }
                    attach="material"
                  />
                </mesh>
              );
            },
          )}

          <group
            ref={needleGroupRef}
            position={[
              0,
              0,
              0.07,
            ]}
          >
            <mesh
              position={[
                0.18,
                0,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  0.36,
                  0.015,
                  0.012,
                ]}
              />

              <primitive
                object={
                  materials.red
                }
                attach="material"
              />
            </mesh>
          </group>

          <mesh
            position={[
              0,
              0,
              0.08,
            ]}
          >
            <circleGeometry
              args={[0.035, 20]}
            />

            <primitive
              object={
                materials.dark
              }
              attach="material"
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}