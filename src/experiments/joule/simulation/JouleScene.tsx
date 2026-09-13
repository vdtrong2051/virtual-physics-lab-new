import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  RefObject,
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

import {
  joulePhysicsConfig,
} from "../data";

import type {
  JouleMotionPhase,
} from "../model";

const FLOOR_Y = -2.5;
const START_Y = 2.5;

const LEFT_X = -2.8;
const RIGHT_X = 2.8;
const CENTER_X = 0;

const PULLEY_Y = 3.2;

const WEIGHT_DISC_HEIGHT = 0.3;
const WEIGHT_BASE_CLEARANCE = 0.4;

const FALL_HEAT_FRACTION = 0.15;
const NORMAL_SPIN_DURATION_S = 1.8;
const VISUAL_GRAVITY_SCALE = 0.55;

const TELEMETRY_INTERVAL_S = 0.1;

export type JouleSimulationTelemetry = {
  elapsedTimeS: number;

  currentHeightM: number;
  maxDropHeightM: number;

  potentialEnergyJ: number;
  kineticEnergyJ: number;
  heatEnergyJ: number;

  temperatureRiseC: number;
  temperatureC: number;
};

type JouleSceneProps = {
  massPerSideKg: number;
  dropHeightM: number;
  motionPhase: JouleMotionPhase;

  slowMotion?: boolean;
  interactionLocked?: boolean;

  onMotionPhaseChange: (
    phase: JouleMotionPhase,
  ) => void;

  onDropHeightChange: (
    dropHeightM: number,
  ) => void;

  onWeightDragChange?: (
    dragging: boolean,
  ) => void;

  onTelemetryChange?: (
    telemetry: JouleSimulationTelemetry,
  ) => void;

  onMaxDropHeightChange?: (
    maxDropHeightM: number,
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

function snapDropHeight(
  value: number,
  maxDropHeightM: number,
) {
  const clamped = clamp(
    value,
    joulePhysicsConfig.dropHeightMinM,
    maxDropHeightM,
  );

  const stepped =
    Math.round(
      clamped /
        joulePhysicsConfig.dropHeightStepM,
    ) *
    joulePhysicsConfig.dropHeightStepM;

  return clamp(
    Number(stepped.toFixed(10)),
    joulePhysicsConfig.dropHeightMinM,
    maxDropHeightM,
  );
}

function getWeightCount(
  massPerSideKg: number,
) {
  return Math.max(
    1,
    Math.floor(massPerSideKg * 2),
  );
}

function getWeightStackHeight(
  massPerSideKg: number,
) {
  return (
    getWeightCount(massPerSideKg) *
    WEIGHT_DISC_HEIGHT
  );
}

function getStopY(
  massPerSideKg: number,
) {
  return (
    FLOOR_Y +
    WEIGHT_BASE_CLEARANCE +
    getWeightStackHeight(
      massPerSideKg,
    ) /
      2
  );
}

function getMaxDropHeight(
  massPerSideKg: number,
) {
  return Math.max(
    joulePhysicsConfig.dropHeightMinM,
    START_Y - getStopY(massPerSideKg),
  );
}

function WeightStack({
  massPerSideKg,
}: {
  massPerSideKg: number;
}) {
  const weightCount =
    getWeightCount(massPerSideKg);

  const stackHeight =
    getWeightStackHeight(
      massPerSideKg,
    );

  return (
    <group>
      {Array.from({
        length: weightCount,
      }).map((_, index) => {
        const y =
          -stackHeight / 2 +
          WEIGHT_DISC_HEIGHT / 2 +
          index * WEIGHT_DISC_HEIGHT;

        return (
          <mesh
            key={index}
            position={[0, y, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry
              args={[
                0.5,
                0.5,
                WEIGHT_DISC_HEIGHT * 0.86,
                40,
              ]}
            />

            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.86}
              roughness={0.28}
            />
          </mesh>
        );
      })}

      <mesh
        position={[
          0,
          stackHeight / 2 + 0.12,
          0,
        ]}
      >
        <torusGeometry
          args={[0.13, 0.035, 12, 28]}
        />

        <meshStandardMaterial
          color="#d97706"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function Stand({
  x,
}: {
  x: number;
}) {
  return (
    <group
      position={[x, FLOOR_Y, -1.2]}
    >
      <mesh
        position={[0, 0.12, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[1.5, 0.24, 1.5]}
        />

        <meshStandardMaterial
          color="#1a1c1e"
          metalness={0.75}
          roughness={0.5}
        />
      </mesh>

      <mesh
        position={[0, 3, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.15,
            0.15,
            6.5,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#7f8ea3"
          metalness={0.92}
          roughness={0.32}
        />
      </mesh>

      <mesh
        position={[
          0,
          PULLEY_Y - FLOOR_Y,
          1.2,
        ]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.08,
            0.08,
            1.2,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#374151"
          metalness={0.88}
          roughness={0.36}
        />
      </mesh>
    </group>
  );
}

function Pulley({
  groupRef,
  x,
}: {
  groupRef: RefObject<THREE.Group | null>;
  x: number;
}) {
  return (
    <group
      ref={groupRef}
      position={[x, PULLEY_Y, 0]}
      rotation={[
        0,
        0,
        Math.PI / 2,
      ]}
    >
      <mesh castShadow>
        <cylinderGeometry
          args={[
            0.28,
            0.28,
            0.18,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#334155"
          metalness={0.9}
          roughness={0.32}
        />
      </mesh>

      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry
          args={[
            0.32,
            0.32,
            0.035,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#64748b"
          metalness={0.95}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry
          args={[
            0.32,
            0.32,
            0.035,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#64748b"
          metalness={0.95}
          roughness={0.28}
        />
      </mesh>
    </group>
  );
}

export default function JouleScene({
  massPerSideKg,
  dropHeightM,
  motionPhase,
  slowMotion = false,
  interactionLocked = false,
  onMotionPhaseChange,
  onDropHeightChange,
  onWeightDragChange,
  onTelemetryChange,
  onMaxDropHeightChange,
}: JouleSceneProps) {
  const { size } = useThree();

  const [
    weightHovered,
    setWeightHovered,
  ] = useState(false);

  const [
    weightDragging,
    setWeightDragging,
  ] = useState(false);

  useCursor(
    weightHovered || weightDragging,
    motionPhase === "idle" &&
      !interactionLocked
      ? weightDragging
        ? "grabbing"
        : "grab"
      : "not-allowed",
    "auto",
  );

  const leftWeightRef =
    useRef<THREE.Group>(null);

  const rightWeightRef =
    useRef<THREE.Group>(null);

  const leftRopeRef =
    useRef<THREE.Mesh>(null);

  const rightRopeRef =
    useRef<THREE.Mesh>(null);

  const leftPulleyRef =
    useRef<THREE.Group>(null);

  const rightPulleyRef =
    useRef<THREE.Group>(null);

  const paddleRef =
    useRef<THREE.Group>(null);

  const waterRef =
    useRef<THREE.Mesh>(null);

  const weightYRef =
    useRef(START_Y);

  const draggingRef =
    useRef(false);

  const dragStartClientYRef =
    useRef(0);

  const dragStartHeightRef =
    useRef(dropHeightM);

  const dragHeightRef =
    useRef(dropHeightM);

  const activePointerIdRef =
    useRef<number | null>(null);

  const velocityRef =
    useRef(0);

  const kineticEnergyRef =
    useRef(0);

  const heatEnergyRef =
    useRef(0);

  const paddleOmegaRef =
    useRef(0);

  const lastTelemetryTimeRef =
    useRef(0);

  const simulationElapsedTimeRef =
    useRef(0);

  const requestedPhaseRef =
    useRef<JouleMotionPhase | null>(
      null,
    );

  const maxDropHeightM =
    useMemo(
      () =>
        getMaxDropHeight(
          massPerSideKg,
        ),
      [massPerSideKg],
    );

  const stopY =
    useMemo(
      () =>
        getStopY(
          massPerSideKg,
        ),
      [massPerSideKg],
    );

  const effectiveDropHeightM =
    snapDropHeight(
      dropHeightM,
      maxDropHeightM,
    );

  const totalMassKg =
    massPerSideKg * 2;

  const totalMechanicalEnergyJ =
    totalMassKg *
    joulePhysicsConfig.gravityMPerS2 *
    effectiveDropHeightM;

  useEffect(() => {
    onMaxDropHeightChange?.(
      maxDropHeightM,
    );

    if (
      dropHeightM >
      maxDropHeightM
    ) {
      onDropHeightChange(
        snapDropHeight(
          maxDropHeightM,
          maxDropHeightM,
        ),
      );
    }
  }, [
    dropHeightM,
    maxDropHeightM,
    onDropHeightChange,
    onMaxDropHeightChange,
  ]);

  useEffect(() => {
    requestedPhaseRef.current = null;

    if (motionPhase !== "idle") {
      return;
    }

    weightYRef.current =
      stopY + effectiveDropHeightM;

    velocityRef.current = 0;
    kineticEnergyRef.current = 0;
    heatEnergyRef.current = 0;
    paddleOmegaRef.current = 0;
    simulationElapsedTimeRef.current = 0;
  }, [
    effectiveDropHeightM,
    motionPhase,
    stopY,
  ]);

  useEffect(() => {
    function handlePointerMove(
      event: PointerEvent,
    ) {
      if (
        interactionLocked ||
        !draggingRef.current ||
        activePointerIdRef.current !==
          event.pointerId
      ) {
        return;
      }

      event.preventDefault();

      const fullHeightRange =
        Math.max(
          0.001,
          maxDropHeightM -
            joulePhysicsConfig
              .dropHeightMinM,
        );

      const pixelsForFullRange =
        Math.max(
          size.height * 0.55,
          220,
        );

      const heightPerPixel =
        fullHeightRange /
        pixelsForFullRange;

      const deltaY =
        event.clientY -
        dragStartClientYRef.current;

      const nextHeight =
        snapDropHeight(
          dragStartHeightRef.current -
            deltaY *
              heightPerPixel,
          maxDropHeightM,
        );

      dragHeightRef.current =
        nextHeight;

      weightYRef.current =
        stopY + nextHeight;

      onDropHeightChange(
        nextHeight,
      );
    }

    function finishPointerDrag(
      event: PointerEvent,
    ) {
      if (
        !draggingRef.current ||
        activePointerIdRef.current !==
          event.pointerId
      ) {
        return;
      }

      draggingRef.current = false;
      activePointerIdRef.current = null;

      setWeightDragging(false);
      onWeightDragChange?.(false);

      if (
        !interactionLocked &&
        motionPhase === "idle" &&
        dragHeightRef.current >=
          joulePhysicsConfig
            .dropHeightMinM
      ) {
        onMotionPhaseChange(
          "falling",
        );
      }
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
      finishPointerDrag,
    );

    window.addEventListener(
      "pointercancel",
      finishPointerDrag,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "pointerup",
        finishPointerDrag,
      );

      window.removeEventListener(
        "pointercancel",
        finishPointerDrag,
      );
    };
  }, [
    interactionLocked,
    maxDropHeightM,
    motionPhase,
    onDropHeightChange,
    onMotionPhaseChange,
    onWeightDragChange,
    size.height,
    stopY,
  ]);

  function handleWeightPointerDown(
    event: ThreeEvent<PointerEvent>,
  ) {
    event.stopPropagation();

    if (
      interactionLocked ||
      motionPhase !== "idle"
    ) {
      return;
    }

    draggingRef.current = true;

    activePointerIdRef.current =
      event.nativeEvent.pointerId;

    dragStartClientYRef.current =
      event.nativeEvent.clientY;

    dragStartHeightRef.current =
      effectiveDropHeightM;

    dragHeightRef.current =
      effectiveDropHeightM;

    setWeightDragging(true);
    onWeightDragChange?.(true);
  }

  useFrame((state, rawDelta) => {
    const timeScale =
      slowMotion ? 0.25 : 1;

    const delta =
      Math.min(rawDelta, 0.05) *
      timeScale;

    if (
      motionPhase === "falling" ||
      motionPhase === "spinning"
    ) {
      simulationElapsedTimeRef.current +=
        delta;
    }

    if (motionPhase === "falling") {
      velocityRef.current +=
        joulePhysicsConfig
          .gravityMPerS2 *
        VISUAL_GRAVITY_SCALE *
        delta;

      weightYRef.current = Math.max(
        stopY,
        weightYRef.current -
          velocityRef.current * delta,
      );

      const currentHeightM =
        Math.max(
          0,
          weightYRef.current -
            stopY,
        );

      const potentialEnergyJ =
        totalMassKg *
        joulePhysicsConfig
          .gravityMPerS2 *
        currentHeightM;

      const convertedEnergyJ =
        Math.max(
          0,
          totalMechanicalEnergyJ -
            potentialEnergyJ,
        );

      heatEnergyRef.current =
        convertedEnergyJ *
        FALL_HEAT_FRACTION;

      kineticEnergyRef.current =
        Math.max(
          0,
          convertedEnergyJ -
            heatEnergyRef.current,
        );

      paddleOmegaRef.current =
        Math.min(
          10,
          Math.sqrt(
            kineticEnergyRef.current,
          ) * 0.85,
        );

      if (
        weightYRef.current <=
          stopY + 0.001 &&
        requestedPhaseRef.current ===
          null
      ) {
        weightYRef.current = stopY;
        velocityRef.current = 0;

        requestedPhaseRef.current =
          "spinning";

        onMotionPhaseChange(
          "spinning",
        );
      }
    } else if (
      motionPhase === "spinning"
    ) {
      const dissipationRateJPerS =
        totalMechanicalEnergyJ /
        NORMAL_SPIN_DURATION_S;

      const dissipatedEnergyJ =
        Math.min(
          kineticEnergyRef.current,
          dissipationRateJPerS *
            delta,
        );

      kineticEnergyRef.current =
        Math.max(
          0,
          kineticEnergyRef.current -
            dissipatedEnergyJ,
        );

      heatEnergyRef.current =
        Math.min(
          totalMechanicalEnergyJ,
          heatEnergyRef.current +
            dissipatedEnergyJ,
        );

      paddleOmegaRef.current =
        Math.min(
          10,
          Math.sqrt(
            kineticEnergyRef.current,
          ) * 0.85,
        );

      if (
        kineticEnergyRef.current <=
          0.0001 &&
        requestedPhaseRef.current ===
          null
      ) {
        kineticEnergyRef.current = 0;
        heatEnergyRef.current =
          totalMechanicalEnergyJ;

        paddleOmegaRef.current = 0;

        requestedPhaseRef.current =
          "finished";

        onMotionPhaseChange(
          "finished",
        );
      }
    } else if (
      motionPhase === "finished"
    ) {
      weightYRef.current = stopY;
      velocityRef.current = 0;
      kineticEnergyRef.current = 0;
      heatEnergyRef.current =
        totalMechanicalEnergyJ;
      paddleOmegaRef.current = 0;
    }

    const currentHeightM =
      Math.max(
        0,
        weightYRef.current - stopY,
      );

    const potentialEnergyJ =
      motionPhase === "idle"
        ? totalMechanicalEnergyJ
        : totalMassKg *
          joulePhysicsConfig
            .gravityMPerS2 *
          currentHeightM;

    if (leftWeightRef.current) {
      leftWeightRef.current.position.y =
        weightYRef.current;
    }

    if (rightWeightRef.current) {
      rightWeightRef.current.position.y =
        weightYRef.current;
    }

    const ropeBottomY =
      weightYRef.current +
      getWeightStackHeight(
        massPerSideKg,
      ) /
        2 +
      0.22;

    const ropeLength =
      Math.max(
        0.05,
        PULLEY_Y - ropeBottomY,
      );

    for (
      const ropeRef of [
        leftRopeRef,
        rightRopeRef,
      ]
    ) {
      if (!ropeRef.current) {
        continue;
      }

      ropeRef.current.position.y =
        ropeBottomY +
        ropeLength / 2;

      ropeRef.current.scale.y =
        ropeLength;
    }

    const pulleyRotationDelta =
      velocityRef.current *
      delta *
      0.4;

    if (leftPulleyRef.current) {
      leftPulleyRef.current.rotation.x -=
        pulleyRotationDelta;
    }

    if (rightPulleyRef.current) {
      rightPulleyRef.current.rotation.x +=
        pulleyRotationDelta;
    }

    if (paddleRef.current) {
      paddleRef.current.rotation.y -=
        paddleOmegaRef.current *
        delta;
    }

    if (waterRef.current) {
      waterRef.current.rotation.y -=
        paddleOmegaRef.current *
        delta *
        0.16;
    }

    const temperatureRiseC =
      heatEnergyRef.current /
      (
        joulePhysicsConfig.waterMassKg *
        joulePhysicsConfig
          .waterSpecificHeatJPerKgC
      );

    if (
      onTelemetryChange &&
      state.clock.elapsedTime -
        lastTelemetryTimeRef.current >=
        TELEMETRY_INTERVAL_S
    ) {
      lastTelemetryTimeRef.current =
        state.clock.elapsedTime;

      onTelemetryChange({
        elapsedTimeS:
          simulationElapsedTimeRef.current,

        currentHeightM,
        maxDropHeightM,

        potentialEnergyJ,
        kineticEnergyJ:
          kineticEnergyRef.current,
        heatEnergyJ:
          heatEnergyRef.current,

        temperatureRiseC,
        temperatureC:
          joulePhysicsConfig
            .initialTemperatureC +
          temperatureRiseC,
      });
    }
  });

  return (
    <group>
      {/* Bàn thí nghiệm */}
      <mesh
        position={[
          0,
          FLOOR_Y - 0.4,
          0,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[14, 0.8, 8]}
        />

        <meshStandardMaterial
          color="#2d251f"
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      {/* Hai giá đỡ */}
      <Stand x={LEFT_X} />
      <Stand x={RIGHT_X} />

      {/* Hai ròng rọc */}
      <Pulley
        groupRef={leftPulleyRef}
        x={LEFT_X}
      />

      <Pulley
        groupRef={rightPulleyRef}
        x={RIGHT_X}
      />

      {/* Dây treo */}
      <mesh
        ref={leftRopeRef}
        position={[
          LEFT_X,
          PULLEY_Y - 1,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.025,
            0.025,
            1,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.7}
        />
      </mesh>

      <mesh
        ref={rightRopeRef}
        position={[
          RIGHT_X,
          PULLEY_Y - 1,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.025,
            0.025,
            1,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.7}
        />
      </mesh>

      {/* Hai chồng tạ */}
      <group
        ref={leftWeightRef}
        position={[
          LEFT_X,
          stopY +
            effectiveDropHeightM,
          0,
        ]}
        onPointerDown={
          handleWeightPointerDown
        }
        onPointerEnter={() =>
          setWeightHovered(true)
        }
        onPointerLeave={() =>
          setWeightHovered(false)
        }
      >
        <WeightStack
          massPerSideKg={
            massPerSideKg
          }
        />
      </group>

      <group
        ref={rightWeightRef}
        position={[
          RIGHT_X,
          stopY +
            effectiveDropHeightM,
          0,
        ]}
        onPointerDown={
          handleWeightPointerDown
        }
        onPointerEnter={() =>
          setWeightHovered(true)
        }
        onPointerLeave={() =>
          setWeightHovered(false)
        }
      >
        <WeightStack
          massPerSideKg={
            massPerSideKg
          }
        />
      </group>

      {/* Bình nhiệt lượng */}
      <group
        position={[
          CENTER_X,
          -1,
          0,
        ]}
      >
        <mesh
          castShadow
          receiveShadow
        >
          <cylinderGeometry
            args={[
              1.5,
              1.5,
              3.2,
              64,
              1,
              true,
            ]}
          />

          <meshPhysicalMaterial
            color="#dbeafe"
            transparent
            opacity={0.22}
            transmission={0.78}
            roughness={0.08}
            metalness={0.08}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <mesh
          ref={waterRef}
          position={[0, -0.12, 0]}
        >
          <cylinderGeometry
            args={[
              1.42,
              1.42,
              2.72,
              64,
            ]}
          />

          <meshPhysicalMaterial
            color="#0ea5e9"
            transparent
            opacity={0.58}
            roughness={0.08}
            metalness={0.06}
          />
        </mesh>

        {/* Trục + cánh khuấy */}
        <group ref={paddleRef}>
          <mesh
            position={[0, 0.25, 0]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.06,
                0.06,
                4.2,
                24,
              ]}
            />

            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>

          {Array.from({
            length: 6,
          }).map((_, index) => {
            const y =
              -1.05 + index * 0.4;

            const angle =
              index *
              (Math.PI / 3);

            return (
              <mesh
                key={index}
                position={[0, y, 0]}
                rotation={[
                  0,
                  angle,
                  0,
                ]}
                castShadow
              >
                <boxGeometry
                  args={[
                    1.8,
                    0.12,
                    0.08,
                  ]}
                />

                <meshStandardMaterial
                  color="#e2e8f0"
                  metalness={0.94}
                  roughness={0.2}
                />
              </mesh>
            );
          })}
        </group>

        {/* Nhiệt kế */}
        <group
          position={[1.05, 0.8, 0]}
        >
          <mesh>
            <cylinderGeometry
              args={[
                0.055,
                0.055,
                2.5,
                18,
              ]}
            />

            <meshPhysicalMaterial
              color="#f8fafc"
              transparent
              opacity={0.72}
              roughness={0.12}
            />
          </mesh>

          <mesh
            position={[0, -1.05, 0]}
          >
            <sphereGeometry
              args={[0.12, 20, 20]}
            />

            <meshStandardMaterial
              color="#ef4444"
              emissive="#7f1d1d"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* Mốc cao độ trực quan */}
      <mesh
        position={[
          LEFT_X + 0.55,
          FLOOR_Y + 3,
          -1.18,
        ]}
      >
        <boxGeometry
          args={[0.16, 5.8, 0.03]}
        />

        <meshStandardMaterial
          color="#fde047"
          roughness={0.75}
        />
      </mesh>

      {/* Giới hạn dưới của chồng tạ */}
      <mesh
        position={[
          LEFT_X,
          FLOOR_Y +
            WEIGHT_BASE_CLEARANCE -
            0.02,
          0,
        ]}
        receiveShadow
      >
        <cylinderGeometry
          args={[
            0.64,
            0.64,
            0.04,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#334155"
          metalness={0.65}
          roughness={0.42}
        />
      </mesh>

      <mesh
        position={[
          RIGHT_X,
          FLOOR_Y +
            WEIGHT_BASE_CLEARANCE -
            0.02,
          0,
        ]}
        receiveShadow
      >
        <cylinderGeometry
          args={[
            0.64,
            0.64,
            0.04,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#334155"
          metalness={0.65}
          roughness={0.42}
        />
      </mesh>
    </group>
  );
}