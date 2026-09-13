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

const FRAME_LEFT_X = -3.55;
const FRAME_RIGHT_X = 3.55;
const FRAME_TOP_Y = 4.05;

const PULLEY_Y = 3.2;
const PULLEY_RADIUS = 0.34;

const LEFT_ROPE_Z = 0.18;
const RIGHT_ROPE_Z = -0.18;

const VERTICAL_ROPE_TOP_Y =
  PULLEY_Y - PULLEY_RADIUS;

const DRIVE_ROPE_Y =
  PULLEY_Y + PULLEY_RADIUS;

const DRIVE_DRUM_Y = DRIVE_ROPE_Y;
const DRIVE_DRUM_RADIUS = 0.42;
const DRIVE_DRUM_HEIGHT = 0.48;
const DRIVE_ROPE_RADIUS = 0.022;

const CALORIMETER_CENTER_Y = -1;
const CALORIMETER_RADIUS = 1.42;
const CALORIMETER_HEIGHT = 2.8;

const WATER_RADIUS = 1.24;
const WATER_HEIGHT = 2.18;

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
          <group
            key={index}
            position={[0, y, 0]}
          >
            <mesh
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[
                  0.44,
                  0.44,
                  WEIGHT_DISC_HEIGHT * 0.78,
                  40,
                ]}
              />

              <meshStandardMaterial
                color="#5b4636"
                metalness={0.72}
                roughness={0.34}
              />
            </mesh>

            <mesh
              position={[
                0,
                WEIGHT_DISC_HEIGHT * 0.4,
                0,
              ]}
              rotation={[
                Math.PI / 2,
                0,
                0,
              ]}
            >
              <torusGeometry
                args={[
                  0.35,
                  0.018,
                  10,
                  36,
                ]}
              />

              <meshStandardMaterial
                color="#a9712a"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}

      <mesh
        position={[
          0,
          stackHeight / 2 + 0.12,
          0,
        ]}
        castShadow
      >
        <torusGeometry
          args={[
            0.13,
            0.035,
            12,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#b7791f"
          metalness={0.86}
          roughness={0.28}
        />
      </mesh>
    </group>
  );
}

function SupportFrame() {
  const uprights = [
    FRAME_LEFT_X,
    FRAME_RIGHT_X,
  ];

  return (
    <group>
      {uprights.map((x) => (
        <group key={x}>
          <mesh
            position={[
              x,
              FLOOR_Y + 0.08,
              -0.62,
            ]}
            castShadow
            receiveShadow
          >
            <boxGeometry
              args={[
                1.15,
                0.18,
                1.2,
              ]}
            />

            <meshStandardMaterial
              color="#111827"
              metalness={0.72}
              roughness={0.42}
            />
          </mesh>

          <mesh
            position={[
              x,
              0.6,
              -0.62,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.22,
                6.25,
                0.22,
              ]}
            />

            <meshStandardMaterial
              color="#475569"
              metalness={0.86}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      <mesh
        position={[
          CENTER_X,
          FRAME_TOP_Y,
          -0.62,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            7.35,
            0.22,
            0.24,
          ]}
        />

        <meshStandardMaterial
          color="#475569"
          metalness={0.86}
          roughness={0.3}
        />
      </mesh>

      {[
        [LEFT_X, LEFT_ROPE_Z],
        [RIGHT_X, RIGHT_ROPE_Z],
      ].map(([x, z]) => (
        <group key={`${x}-${z}`}>
          <mesh
            position={[
              x,
              (FRAME_TOP_Y + PULLEY_Y) / 2,
              z,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.14,
                FRAME_TOP_Y -
                  PULLEY_Y +
                  0.08,
                0.14,
              ]}
            />

            <meshStandardMaterial
              color="#64748b"
              metalness={0.9}
              roughness={0.28}
            />
          </mesh>

          <mesh
            position={[
              x,
              FRAME_TOP_Y - 0.08,
              (z - 0.62) / 2,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.16,
                0.16,
                Math.abs(z + 0.62),
              ]}
            />

            <meshStandardMaterial
              color="#64748b"
              metalness={0.9}
              roughness={0.28}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Pulley({
  groupRef,
  x,
  z,
}: {
  groupRef:
    RefObject<THREE.Group | null>;
  x: number;
  z: number;
}) {
  return (
    <group
      ref={groupRef}
      position={[
        x,
        PULLEY_Y,
        z,
      ]}
    >
      <mesh
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            PULLEY_RADIUS,
            PULLEY_RADIUS,
            0.16,
            40,
          ]}
        />

        <meshStandardMaterial
          color="#1f2937"
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>

      <mesh castShadow>
        <torusGeometry
          args={[
            PULLEY_RADIUS - 0.035,
            0.045,
            12,
            40,
          ]}
        />

        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.94}
          roughness={0.22}
        />
      </mesh>

      <mesh
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.07,
            0.07,
            0.34,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.96}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

type RopePoint = [
  number,
  number,
  number,
];

function RopeSegment({
  start,
  end,
}: {
  start: RopePoint;
  end: RopePoint;
}) {
  const startVector =
    new THREE.Vector3(
      start[0],
      start[1],
      start[2],
    );

  const endVector =
    new THREE.Vector3(
      end[0],
      end[1],
      end[2],
    );

  const direction =
    new THREE.Vector3()
      .subVectors(
        endVector,
        startVector,
      );

  const length =
    direction.length();

  const midpoint =
    new THREE.Vector3()
      .addVectors(
        startVector,
        endVector,
      )
      .multiplyScalar(0.5);

  const quaternion =
    new THREE.Quaternion()
      .setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction
          .clone()
          .normalize(),
      );

  return (
    <mesh
      position={[
        midpoint.x,
        midpoint.y,
        midpoint.z,
      ]}
      quaternion={quaternion}
      castShadow
    >
      <cylinderGeometry
        args={[
          DRIVE_ROPE_RADIUS,
          DRIVE_ROPE_RADIUS,
          length,
          12,
        ]}
      />

      <meshStandardMaterial
        color="#d6d3d1"
        roughness={0.74}
        metalness={0.05}
      />
    </mesh>
  );
}

function DriveRopeSystem() {
  return (
    <group>
      <RopeSegment
        start={[
          LEFT_X +
            PULLEY_RADIUS * 0.1,
          DRIVE_ROPE_Y,
          LEFT_ROPE_Z,
        ]}
        end={[
          -DRIVE_DRUM_RADIUS,
          DRIVE_ROPE_Y,
          LEFT_ROPE_Z,
        ]}
      />

      <RopeSegment
        start={[
          DRIVE_DRUM_RADIUS,
          DRIVE_ROPE_Y,
          RIGHT_ROPE_Z,
        ]}
        end={[
          RIGHT_X -
            PULLEY_RADIUS * 0.1,
          DRIVE_ROPE_Y,
          RIGHT_ROPE_Z,
        ]}
      />
    </group>
  );
}

function HeightScale() {
  return (
    <group
      position={[
        LEFT_X + 0.72,
        0.35,
        -0.72,
      ]}
    >
      <mesh>
        <boxGeometry
          args={[
            0.08,
            5.45,
            0.06,
          ]}
        />

        <meshStandardMaterial
          color="#d6b84b"
          metalness={0.2}
          roughness={0.62}
        />
      </mesh>

      {Array.from({
        length: 11,
      }).map((_, index) => {
        const y =
          -2.5 + index * 0.5;

        const major =
          index % 2 === 0;

        return (
          <mesh
            key={index}
            position={[
              major
                ? 0.16
                : 0.12,
              y,
              0.01,
            ]}
          >
            <boxGeometry
              args={[
                major
                  ? 0.28
                  : 0.2,
                0.025,
                0.07,
              ]}
            />

            <meshStandardMaterial
              color="#fde68a"
              metalness={0.15}
              roughness={0.58}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function StationaryVanes() {
  const vaneLevels = [
    -1.42,
    -0.92,
    -0.42,
  ];

  return (
    <group>
      {vaneLevels.flatMap(
        (levelY) => [
          <mesh
            key={`${levelY}-right`}
            position={[
              0.95,
              levelY,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.58,
                0.11,
                0.28,
              ]}
            />

            <meshStandardMaterial
              color="#b08d57"
              metalness={0.82}
              roughness={0.3}
            />
          </mesh>,

          <mesh
            key={`${levelY}-left`}
            position={[
              -0.95,
              levelY,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.58,
                0.11,
                0.28,
              ]}
            />

            <meshStandardMaterial
              color="#b08d57"
              metalness={0.82}
              roughness={0.3}
            />
          </mesh>,

          <mesh
            key={`${levelY}-front`}
            position={[
              0,
              levelY,
              0.95,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.28,
                0.11,
                0.58,
              ]}
            />

            <meshStandardMaterial
              color="#b08d57"
              metalness={0.82}
              roughness={0.3}
            />
          </mesh>,

          <mesh
            key={`${levelY}-back`}
            position={[
              0,
              levelY,
              -0.95,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.28,
                0.11,
                0.58,
              ]}
            />

            <meshStandardMaterial
              color="#b08d57"
              metalness={0.82}
              roughness={0.3}
            />
          </mesh>,
        ],
      )}
    </group>
  );
}

function RotatingDriveAssembly({
  groupRef,
}: {
  groupRef:
    RefObject<THREE.Group | null>;
}) {
  const paddleLevels = [
    -1.68,
    -1.18,
    -0.68,
    -0.18,
  ];

  const shaftBottomY = -2.05;
  const shaftTopY =
    DRIVE_DRUM_Y + 0.5;

  const shaftLength =
    shaftTopY - shaftBottomY;

  return (
    <group ref={groupRef}>
      <mesh
        position={[
          CENTER_X,
          shaftBottomY +
            shaftLength / 2,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.065,
            0.065,
            shaftLength,
            24,
          ]}
        />

        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[
          CENTER_X,
          DRIVE_DRUM_Y,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            DRIVE_DRUM_RADIUS,
            DRIVE_DRUM_RADIUS,
            DRIVE_DRUM_HEIGHT,
            48,
          ]}
        />

        <meshStandardMaterial
          color="#6b4f3a"
          metalness={0.58}
          roughness={0.38}
        />
      </mesh>

      {[
        -1,
        1,
      ].map((direction) => (
        <mesh
          key={direction}
          position={[
            CENTER_X,
            DRIVE_DRUM_Y +
              direction *
                (
                  DRIVE_DRUM_HEIGHT /
                    2 +
                  0.035
                ),
            0,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              DRIVE_DRUM_RADIUS +
                0.07,
              DRIVE_DRUM_RADIUS +
                0.07,
              0.07,
              48,
            ]}
          />

          <meshStandardMaterial
            color="#8b6f47"
            metalness={0.7}
            roughness={0.32}
          />
        </mesh>
      ))}

      {[
        -0.11,
        0.11,
      ].map((offset) => (
        <mesh
          key={offset}
          position={[
            CENTER_X,
            DRIVE_DRUM_Y + offset,
            0,
          ]}
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              DRIVE_DRUM_RADIUS +
                0.012,
              0.025,
              10,
              40,
            ]}
          />

          <meshStandardMaterial
            color="#d6d3d1"
            roughness={0.7}
            metalness={0.06}
          />
        </mesh>
      ))}

      <mesh
        position={[
          CENTER_X,
          DRIVE_DRUM_Y -
            DRIVE_DRUM_HEIGHT /
              2 -
            0.16,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.16,
            0.16,
            0.22,
            24,
          ]}
        />

        <meshStandardMaterial
          color="#64748b"
          metalness={0.9}
          roughness={0.26}
        />
      </mesh>

      {/* Tay quay dùng để cuốn tạ lên trước mỗi lượt */}
      <mesh
        position={[
          0.42,
          DRIVE_DRUM_Y + 0.46,
          0,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.84,
            0.07,
            0.07,
          ]}
        />

        <meshStandardMaterial
          color="#c7964b"
          metalness={0.72}
          roughness={0.3}
        />
      </mesh>

      <mesh
        position={[
          0.82,
          DRIVE_DRUM_Y + 0.63,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.055,
            0.055,
            0.34,
            18,
          ]}
        />

        <meshStandardMaterial
          color="#a9712a"
          metalness={0.58}
          roughness={0.4}
        />
      </mesh>

      {paddleLevels.map(
        (levelY) => (
          <group
            key={levelY}
            position={[
              CENTER_X,
              levelY,
              0,
            ]}
          >
            <mesh castShadow>
              <cylinderGeometry
                args={[
                  0.13,
                  0.13,
                  0.16,
                  24,
                ]}
              />

              <meshStandardMaterial
                color="#d6b46a"
                metalness={0.86}
                roughness={0.26}
              />
            </mesh>

            <mesh
              position={[
                0.48,
                0,
                0,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  0.82,
                  0.12,
                  0.26,
                ]}
              />

              <meshStandardMaterial
                color="#d6b46a"
                metalness={0.86}
                roughness={0.26}
              />
            </mesh>

            <mesh
              position={[
                -0.48,
                0,
                0,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  0.82,
                  0.12,
                  0.26,
                ]}
              />

              <meshStandardMaterial
                color="#d6b46a"
                metalness={0.86}
                roughness={0.26}
              />
            </mesh>

            <mesh
              position={[
                0,
                0,
                0.48,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  0.26,
                  0.12,
                  0.82,
                ]}
              />

              <meshStandardMaterial
                color="#d6b46a"
                metalness={0.86}
                roughness={0.26}
              />
            </mesh>

            <mesh
              position={[
                0,
                0,
                -0.48,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  0.26,
                  0.12,
                  0.82,
                ]}
              />

              <meshStandardMaterial
                color="#d6b46a"
                metalness={0.86}
                roughness={0.26}
              />
            </mesh>
          </group>
        ),
      )}
    </group>
  );
}

function ThermometerProbe() {
  return (
    <group
      position={[
        0.87,
        0.34,
        0.42,
      ]}
      rotation={[
        0,
        0,
        -0.05,
      ]}
    >
      <mesh castShadow>
        <cylinderGeometry
          args={[
            0.052,
            0.052,
            2.7,
            20,
          ]}
        />

        <meshPhysicalMaterial
          color="#e2e8f0"
          transparent
          opacity={0.48}
          roughness={0.08}
          transmission={0.42}
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.42,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.018,
            0.018,
            1.72,
            14,
          ]}
        />

        <meshStandardMaterial
          color="#ef4444"
          emissive="#7f1d1d"
          emissiveIntensity={0.22}
        />
      </mesh>

      <mesh
        position={[
          0,
          -1.32,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.105,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#ef4444"
          emissive="#7f1d1d"
          emissiveIntensity={0.28}
        />
      </mesh>
    </group>
  );
}

function Calorimeter({
  waterRef,
}: {
  waterRef:
    RefObject<THREE.Mesh | null>;
}) {
  const topY =
    CALORIMETER_CENTER_Y +
    CALORIMETER_HEIGHT / 2;

  const bottomY =
    CALORIMETER_CENTER_Y -
    CALORIMETER_HEIGHT / 2;

  return (
    <group>
      <mesh
        position={[
          CENTER_X,
          CALORIMETER_CENTER_Y,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            CALORIMETER_RADIUS,
            CALORIMETER_RADIUS,
            CALORIMETER_HEIGHT,
            64,
            1,
            true,
          ]}
        />

        <meshPhysicalMaterial
          color="#b87333"
          transparent
          opacity={0.28}
          transmission={0.22}
          roughness={0.25}
          metalness={0.72}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        position={[
          CENTER_X,
          bottomY,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            CALORIMETER_RADIUS +
              0.03,
            CALORIMETER_RADIUS +
              0.03,
            0.14,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#8f5428"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      <mesh
        position={[
          CENTER_X,
          topY,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            CALORIMETER_RADIUS +
              0.05,
            CALORIMETER_RADIUS +
              0.05,
            0.13,
            64,
          ]}
        />

        <meshPhysicalMaterial
          color="#b87333"
          transparent
          opacity={0.72}
          roughness={0.24}
          metalness={0.78}
          depthWrite={false}
        />
      </mesh>

      {[topY, bottomY].map(
        (y) => (
          <mesh
            key={y}
            position={[
              CENTER_X,
              y,
              0,
            ]}
            rotation={[
              Math.PI / 2,
              0,
              0,
            ]}
          >
            <torusGeometry
              args={[
                CALORIMETER_RADIUS +
                  0.035,
                0.055,
                12,
                64,
              ]}
            />

            <meshStandardMaterial
              color="#d09555"
              metalness={0.8}
              roughness={0.28}
            />
          </mesh>
        ),
      )}

      <mesh
        ref={waterRef}
        position={[
          CENTER_X,
          CALORIMETER_CENTER_Y -
            0.12,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            WATER_RADIUS,
            WATER_RADIUS,
            WATER_HEIGHT,
            64,
          ]}
        />

        <meshPhysicalMaterial
          color="#1583a6"
          transparent
          opacity={0.34}
          transmission={0.36}
          roughness={0.18}
          metalness={0.02}
          depthWrite={false}
        />
      </mesh>

      <StationaryVanes />

      <mesh
        position={[
          CENTER_X,
          topY + 0.11,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.18,
            0.18,
            0.18,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#7c4a28"
          metalness={0.78}
          roughness={0.3}
        />
      </mesh>

      <mesh
        position={[
          0.87,
          topY + 0.09,
          0.42,
        ]}
      >
        <cylinderGeometry
          args={[
            0.12,
            0.12,
            0.15,
            24,
          ]}
        />

        <meshStandardMaterial
          color="#7c4a28"
          metalness={0.78}
          roughness={0.3}
        />
      </mesh>

      <ThermometerProbe />
    </group>
  );
}

function WeightCatchPads() {
  return (
    <group>
      {[LEFT_X, RIGHT_X].map(
        (x) => (
          <mesh
            key={x}
            position={[
              x,
              FLOOR_Y +
                WEIGHT_BASE_CLEARANCE -
                0.04,
              0,
            ]}
            receiveShadow
          >
            <cylinderGeometry
              args={[
                0.62,
                0.7,
                0.1,
                36,
              ]}
            />

            <meshStandardMaterial
              color="#172033"
              metalness={0.42}
              roughness={0.56}
            />
          </mesh>
        ),
      )}
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
        VERTICAL_ROPE_TOP_Y -
          ropeBottomY,
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
      leftPulleyRef.current.rotation.z -=
        pulleyRotationDelta;
    }

    if (rightPulleyRef.current) {
      rightPulleyRef.current.rotation.z +=
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
          CENTER_X,
          FLOOR_Y - 0.42,
          0,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[
            12.5,
            0.72,
            7.2,
          ]}
        />

        <meshStandardMaterial
          color="#26211d"
          roughness={0.8}
          metalness={0.08}
        />
      </mesh>

      {/* Khung chịu lực và hệ ròng rọc */}
      <SupportFrame />

      <Pulley
        groupRef={leftPulleyRef}
        x={LEFT_X}
        z={LEFT_ROPE_Z}
      />

      <Pulley
        groupRef={rightPulleyRef}
        x={RIGHT_X}
        z={RIGHT_ROPE_Z}
      />

      <DriveRopeSystem />

      {/* Hai dây treo thay đổi theo độ cao tạ */}
      <mesh
        ref={leftRopeRef}
        position={[
          LEFT_X,
          PULLEY_Y - 1,
          LEFT_ROPE_Z,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            DRIVE_ROPE_RADIUS,
            DRIVE_ROPE_RADIUS,
            1,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#d6d3d1"
          roughness={0.74}
          metalness={0.05}
        />
      </mesh>

      <mesh
        ref={rightRopeRef}
        position={[
          RIGHT_X,
          PULLEY_Y - 1,
          RIGHT_ROPE_Z,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            DRIVE_ROPE_RADIUS,
            DRIVE_ROPE_RADIUS,
            1,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#d6d3d1"
          roughness={0.74}
          metalness={0.05}
        />
      </mesh>

      {/* Hai khối tạ tương tác trực tiếp */}
      <group
        ref={leftWeightRef}
        position={[
          LEFT_X,
          stopY +
            effectiveDropHeightM,
          LEFT_ROPE_Z,
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
          RIGHT_ROPE_Z,
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

      <WeightCatchPads />
      <HeightScale />

      {/* Bình nhiệt lượng:
          vỏ đồng, nước, vane tĩnh và nhiệt kế */}
      <Calorimeter
        waterRef={waterRef}
      />

      {/* Cụm quay:
          tang cuốn → trục → paddle wheel */}
      <RotatingDriveAssembly
        groupRef={paddleRef}
      />
    </group>
  );
}
